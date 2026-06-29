import React, { useEffect, useState } from "react";
import type { Product } from "../../types";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "../ProductCard";
import api from "../../config/api";
import toast from "react-hot-toast";

const PopularProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api
      .get("/products?sort=rating")
      .then(({ data }) => {
        setProducts(data.products);
      })
      .catch((error: any) => {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load products",
        );
      });
  }, []);

  return (
    <section className="pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-2 inline-flex rounded-full bg-app-orange/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-app-orange">
              Top picks
            </span>
            <h2 className="text-2xl font-semibold text-app-text sm:text-3xl">
              Popular products
            </h2>
            <p className="mt-1 text-sm text-app-text-light">
              Discover this season’s highest-rated essentials.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 self-start rounded-full border border-app-border bg-white px-4 py-2.5 text-sm font-semibold text-app-text transition-all duration-300 hover:-translate-y-0.5 hover:border-app-orange/30 hover:bg-app-orange/5 hover:text-app-orange sm:self-auto"
          >
            View all
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5 xl:gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
