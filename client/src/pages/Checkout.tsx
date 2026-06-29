import { useMemo, useState, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  ArrowLeft,
  CheckIcon,
  ChevronRightIcon,
  CreditCardIcon,
  MapPinIcon,
} from "lucide-react";
import CheckoutAddress from "../components/Checkout/CheckoutAddress";
import CheckoutPayment from "../components/Checkout/CheckoutPayment";
import CheckoutReview from "../components/Checkout/CheckoutReview";
import api from "../config/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import type { Address, CheckoutStep } from "../types";

const Checkout = () => {
  const navigate = useNavigate();
  const curr = import.meta.env.VITE_CURRENCY || "$";
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState<CheckoutStep>("address");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [address, setAddress] = useState<Address>(() => {
    const defaultAddr =
      user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

    if (!defaultAddr) {
      return {
        id: "",
        label: "Home",
        address: "",
        city: "",
        state: "",
        zip: "",
        isDefault: false,
        lat: 0,
        lng: 0,
      };
    }

    return {
      id: defaultAddr.id || "",
      label: defaultAddr.label || "Home",
      address: defaultAddr.address || "",
      city: defaultAddr.city || "",
      state: defaultAddr.state || "",
      zip: defaultAddr.zip || "",
      isDefault: defaultAddr.isDefault || false,
      lat: defaultAddr.lat || 0,
      lng: defaultAddr.lng || 0,
    };
  });

  const deliveryFee = cartTotal > 20 ? 0 : 1.99;
  const tax = Math.round(cartTotal * 0.08 * 100) / 100;
  const total = Math.round((cartTotal + deliveryFee + tax) * 100) / 100;

  const steps: { key: CheckoutStep; label: string; icon: typeof MapPinIcon }[] = [
    { key: "address", label: "Address", icon: MapPinIcon },
    { key: "payment", label: "Payment", icon: CreditCardIcon },
    { key: "review", label: "Review", icon: CheckIcon },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const canContinueToPayment =
    Boolean(address.address && address.city && address.state && address.zip);

  const handleContinue = () => {
    if (step === "address") {
      if (!canContinueToPayment) {
        toast.error("Please complete your delivery address.");
        return;
      }
      setStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (step === "payment") {
      setStep("review");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      const orderData = {
        items: items.map((cartItem) => ({
          product: cartItem.product.id,
          quantity: cartItem.quantity,
        })),
        shippingAddress: address,
        paymentMethod,
      };

      const { data } = await api.post("/orders", orderData);

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/orders/${data.order?.id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to place order right now."
      );
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-cream px-4">
        <div className="rounded-[28px] border border-app-border/70 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
          <h2 className="mb-2 text-xl font-semibold text-app-text">
            Your cart is empty
          </h2>
          <p className="mb-5 text-sm text-app-text-light">
            Add a few products before continuing to checkout.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="rounded-xl bg-app-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-app-green-light"
          >
            Browse products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-cream">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          className="mb-5 inline-flex items-center gap-2 text-sm text-app-text-light transition-colors hover:text-app-green"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-2 inline-flex rounded-full bg-app-green/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-app-green">
              Secure checkout
            </span>
            <h1 className="text-2xl font-semibold text-app-text sm:text-3xl">
              Checkout
            </h1>
            <p className="mt-1 text-sm text-app-text-light">
              Complete your order in three simple steps.
            </p>
          </div>
        </div>

        <div className="mb-8 overflow-x-auto">
          <div className="flex min-w-max items-center gap-2">
            {steps.map((s, i) => {
              const isActive = step === s.key;
              const isCompleted = i < currentStepIndex;

              return (
                <div key={s.key} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (i <= currentStepIndex) setStep(s.key);
                    }}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-app-green text-white"
                        : isCompleted
                        ? "bg-app-green/10 text-app-green"
                        : "bg-white text-app-text-light"
                    }`}
                  >
                    <s.icon className="size-4" />
                    {s.label}
                  </button>

                  {i < steps.length - 1 && (
                    <ChevronRightIcon className="size-4 text-app-text-light/50" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {step === "address" && (
              <CheckoutAddress
                address={address}
                setAddress={setAddress}
                setStep={setStep}
                user={user}
              />
            )}

            {step === "payment" && (
              <CheckoutPayment
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                setStep={setStep}
              />
            )}

            {step === "review" && (
              <CheckoutReview
                address={address}
                items={items}
                handlePlaceOrder={handlePlaceOrder}
                loading={loading}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                total={total} paymentMethod={""} setStep={function (value: SetStateAction<CheckoutStep>): void {
                  throw new Error("Function not implemented.");
                } }              />
            )}
          </div>

          <aside className="h-fit rounded-[24px] border border-app-border/70 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h3 className="mb-4 text-sm font-semibold text-app-text">
              Order summary
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-app-text-light">
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
                <span>
                  {curr}
                  {cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-app-text-light">Delivery</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="font-medium text-app-success">Free</span>
                  ) : (
                    `${curr}${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-app-text-light">Tax</span>
                <span>
                  {curr}
                  {tax.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between border-t border-app-border pt-3 text-base font-semibold">
                <span className="text-app-text">Total</span>
                <span className="text-app-green">
                  {curr}
                  {total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-5">
              {step !== "review" ? (
                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full rounded-xl bg-app-green px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-app-green-light"
                >
                  {step === "address" ? "Continue to Payment" : "Continue to Review"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full rounded-xl bg-app-orange px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-app-orange-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Placing order..." : "Place order"}
                </button>
              )}
            </div>

            <p className="mt-3 text-xs leading-6 text-app-text-light">
              Taxes and delivery charges are shown before you place the order.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;