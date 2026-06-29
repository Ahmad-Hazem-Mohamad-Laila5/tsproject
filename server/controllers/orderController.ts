import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js";
import Stripe from "stripe";

// create order
// post / api/orders
export const createOrder = async (req: Request, res: Response) => {
  const { items, paymentMethod } = req.body;
  const shippingAddress = req.body.shippingAddress ??
    req.body.shippingAddrss ?? {
      label: "Home",
      address: "",
      city: "",
      state: "",
      zip: "",
      lat: 0,
      lng: 0,
    };

  // check if order items are empty

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "no order items" });
  }
  // look up actual from the database

  const productIds = items.map((i: any) => i.product);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const productMap: Record<string, (typeof products)[0]> = {};

  products.forEach((p: any) => (productMap[p.id] = p));

  // check if product is in stock

  for (const item of items) {
    const product = productMap[item.product];
    if (!product || (product.stock ?? 0) < item.quantity) {
      return res.status(404).json({ message: "product out of stock" });
    }
  }
  const orderItems = items.map((item: any) => {
    const dbProduct = productMap[item.product];

    if (!dbProduct) throw new Error(`product ${item.product} not found`);
    return {
      product: dbProduct.id,
      name: dbProduct.name,
      image: dbProduct.image,
      price: dbProduct.price,
      quantity: item.quantity,
      unit: dbProduct.unit,
    };
  });
  const subtotal = orderItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = subtotal > 20 ? 0 : 1.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

  const order = await prisma.order.create({
    data: {
      userId: req.user!.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      deliveryFee,
      tax,
      total,
      statusHistory: [
        {
          status: "Placed",
          note: "Order placed successfully",
          timestamp: new Date(),
        },
      ],
    },
  });

  if (paymentMethod === "card") {
    // stripe payment link
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    // create session
    const session = await stripe.checkout.sessions.create({
      success_url: `${req.headers.origin}/orders?clearCart=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkout`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Payment Hazem",
            },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: { orderId: order.id },
    });
    return res.json({ url: session.url });
  }
  res.json({ order });

  // decrease stock

  for (const item of orderItems) {
    await prisma.product.update({
      where: { id: item.product },
      data: { stock: { decrement: item.quantity } },
    });
  }

  // send stock update events for each product in the order
  for (const item of orderItems) {
    await inngest.send({
      name: "inventory/stock.update",
      data: { productId: item.product },
    });
  }
  await inngest.send({ name: "order/placed", data: { orderId: order.id } });
};

// confirm stripe payment after checkout redirect
// get /api/orders/confirm-payment
export const confirmOrderPayment = async (req: Request, res: Response) => {
  const sessionId = req.query.session_id as string;
  if (!sessionId) {
    return res.status(400).json({ message: "session_id is required" });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const orderId = (session.metadata as any)?.orderId as string;
  if (!orderId) {
    return res.status(400).json({ message: "Invalid payment session" });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.isPaid) {
    return res.json({ success: true, order });
  }

  if (session.payment_status !== "paid") {
    return res.status(400).json({ message: "Payment has not completed" });
  }

  const paidOrder = await prisma.order.update({
    where: { id: orderId },
    data: { isPaid: true },
  });

  const orderItems = Array.isArray(paidOrder.items)
    ? (paidOrder.items as { product: string; quantity: number }[])
    : [];
  for (const item of orderItems) {
    await prisma.product.update({
      where: { id: item.product },
      data: { stock: { decrement: item.quantity } },
    });
  }

  for (const item of orderItems) {
    await inngest.send({
      name: "inventory/stock.update",
      data: { productId: item.product },
    });
  }
  await inngest.send({ name: "order/placed", data: { orderId } });

  res.json({ success: true, order: paidOrder });
};

// get user's orders
// get / api/orders
export const getUserOrders = async (req: Request, res: Response) => {
  const { status } = req.query;
  const where: any = {
    userId: req.user!.id,
    NOT: [{ paymentMethod: "card", isPaid: false }],
  };
  if (status && status !== "all") {
    where.status = status;
  }
  const orders = await prisma.order.findMany({
    where,
    include: {
      deliveryPartner: {
        select: { name: true, phone: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ orders });
};

// get single order
// get /api/orders/:id
export const getOrder = async (req: Request, res: Response) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id as string, userId: req.user!.id },
    include: {
      deliveryPartner: {
        select: { name: true, phone: true, avatar: true, vehicleType: true },
      },
    },
  });
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.json({ order });
};

// update order status (admin)
// put / api/orders/:id/status
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { status, note } = req.body;

  const order = await prisma.order.findUnique({
    where: { id: req.params.id as string },
  });
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const history = (
    Array.isArray(order.statusHistory) ? order.statusHistory : []
  ) as any[];
  history.push({
    status,
    note: note || `order ${status.toLowerCase()}`,
    timestamp: new Date(),
  });

  const updateOrder = await prisma.order.update({
    where: { id: req.params.id as string },
    data: { status, statusHistory: history },
  });

  res.json({ order: updateOrder });
};

// get all orders(admin)
// get /api/orders/all
export const getAllOrders = async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { NOT: [{ paymentMethod: "card", isPaid: false }] },
    include: {
      user: { select: { name: true, email: true } },
      deliveryPartner: { select: { name: true, phone: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ orders });
};

// get order location
// get /api/orders/:id/location

export const getOrderLocation = async (req: Request, res: Response) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id as string, userId: req.user!.id },
    select: { liveLocation: true, status: true },
  });
  if (!order) return res.status(404).json({ message: "order not found" });
  res.json({ liveLocation: order.liveLocation, status: order.status });
};
