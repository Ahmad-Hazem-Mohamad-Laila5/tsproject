import  { useEffect, useState } from "react";
import type { Order } from "../types";
import { Link, useSearchParams } from "react-router-dom";
import { statusColors } from "../assets/assets";
import { useCart } from "../context/CartContext";
import Loading from "../components/Loading";
import { Calendar1Icon, ChevronRightIcon, PackageIcon } from "lucide-react";
import api from "../config/api";
import toast from "react-hot-toast";

const MyOrders = () => {
  const curr = import.meta.env.VITE_CURRENCY || "$";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();

  const { clearCart } = useCart();

  const tabs = ["all", "Placed", "Out for Delivery", "Delivered"];
  const sessionId = searchParams.get("session_id");
  const clearCartParam = searchParams.get("clearCart");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params =
        activeTab !== "all" ? `?status=${encodeURIComponent(activeTab)}` : "";
      const { data } = await api.get(`/orders${params}`);
      setOrders(data.orders || []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load orders",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const processParams = async () => {
      if (sessionId) {
        setLoading(true);
        try {
          await api.get(`/orders/confirm-payment?session_id=${sessionId}`);
          clearCart();
          toast.success("Payment confirmed successfully.");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          toast.error(error?.response?.data?.message || error?.message);
        } finally {
          setSearchParams({});
          fetchOrders();
        }
        return;
      }

      if (clearCartParam) {
        clearCart();
        setSearchParams({});
      }

      fetchOrders();
    };

    processParams();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, sessionId, clearCartParam, setSearchParams]);

  return (
    <div className="min-h-screen bg-app-cream pb-20">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-2 inline-flex rounded-full bg-app-green/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-app-green">
              Account
            </span>
            <h1 className="text-2xl font-semibold text-app-text sm:text-3xl">
              My orders
            </h1>
            <p className="mt-1 text-sm text-app-text-light">
              Track recent purchases and review previous orders.
            </p>
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-app-green text-white"
                  : "bg-white text-app-text-light hover:bg-app-cream"
              }`}
            >
              {tab === "all" ? "All orders" : tab}
            </button>
          ))}
        </div>

        {loading ? (
          <Loading />
        ) : orders.length === 0 ? (
          <div className="rounded-[28px] border border-app-border/70 bg-white px-6 py-16 text-center shadow-sm">
            <PackageIcon className="mx-auto mb-4 size-14 text-app-border" />
            <h2 className="mb-2 text-lg font-semibold text-app-text">
              No orders yet
            </h2>
            <p className="mx-auto mb-5 max-w-md text-sm text-app-text-light">
              You have not placed any orders yet. Start browsing products to see
              your purchases here.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-xl bg-app-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-app-green-light"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="group block rounded-[24px] border border-app-border/70 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-app-text">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-app-text-light">
                      <Calendar1Icon className="size-3.5" />
                      <span className="text-xs">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        statusColors[order.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                    <ChevronRightIcon className="size-4 text-app-text-light transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-2 overflow-x-auto">
                  {order.items.slice(0, 4).map((item, i) => (
                    <img
                      key={i}
                      src={item.image}
                      alt={item.name || "Ordered product"}
                      className="size-14 rounded-xl border border-app-border bg-app-cream object-cover sm:size-16"
                    />
                  ))}

                  {order.items.length > 4 && (
                    <div className="flex size-14 items-center justify-center rounded-xl bg-app-cream text-xs font-semibold text-app-text-light sm:size-16">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-app-border/60 pt-3 text-sm">
                  <span className="text-app-text-light">
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </span>

                  <span className="font-semibold text-app-text">
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
