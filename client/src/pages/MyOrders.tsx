import React, { useEffect, useState } from "react";
import type { Order } from "../types";
import { Link, useSearchParams } from "react-router-dom";
import { statusColors } from "../assets/assets";
import { useCart } from "../context/CartContext";
import Loading from "../components/Loading";
import { Calendar1Icon, ChevronRightIcon, PackageIcon } from "lucide-react";
import api from "../config/api";
import toast from "react-hot-toast";

const MyOrders = () => {
  const curr = import.meta.env.DOLLAR || "$";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();

  const tabs = ["all", "Placed", "Out for Delivery", "Delivered"];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = activeTab !== "all" ? `?status=${activeTab}` : "";
      const { data } = await api.get(`/orders${params}`);
      setOrders(data.orders);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error?.message);
    } finally {
      setLoading(false);
    }
  };
  const { clearCart } = useCart();
  useEffect(() => {
    if (searchParams.get("clearCart")) {
      clearCart();
      setSearchParams({});
      setTimeout(() => {
        fetchOrders();
      }, 2000);
    } else {
      fetchOrders();
    }
  }, [activeTab]);
  return (
    <div className=" min-h-screen bg-app-cream mb-20">
      <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className=" text-2xl font-semibold text-app-green mb-6">
          My Orders
        </h1>

        {/* tabs */}
        <div className=" flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${activeTab === tab ? " bg-app-green text-white" : " bg-white text-app-text-light hover:bg-app-cream"}`}
            >
              {tab === "all" ? "All Orders" : tab}
            </button>
          ))}
        </div>
        {/* orders list */}
        {loading ? (
          <Loading />
        ) : orders.length === 0 ? (
          <div className=" text-center py-16">
            <PackageIcon className=" size-16 text-app-border mb-4 mx-auto" />
            <h2 className=" text-lg font-medium text-app-green mb-2">
              No orders yet
            </h2>
            <p className=" text-sm text-app-text-light mb-4">
              Start shopping to see your orders here
            </p>
            <Link to={"/products"}></Link>
          </div>
        ) : (
          <div className=" space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className=" block max-w-4xl bg-white rounded-2xl p-5 hover:shadow-transition-all"
              >
                {/* order id, date & status */}
                <div className=" flex items-start justify-between mb-3">
                  {/* left */}
                  <div className="">
                    <p className=" text-sm font-medium text-app-green">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <div className=" flex items-center gap-2 mt-1">
                      <Calendar1Icon className=" size-3 text-app-text-light" />
                      <span className=" text-xs text-app-text-light">
                        {new Date(order.createdAt).toLocaleDateString("es-Us", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  {/* right */}
                  <div className=" flex items-center gap-2">
                    <span
                      className={`px-4 py-1 text-xs font-medium rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}
                    >
                      {order.status}
                    </span>
                    <ChevronRightIcon className=" size-4 text-app-text-light" />
                  </div>
                </div>
                {/* item thumbnails */}
                <div className=" flex items-center gap-2 mb-3">
                  {order.items.slice(0, 4).map((item, i) => (
                    <img
                      src={item.image}
                      key={i}
                      className=" size-12 sm:size-16 rounded-lg object-cover border border-app-border"
                      alt=""
                    />
                  ))}
                  {order.items.length > 4 && (
                    <div className=" size-12 sm:size-16 bg-app-cream flex-center text-xs font-semibold text-app-text-light">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
                {/* total items & price */}
                <div className=" flex justify-between items-center pt-3 text-sm">
                  <span className=" text-app-text-light">
                    {order.items.length} items
                  </span>
                  <span className=" font-semibold text-app-green">
                    {curr}
                    {order.total.toFixed(2)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
