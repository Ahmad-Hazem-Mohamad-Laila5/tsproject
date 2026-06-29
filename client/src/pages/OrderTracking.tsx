import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dummyDashboardOrdersData } from "../assets/assets";
import Loading from "../components/Loading";
import { ArrowLeftIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import OrderOTP from "../components/OrderTracking/OrderOTP";
import LiveMap from "../components/OrderTracking/LiveMap";
import OrderTimeLine from "../components/OrderTracking/OrderTimeLine";
import api from "../config/api";

const OrderTracking = () => {
  const { id } = useParams();
  const navi = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveLocatoin, setLiveLocatoin] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data.order))
      .catch(() => navi("/orders"))
      .finally(() => setLoading(false));
  }, [id, navi]);
  // live location every 10 secodns
  useEffect(() => {
    if (!order || ["Delivered", "Cancelled", "Placed"].includes(order.status)) {
      return;
    }
    const fetchLoaction = async () => {
      try {
        const { data } = await api.get(`/orders/${id}/location`);
        if (
          data.liveLocation?.lat &&
          data.liveLocation?.lng &&
          data.liveLocation.updatedAt
        ) {
          setLiveLocatoin({
            lat: data.liveLocation.lat,
            lng: data.liveLocation.lng,
          });
        }
        // Also update order status if it changed
        if (data.status && data.status !== order.status) {
          setOrder((prev) => (prev ? { ...prev, status: data.status } : prev));
        }
      } catch (error) {}
    };
    fetchLoaction();
    const interval = setInterval(fetchLoaction, 1000);
    return () => clearInterval(interval);
  }, [id, order?.status]);
  if (loading) {
    return <Loading />;
  }
  if (!order) {
    return null;
  }
  return (
    <div className=" min-h-screen mb-20 bg-app-cream">
      <div className=" max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* header */}
        <button
          onClick={() => navi("/orders")}
          className=" flex items-center gap-2 text-sm text-app-text-light hover:text-app-green mb-6 transition-colors"
        >
          <ArrowLeftIcon className=" size-4" />
          Back to orders
        </button>
        {/* order id, date, status */}
        <div className=" flex items-center justify-between mb-8">
          <div className="">
            <h1>Order #{order!.id.slice(-8).toUpperCase()}</h1>
            <p className=" text-sm text-app-text-light mt-1">
              Placed on{" "}
              {new Date(order!.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <span
            className={`px-4 py-1.5 text-sm font-semibold rounded-full ${order!.status === "Delivered" ? "bg-green-100 text-green-700" : order!.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-app-orange/10 text-app-orange"}`}
          >
            {order!.status}
          </span>
        </div>
        <div className=" grid lg:grid-cols-3 gap-6">
          {/* left site - timeline + map area */}
          <div className=" lg:col-span-2 space-y-6">
            {/* otp card */}
            <OrderOTP order={order} />
            {/* live tracking map */}
            <LiveMap order={order} liveLocation={liveLocatoin} />
            {/* progress timeline */}
            <OrderTimeLine order={order} />
            {/* delivery person */}
            {order?.deliveryPartner &&
              order.status !== "Delivered" &&
              order.status !== "Cancelled" && (
                <div className=" bg-white rounded-2xl p-5 flex items-center justify-between">
                  <div className=" flex items-center gap-3">
                    <div className=" size-11 rounded-full bg-app-green flex-center">
                      <span className=" text-white font-semibold text-sm">
                        {order.deliveryPartner.name.charAt(0)}
                      </span>
                    </div>
                    <div className="">
                      <p className=" text-sm font-semibold text-app-green">
                        {order.deliveryPartner.name}
                      </p>
                      <p className=" text-xs text-app-text-light capitalize">
                        {order.deliveryPartner.vehicleType} - Delivery Partner
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${order.deliveryPartner.phone}`}
                    className=" p-2.5 bg-app-cream rounded-xl hover:bg-app-cream-dark transition-colors"
                  >
                    <PhoneIcon className=" size-4 text-app-green" />
                  </a>
                </div>
              )}
          </div>
          {/* right side - order details sidebar */}
          <div className=" space-y-5">
            {/* delivery address */}
            <div className=" bg-white rounded-2xl p-5">
              <h3 className=" text-sm font-semibold text-app-green mb-3 flex items-center gap-2">
                <MapPinIcon className=" size-4" />
                Delivery Address
              </h3>
              <p className=" text-sm text-app-text-light leading-relaxed">
                {order?.shippingAddress.lable}
                <br />
                {order?.shippingAddress.address}
                <br />
                {order?.shippingAddress.city} , {order?.shippingAddress.state} ,
                {order?.shippingAddress.zip}
              </p>
            </div>
            {/* items */}
            <div className=" bg-white rounded-2xl p-5">
              <h3 className=" text-sm font-semibold text-app-green mb-3">
                Items ({order?.items.length})
              </h3>
              <div className=" space-y-3">
                {order?.items.map((item, i) => (
                  <div key={i} className=" flex items-center gap-3">
                    <img
                      src={item.image}
                      className=" size-10 rounded-lg object-cover"
                      alt=""
                    />
                    <div className=" flex-1 min-w-0">
                      <p className=" text-sm font-medium text-app-green truncate">
                        {item.name}
                      </p>
                      <p className=" text-xs text-app-text-light">
                        x{item.quantity}
                      </p>
                    </div>
                    <span className=" text-sm font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className=" mt-4 pt-3 border-t border-app-border space-y-1.5 text-sm">
                <div className=" flex justify-between">
                  <span className=" text-app-text-light">Subtotal</span>
                  <span className="">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className=" flex justify-between">
                  <span className=" text-app-text-light">Delivery</span>
                  <span className="">
                    {order?.deliveryFee === 0
                      ? "Free"
                      : `${order?.deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className=" flex justify-between">
                  <span className=" text-app-text-light">Tax</span>
                  <span className="">{order?.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-app-border font-semibold text-app-green">
                  <span className="">Total</span>
                  <span className="">{order?.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
