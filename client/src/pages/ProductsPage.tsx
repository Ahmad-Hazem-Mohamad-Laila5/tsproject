import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { Product } from "../types";
import Loading from "../components/Loading";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  HomeIcon,
  LeafIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  StarIcon,
} from "lucide-react";
import DummyReviewsSection from "../assets/DummyReviewsSection";
import ProductCard from "../components/ProductCard";
import api from "../config/api";

const ProductsPage = () => {
  const curr = import.meta.env.VITE_CURRENCY || "$";

  const { id } = useParams();
  const navigate = useNavigate();
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [localQuantity, setLocalQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setLocalQuantity(1);
    window.scrollTo({ top: 0, behavior: "smooth" });

    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data.product);
        return api.get(`/products?category=${data.product.category}&limit=6`);
      })
      .then(({ data }) => {
        setRelatedProducts(data.products.filter((p: Product) => p.id !== id));
      })
      .catch(() => navigate("/products"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <Loading />;
  if (!product) return null;

  const cartItem = items.find((item) => item.product.id === product.id);
  const inCart = Boolean(cartItem);
  const displayQuantity = inCart ? cartItem.quantity : localQuantity;
  const categoryLabel = product.category.replace(/-/g, " ");

  const handleMinus = () => {
    if (inCart && cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(product.id, cartItem.quantity - 1);
      } else {
        removeFromCart(product.id);
      }
      return;
    }

    setLocalQuantity((prev) => Math.max(1, prev - 1));
  };

  const handlePlus = () => {
    if (inCart && cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1);
      return;
    }

    setLocalQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (!inCart) {
      addToCart(product, localQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-app-cream">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-app-text-light">
          <Link to="/" className="transition-colors hover:text-app-green">
            <HomeIcon className="size-4" />
          </Link>

          <span>/</span>

          <Link
            to="/products"
            className="transition-colors hover:text-app-green"
          >
            Products
          </Link>

          <span>/</span>

          <Link
            to={`/products?category=${product.category}`}
            className="capitalize transition-colors hover:text-app-green"
          >
            {categoryLabel}
          </Link>

          <span>/</span>

          <span className="max-w-[220px] truncate font-medium text-app-text">
            {product.name}
          </span>
        </nav>

        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-app-text-light transition-colors hover:text-app-green"
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </button>

        <section className="overflow-hidden rounded-[28px] border border-app-border/60 bg-white shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="relative border-b border-app-border/50 bg-gradient-to-br from-white to-app-cream/60 lg:border-b-0 lg:border-r">
              <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-2">
                {product.isOrganic && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-app-green px-3 py-1 text-xs font-semibold text-white">
                    <LeafIcon className="size-3.5" />
                    Organic
                  </span>
                )}

                {product.discount > 0 && (
                  <span className="rounded-full bg-app-orange px-3 py-1 text-xs font-semibold text-white">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              <div className="flex min-h-[320px] items-center justify-center p-8 sm:p-10 lg:min-h-[560px] lg:p-14">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-[420px] w-auto object-contain drop-shadow-sm"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <span className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-app-text-light">
                {categoryLabel}
              </span>

              <h1 className="mb-3 text-2xl font-semibold text-app-text sm:text-3xl">
                {product.name}
              </h1>

              {product.rating > 0 && (
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`size-4 ${
                          star <= Math.round(product.rating)
                            ? "fill-app-warning text-app-warning"
                            : "text-app-border"
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-sm font-medium text-app-text">
                    {product.rating}
                  </span>

                  <span className="text-sm text-app-text-light">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              )}

              <div className="mb-5 flex items-end gap-3">
                <span className="text-3xl font-semibold text-app-green sm:text-4xl">
                  {curr}
                  {product.price.toFixed(2)}
                </span>

                {product.originalPrice > product.price && (
                  <span className="pb-1 text-base text-app-text-light line-through sm:text-lg">
                    {curr}
                    {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="mb-6 max-w-xl text-sm leading-7 text-app-text-light sm:text-base">
                {product.description}
              </p>

              <div className="mb-6 flex flex-wrap items-center gap-3">
                {product.stock > 0 ? (
                  <span className="rounded-full bg-app-success/10 px-3 py-1.5 text-xs font-semibold text-app-success">
                    In stock · {product.stock} available
                  </span>
                ) : (
                  <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-app-error">
                    Out of stock
                  </span>
                )}

                {inCart && (
                  <span className="rounded-full bg-app-green/10 px-3 py-1.5 text-xs font-semibold text-app-green">
                    Already in cart
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <div className="flex h-12 items-center justify-between rounded-xl border border-app-border bg-white sm:w-[150px]">
                  <button
                    onClick={handleMinus}
                    className="flex h-full w-12 items-center justify-center rounded-l-xl transition-colors hover:bg-app-cream"
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon className="size-4" />
                  </button>

                  <span className="min-w-[40px] text-center text-sm font-semibold text-app-text">
                    {displayQuantity}
                  </span>

                  <button
                    onClick={handlePlus}
                    className="flex h-full w-12 items-center justify-center rounded-r-xl transition-colors hover:bg-app-cream"
                    aria-label="Increase quantity"
                  >
                    <PlusIcon className="size-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${
                    inCart
                      ? "border border-app-green bg-app-green/5 text-app-green"
                      : "bg-app-orange text-white hover:bg-app-orange-dark"
                  }`}
                >
                  <ShoppingCartIcon className="size-4" />
                  {inCart ? "In Cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {product.reviewCount > 0 && <DummyReviewsSection product={product} />}

        {relatedProducts.length > 0 && (
          <section className="mb-28 mt-12">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-app-text">
                  Related products
                </h2>
                <p className="mt-1 text-sm text-app-text-light">
                  More from {categoryLabel}
                </p>
              </div>

              <Link
                to={`/products?category=${product.category}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-app-green transition-colors hover:text-app-green-light"
              >
                View all
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:gap-6">
              {relatedProducts.slice(0, 5).map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
