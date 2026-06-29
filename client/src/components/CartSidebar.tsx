import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  ArrowRightIcon,
  Minus,
  Plus,
  ShoppingBagIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";

const CartSidebar = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "$";

  if (!isCartOpen) return null;

  const deliveryFee = cartTotal > 20 ? 0 : 1.99;
  const grandTotal = cartTotal + deliveryFee;

  return (
    <>
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 z-50 bg-app-text/40 backdrop-blur-[2px]"
      />

      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-app-border bg-white shadow-2xl animate-slide-in-right">
        <div className="border-b border-app-border px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-app-cream text-app-green">
                <ShoppingBagIcon className="size-5" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-app-text">
                  Your cart
                </h2>
                <p className="text-xs text-app-text-light">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="flex size-10 items-center justify-center rounded-xl text-app-text-light transition-colors hover:bg-app-cream hover:text-app-text"
              aria-label="Close cart"
            >
              <XIcon className="size-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-app-cream text-app-text-light">
                <ShoppingBagIcon className="size-8" />
              </div>
              <h3 className="text-lg font-semibold text-app-text">
                Your cart is empty
              </h3>
              <p className="mt-1 max-w-[240px] text-sm text-app-text-light">
                Add some fresh picks to start your order.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="rounded-[22px] border border-app-border/70 bg-gradient-to-b from-white to-app-cream p-3 shadow-sm"
                >
                  <div className="flex gap-3">
                    <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="line-clamp-2 text-sm font-semibold leading-5 text-app-text">
                            {item.product.name}
                          </h4>
                          <p className="mt-1 text-xs text-app-text-light">
                            {currency}
                            {item.product.price.toFixed(2)} /{" "}
                            {item.product.unit}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg text-app-text-light transition-colors hover:bg-white hover:text-app-error"
                          aria-label="Remove item"
                          title="Remove item"
                        >
                          <Trash2Icon className="size-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 rounded-full border border-app-border bg-white px-1.5 py-1 shadow-sm">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="flex size-8 items-center justify-center rounded-full text-app-text transition hover:bg-app-orange/10 hover:text-app-orange"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-4" />
                          </button>

                          <span className="min-w-[22px] text-center text-sm font-semibold text-app-text">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="flex size-8 items-center justify-center rounded-full bg-app-green text-white transition hover:bg-app-green-light"
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-app-text">
                            {currency}
                            {(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-app-border bg-white px-5 py-5">
            <div className="mb-4 rounded-2xl bg-app-cream px-4 py-3 text-center">
              {deliveryFee === 0 ? (
                <p className="text-sm font-medium text-app-success">
                  You unlocked free delivery
                </p>
              ) : (
                <p className="text-sm text-app-text-light">
                  Add{" "}
                  <span className="font-semibold text-app-text">
                    {currency}
                    {(20 - cartTotal).toFixed(2)}
                  </span>{" "}
                  more to get free delivery.
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-app-text-light">Subtotal</span>
                <span className="font-medium text-app-text">
                  {currency}
                  {cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-app-text-light">Delivery</span>
                <span className="font-medium text-app-text">
                  {deliveryFee === 0
                    ? "Free"
                    : `${currency}${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-app-border pt-3 text-base font-semibold">
                <span className="text-app-text">Total</span>
                <span className="text-app-text">
                  {currency}
                  {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate("/checkout");
                window.scrollTo(0, 0);
              }}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-app-green px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-app-green-light active:scale-[0.98]"
            >
              Proceed to checkout
              <ArrowRightIcon className="size-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;
