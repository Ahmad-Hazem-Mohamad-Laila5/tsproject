import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NavigationIcon, PackageIcon, RadarIcon } from "lucide-react";
import OtpModal from "../../components/Delivery/OtpModal";
import CancelModal from "../../components/Delivery/CancelModal";
import DeliveryOrderCard from "../../components/Delivery/DeliveryOrderCard";
import Loading from "../../components/Loading";
import type { Order } from "../../types";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("delivery_token")}`,
  },
});

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"active" | "completed">("active");
  const [tracking, setTracking] = useState(false);

  const [otpModal, setOtpModal] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [cancelModal, setCancelModal] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const watchIdRef = useRef<number | null>(null);
  const lastSentAtRef = useRef<number>(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_URL}/delivery/my-deliveries?status=${tab}`,
        getAuthHeaders(),
      );
      setOrders(data.orders || []);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load deliveries",
      );
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const activeOrders = useMemo(
    () =>
      orders.filter((o) =>
        ["Assigned", "Packed", "Out for Delivery"].includes(o.status),
      ),
    [orders],
  );

  useEffect(() => {
    if (!tracking || activeOrders.length === 0) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported on this device.");
      setTracking(false);
      return;
    }

    const sendLocation = async (position: GeolocationPosition) => {
      const now = Date.now();

      if (now - lastSentAtRef.current < 10000) return;
      lastSentAtRef.current = now;

      const { latitude: lat, longitude: lng } = position.coords;

      try {
        await Promise.all(
          activeOrders.map((order) =>
            axios.put(
              `${API_URL}/delivery/my-deliveries/${order.id}/location`,
              { lat, lng },
              getAuthHeaders(),
            ),
          ),
        );
      } catch {
        // Silent failure to avoid noisy toasts during background tracking
      }
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      sendLocation,
      (error) => {
        toast.error(error.message || "Unable to access your location.");
        setTracking(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 15000,
      },
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [tracking, activeOrders]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await axios.put(
        `${API_URL}/delivery/my-deliveries/${orderId}/status`,
        { status },
        getAuthHeaders(),
      );
      toast.success(`Status updated to ${status}`);
      fetchOrders();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update status",
      );
    }
  };

  const handleComplete = async () => {
    if (!otpModal || !otp.trim()) return;

    setSubmitting(true);
    try {
      await axios.put(
        `${API_URL}/delivery/my-deliveries/${otpModal}/complete`,
        { otp: otp.trim() },
        getAuthHeaders(),
      );
      toast.success("Delivery completed successfully.");
      setOtpModal(null);
      setOtp("");
      fetchOrders();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to complete delivery",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelModal) return;

    setSubmitting(true);
    try {
      await axios.put(
        `${API_URL}/delivery/my-deliveries/${cancelModal}/cancel`,
        { reason: cancelReason.trim() },
        getAuthHeaders(),
      );
      toast.success("Delivery cancelled.");
      setCancelModal(null);
      setCancelReason("");
      fetchOrders();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to cancel delivery",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-app-border/70 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="mb-2 inline-flex rounded-full bg-app-green/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-app-green">
              Delivery workspace
            </span>
            <h1 className="text-2xl font-semibold text-app-text">
              My deliveries
            </h1>
            <p className="mt-1 text-sm text-app-text-light">
              Track active assignments and complete deliveries on time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(["active", "completed"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t
                    ? "bg-app-green text-white"
                    : "border border-app-border bg-white text-app-text-light hover:bg-app-cream"
                }`}
              >
                {t === "active" ? "Active" : "Completed"}
              </button>
            ))}

            <button
              onClick={() => setTracking((prev) => !prev)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                tracking
                  ? "bg-green-600 text-white"
                  : "border border-app-border bg-white text-app-text-light hover:bg-app-cream"
              }`}
            >
              {tracking ? (
                <RadarIcon className="size-4 animate-pulse" />
              ) : (
                <NavigationIcon className="size-4" />
              )}
              {tracking ? "Sharing location" : "Share location"}
            </button>
          </div>
        </div>

        {tracking && activeOrders.length > 0 && (
          <p className="mt-4 text-xs leading-6 text-app-text-light">
            Your location is being shared for active deliveries only.
          </p>
        )}
      </div>

      {loading ? (
        <Loading title="Loading deliveries" subtitle="Please wait a moment" />
      ) : orders.length === 0 ? (
        <div className="rounded-[24px] border border-app-border bg-white py-16 text-center shadow-sm">
          <PackageIcon className="mx-auto mb-3 size-12 text-app-border" />
          <p className="mb-1 text-lg font-semibold text-app-text">
            No {tab} deliveries
          </p>
          <p className="text-sm text-app-text-light">
            {tab === "active"
              ? "New delivery assignments will appear here."
              : "Completed deliveries will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <DeliveryOrderCard
              key={order.id}
              order={order}
              tab={tab}
              handleUpdateStatus={handleUpdateStatus}
              setOtpModal={setOtpModal}
              setCancelModal={setCancelModal}
            />
          ))}
        </div>
      )}

      {otpModal && (
        <OtpModal
          setOtpModal={setOtpModal}
          otp={otp}
          setOtp={setOtp}
          handleComplete={handleComplete}
          submitting={submitting}
        />
      )}

      {cancelModal && (
        <CancelModal
          setCancelModal={setCancelModal}
          cancelReason={cancelReason}
          setCancelReason={setCancelReason}
          handleCancel={handleCancel}
          submitting={submitting}
        />
      )}
    </div>
  );
}
