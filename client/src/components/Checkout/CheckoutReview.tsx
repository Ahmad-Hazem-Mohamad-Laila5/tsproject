import {
  CheckIcon,
  CreditCardIcon,
  MapPinIcon,
  
} from "lucide-react";
import type { Address, CheckoutStep } from "../../types";
import type { Dispatch, SetStateAction } from "react";

interface CheckoutReviewItem {
  quantity: number;
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
}

interface CheckoutReviewProps {
  address: Address;
  items: CheckoutReviewItem[];
  handlePlaceOrder: () => void;
  loading: boolean;
  total: number;
  paymentMethod: string;
  setStep: Dispatch<SetStateAction<CheckoutStep>>;
}

export default function CheckoutReview({
  address,
  items,
  handlePlaceOrder,
  loading,
  total,
  paymentMethod,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setStep,
}: CheckoutReviewProps) {
  const currency = import.meta.env.VITE_CURRENCY || "$";

  return (
    <section className="rounded-[24px] border border-app-border/70 bg-white p-6 shadow-sm animate-fade-in">
      <div className="mb-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-app-text">
          <CheckIcon className="size-5 text-app-green" />
          Review your order
        </h2>
        <p className="mt-1 text-sm text-app-text-light">
          Double-check your details before placing the order.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl bg-app-cream/70 p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MapPinIcon className="size-4 text-app-green" />
              <span className="text-sm font-semibold text-app-text">
                Delivery address
              </span>
            </div>
          </div>

          <p className="text-sm leading-6 text-app-text-light">
            {address.label} — {address.address}, {address.city}, {address.state}{" "}
            {address.zip}
          </p>
        </div>

        <div className="rounded-2xl bg-app-cream/70 p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CreditCardIcon className="size-4 text-app-green" />
              <span className="text-sm font-semibold text-app-text">
                Payment method
              </span>
            </div>
          </div>

          <p className="text-sm text-app-text-light">
            {paymentMethod === "card"
              ? "Credit / Debit Card"
              : "Cash on Delivery"}
          </p>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-app-text">
              Items ({items.length})
            </span>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 rounded-2xl border border-app-border/60 p-3"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="size-14 rounded-xl bg-app-cream object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-app-text">
                    {item.product.name}
                  </p>
                  <p className="mt-1 text-xs text-app-text-light">
                    Qty {item.quantity}
                  </p>
                </div>

                <span className="text-sm font-semibold text-app-text">
                  {currency}
                  {(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-app-border/60 bg-app-cream/50 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-app-text">Amount due</span>
          <span className="text-base font-semibold text-app-green">
            {currency}
            {total.toFixed(2)}
          </span>
        </div>
        <p className="mt-1 text-xs leading-6 text-app-text-light">
          Your order will only be placed after you press the button below.
        </p>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-app-orange py-3 text-sm font-semibold text-white transition-all hover:bg-app-orange-dark disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
      >
        {loading
          ? "Placing order..."
          : `Place order • ${currency}${total.toFixed(2)}`}
      </button>
    </section>
  );
}
