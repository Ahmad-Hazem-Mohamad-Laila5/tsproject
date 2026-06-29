import { CreditCardIcon, BanknoteIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface CheckoutPaymentProps {
  paymentMethod: string;
  setPaymentMethod: Dispatch<SetStateAction<string>>;
}

const methods = [
  {
    value: "card",
    label: "Credit / Debit Card",
    desc: "Pay securely online with your card.",
    icon: CreditCardIcon,
  },
  {
    value: "cash",
    label: "Cash on Delivery",
    desc: "Pay in cash when your order arrives.",
    icon: BanknoteIcon,
  },
];

export default function CheckoutPayment({
  paymentMethod,
  setPaymentMethod,
}: CheckoutPaymentProps) {
  return (
    <section className="rounded-[24px] border border-app-border/70 bg-white p-6 shadow-sm animate-fade-in">
      <div className="mb-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-app-text">
          <CreditCardIcon className="size-5 text-app-green" />
          Payment method
        </h2>
        <p className="mt-1 text-sm text-app-text-light">
          Choose how you would like to pay. You can review everything before
          placing your order.
        </p>
      </div>

      <div className="space-y-3">
        {methods.map((method) => {
          const isActive = paymentMethod === method.value;
          const Icon = method.icon;

          return (
            <label
              key={method.value}
              className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-all ${
                isActive
                  ? "border-app-green bg-app-green/5 shadow-sm"
                  : "border-app-border hover:border-app-green/30 hover:bg-app-cream/40"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={method.value}
                checked={isActive}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 size-4 accent-app-green"
              />

              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-app-cream text-app-green">
                <Icon className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-app-text">
                  {method.label}
                </p>
                <p className="mt-1 text-xs leading-6 text-app-text-light">
                  {method.desc}
                </p>

                {method.value === "card" && isActive && (
                  <p className="mt-2 text-xs font-medium text-app-green">
                    You may be redirected to complete payment securely.
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </section>
  );
}
