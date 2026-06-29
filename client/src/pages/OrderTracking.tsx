import React, { useEffect, useState } from "react";
import type { Order } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import {
  ArrowLeftIcon,
  MapPinIcon,
  PhoneIcon,
  ReceiptTextIcon,
  TruckIcon,
} from "lucide-react";
import OrderOTP from "../components/OrderTracking/OrderOTP";
import LiveMap from "../components/OrderTracking/LiveMap";
import OrderTimeLine from "../components/OrderTracking/OrderTimeLine";
import api from "../config/api";

const OrderTracking = () => {
  const curr = import.meta.env.VITE_CURRENCY || "$";
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveLocation, setLiveLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data.order))
      .catch(() => navigate("/orders"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (
      !id ||
      !order ||
      ["Delivered", "Cancelled", "Placed"].includes(order.status)
    ) {
      return;
    }

    let mounted = true;

    const fetchLocation = async () => {
      try {
        const { data } = await api.get(`/orders/${id}/location`);

        if (
          mounted &&
          data.liveLocation?.lat &&
          data.liveLocation?.lng &&
          data.liveLocation?.updatedAt
        ) {
          setLiveLocation({
            lat: data.liveLocation.lat,
            lng: data.liveLocation.lng,
          });
        }

        if (mounted && data.status && data.status !== order.status) {
          setOrder((prev) => (prev ? { ...prev, status: data.status } : prev));
        }
      } catch {
        //
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [id, order?.status]);

  if (loading) return <Loading />;
  if (!order) return null;

  const statusClass =
    order.status === "Delivered"
      ? "bg-green-100 text-green-700"
      : order.status === "Cancelled"
        ? "bg-red-100 text-red-700"
        : "bg-app-orange/10 text-app-orange";

  return (
    <div className="min-h-screen bg-app-cream pb-20">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/orders")}
          className="mb-6 inline-flex items-center gap-2 text-sm text-app-text-light transition-colors hover:text-app-green"
        >
          <ArrowLeftIcon className="size-4" />
          Back to orders
        </button>

        <div className="mb-8 rounded-[28px] border border-app-border/70 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="mb-2 inline-flex rounded-full bg-app-green/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-app-green">
                Order tracking
              </span>

              <h1 className="text-2xl font-semibold text-app-text sm:text-3xl">
                Order #{order.id.slice(-8).toUpperCase()}
              </h1>

              <p className="mt-1 text-sm text-app-text-light">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <span
              className={`self-start rounded-full px-4 py-1.5 text-sm font-semibold ${statusClass}`}
            >
              {order.status}
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <OrderOTP order={order} />
            <LiveMap order={order} liveLocation={liveLocation} />
            <OrderTimeLine order={order} />

            {order.deliveryPartner &&
              order.status !== "Delivered" &&
              order.status !== "Cancelled" && (
                <div className="flex flex-col gap-4 rounded-[24px] border border-app-border/70 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-app-green text-white">
                      <span className="text-sm font-semibold">
                        {order.deliveryPartner.name.charAt(0)}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-app-text">
                        {order.deliveryPartner.name}
                      </p>
                      <p className="text-xs capitalize text-app-text-light">
                        {order.deliveryPartner.vehicleType} · Delivery partner
                      </p>
                    </div>
                  </div>

                  <a
                    href={`tel:${order.deliveryPartner.phone}`}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-app-cream transition-colors hover:bg-app-cream-dark"
                    aria-label="Call delivery partner"
                  >
                    <PhoneIcon className="size-4 text-app-green" />
                  </a>
                </div>
              )}
          </div>

          <aside className="space-y-5">
            <div className="rounded-[24px] border border-app-border/70 bg-white p-5 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-app-text">
                <MapPinIcon className="size-4" />
                Delivery address
              </h3>

              <p className="text-sm leading-7 text-app-text-light">
                {order.shippingAddress.label}
                <br />
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state},{" "}
                {order.shippingAddress.zip}
              </p>
            </div>

            <div className="rounded-[24px] border border-app-border/70 bg-white p-5 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-app-text">
                <TruckIcon className="size-4" />
                Items ({order.items.length})
              </h3>

              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-11 rounded-xl border border-app-border bg-app-cream object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-app-text">
                        {item.name}
                      </p>
                      <p className="text-xs text-app-text-light">
                        Qty {item.quantity}
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-app-text">
                      {curr}
                      {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2 border-t border-app-border pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-app-text-light">Subtotal</span>
                  <span>
                    {curr}
                    {order.subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-app-text-light">Delivery</span>
                  <span>
                    {order.deliveryFee === 0
                      ? "Free"
                      : `${curr}${order.deliveryFee.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-app-text-light">Tax</span>
                  <span>
                    {curr}
                    {order.tax.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between border-t border-app-border pt-3 font-semibold text-app-text">
                  <span>Total</span>
                  <span>
                    {curr}
                    {order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-app-border/70 bg-white p-5 shadow-sm">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-app-text">
                <ReceiptTextIcon className="size-4" />
                Order support
              </h3>
              <p className="text-sm leading-7 text-app-text-light">
                Need help with this delivery? Contact support with your order
                number for faster assistance.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
