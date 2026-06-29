import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  PackageIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "lucide-react";
import Loading from "../../components/Loading";
import { statusColors } from "../../assets/assets";
import api from "../../config/api";
import toast from "react-hot-toast";

interface RecentOrder {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items?: { quantity: number }[];
  user?: {
    name?: string;
    email?: string;
  };
}

interface Stats {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  outOfStock: number;
  recentOrders: RecentOrder[];
}

export default function AdminDashboard() {
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch((error: any) => {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load dashboard data",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = useMemo(() => {
    if (!stats) return [];

    return [
      {
        label: "Total orders",
        value: stats.totalOrders,
        icon: ShoppingBagIcon,
        iconWrap: "bg-app-orange/10 text-app-orange",
        hint: "All placed orders",
      },
      {
        label: "Total users",
        value: stats.totalUsers,
        icon: UsersIcon,
        iconWrap: "bg-app-green/10 text-app-green",
        hint: "Registered customers",
      },
      {
        label: "Total products",
        value: stats.totalProducts,
        icon: PackageIcon,
        iconWrap: "bg-blue-50 text-blue-600",
        hint: "Active catalog items",
      },
      {
        label: "Out of stock",
        value: stats.outOfStock,
        icon: AlertTriangleIcon,
        iconWrap: "bg-red-50 text-red-600",
        hint: "Needs restocking",
      },
    ];
  }, [stats]);

  if (loading) {
    return (
      <Loading
        title="Loading dashboard"
        subtitle="Preparing your latest store insights"
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-app-border/70 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="mb-2 inline-flex rounded-full bg-app-orange/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-app-orange">
              Admin overview
            </span>
            <h1 className="text-2xl font-semibold text-app-text sm:text-3xl">
              Store dashboard
            </h1>
            <p className="mt-1 text-sm text-app-text-light">
              Monitor orders, customers, products, and inventory from one place.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 rounded-xl border border-app-border px-4 py-2.5 text-sm font-medium text-app-text transition-colors hover:bg-app-cream"
          >
            View all orders
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-[24px] border border-app-border/70 bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-app-text-light">
                  {card.label}
                </p>
                <p className="mt-2 text-3xl font-semibold tabular-nums text-app-text">
                  {card.value}
                </p>
              </div>

              <div
                className={`flex size-11 items-center justify-center rounded-2xl ${card.iconWrap}`}
              >
                <card.icon className="size-5" />
              </div>
            </div>

            <p className="text-xs leading-6 text-app-text-light">{card.hint}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-[28px] border border-app-border/70 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-app-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-app-text">
              Recent orders
            </h2>
            <p className="mt-1 text-sm text-app-text-light">
              Keep an eye on the latest customer activity.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-app-orange transition-colors hover:text-app-orange-dark"
          >
            View all
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-app-cream/60 text-[11px] font-semibold uppercase tracking-[0.08em] text-app-text-light">
              <tr>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-app-border">
              {!stats?.recentOrders?.length ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-app-text-light"
                  >
                    No orders yet.
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-app-cream/30"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-app-text-light">
                        #{order.id.slice(-6).toUpperCase()}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-app-text">
                        {order.user?.name || "Unknown customer"}
                      </p>
                      <p className="mt-0.5 text-xs text-app-text-light">
                        {order.user?.email || "No email"}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-app-text-light">
                      {order.items?.length || 0} items
                    </td>

                    <td className="px-6 py-4 font-medium tabular-nums text-app-text">
                      {currency}
                      {(order.total || 0).toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusColors[order.status] ||
                          "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-app-text-light">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
