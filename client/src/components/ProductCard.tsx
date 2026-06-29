import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { Minus, Plus, Star } from "lucide-react";
import { useCart } from "../context/CartContext";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();

  const { addToCart, cartItems, increaseQuantity, decreaseQuantity } =
    useCart();

  const quantity = cartItems?.[product.id] || 0;

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="group cursor-pointer overflow-hidden rounded-[24px] border border-app-border/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative">
        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
          {product.discount > 0 && (
            <span className="rounded-full bg-app-orange px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
              {product.discount}% OFF
            </span>
          )}
        </div>

        <div className="relative flex aspect-[1/1] items-center justify-center overflow-hidden bg-gradient-to-b from-app-cream to-white p-5">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      <div className="space-y-3 p-4">
        {product.rating > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 rounded-full bg-app-warning/10 px-2 py-1">
              <Star className="size-3.5 fill-app-warning text-app-warning" />
              <span className="text-[11px] font-semibold text-app-text">
                {product.rating}
              </span>
            </div>
            <span className="text-[11px] text-app-text-light">
              {product.reviewCount} reviews
            </span>
          </div>
        )}

        <div>
          <h3 className="line-clamp-2 min-h-[44px] text-sm font-medium leading-6 text-app-text">
            {product.name}
          </h3>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-lg font-semibold text-app-text">
                {currency}
                {product.price.toFixed(1)}
              </span>
              <span className="text-xs text-app-text-light">
                / {product.unit}
              </span>
            </div>

            {product.originalPrice > product.price && (
              <div className="mt-1 text-xs text-app-text-light line-through">
                {currency}
                {product.originalPrice.toFixed(1)}
              </div>
            )}
          </div>

          {quantity > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 rounded-full border border-app-border bg-app-cream px-2 py-1.5 shadow-sm"
            >
              <button
                onClick={() => decreaseQuantity(product.id)}
                className="flex size-8 items-center justify-center rounded-full bg-white text-app-text transition hover:bg-app-orange/10 hover:text-app-orange active:scale-95"
                title="Decrease quantity"
              >
                <Minus className="size-4" />
              </button>

              <span className="min-w-[20px] text-center text-sm font-semibold text-app-text">
                {quantity}
              </span>

              <button
                onClick={() => increaseQuantity(product.id)}
                className="flex size-8 items-center justify-center rounded-full bg-app-green text-white transition hover:bg-app-green-light active:scale-95"
                title="Increase quantity"
              >
                <Plus className="size-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="inline-flex items-center justify-center rounded-full bg-app-green px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-app-green-light active:scale-[0.98]"
              title="Add to cart"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
