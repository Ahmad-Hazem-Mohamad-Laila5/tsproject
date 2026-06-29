import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Product } from "../types";
import { categoriesData } from "../assets/assets";
import { ChevronDown, Home, SlidersHorizontal, XIcon } from "lucide-react";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import FilterPanel from "../components/FilterPanel";
import api from "../config/api";
import toast from "react-hot-toast";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const category = searchParams.get("category") || "";
  const organic = searchParams.get("organic") || "";
  const sort = searchParams.get("sort") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const page = Number(searchParams.get("page")) || 1;

  const activeCategory = categoriesData.find((c) => c.slug === category);
  const hasFilters = Boolean(
    category || organic || minPrice || maxPrice || sort,
  );

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (category) params.set("category", category);
      if (organic) params.set("organic", organic);
      if (sort) params.set("sort", sort);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);

      params.set("page", String(page));
      params.set("limit", "12");

      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.products || []);
      setTotalPages(Number(data.pages) || 1);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load products",
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    if (key !== "page") {
      newParams.delete("page");
    }

    setSearchParams(newParams);
  };

  const clearFilter = () => {
    setSearchParams({});
    setMobileFiltersOpen(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [category, organic, sort, page, minPrice, maxPrice]);

  return (
    <div className="min-h-screen bg-app-cream">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-app-text-light">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-app-green"
          >
            <Home className="size-4" />
          </Link>
          <span>/</span>
          <span className="text-app-text">
            {activeCategory ? activeCategory.name : "All Products"}
          </span>
        </nav>

        <div className="flex gap-8 xl:gap-10">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-[24px] border border-app-border/70 bg-white p-4 shadow-sm">
              <FilterPanel
                categories={categoriesData}
                category={category}
                organic={organic}
                minPrice={minPrice}
                maxPrice={maxPrice}
                updateFilter={updateFilter}
                clearFilter={clearFilter}
                hasFilters={hasFilters}
              />
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="mb-2 inline-flex rounded-full bg-app-orange/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-app-orange">
                  Collection
                </span>
                <h1 className="text-2xl font-semibold text-app-text sm:text-3xl">
                  {activeCategory ? activeCategory.name : "All Products"}
                </h1>
                <p className="mt-1 text-sm text-app-text-light">
                  {products.length} products found
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-app-border bg-white px-3.5 py-2.5 text-sm text-app-text transition-colors hover:bg-app-cream lg:hidden"
                >
                  <SlidersHorizontal className="size-4" />
                  Filters
                </button>

                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => updateFilter("sort", e.target.value)}
                    className="appearance-none rounded-xl border border-app-border bg-white py-2.5 pl-3 pr-9 text-sm text-app-text outline-none transition-colors focus:border-app-green"
                  >
                    <option value="">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="name">A to Z</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-app-text-light" />
                </div>
              </div>
            </div>

            {loading ? (
              <Loading />
            ) : products.length === 0 ? (
              <div className="rounded-[28px] border border-app-border/70 bg-white px-6 py-16 text-center shadow-sm">
                <p className="mb-2 text-lg font-semibold text-app-text">
                  No products found
                </p>
                <p className="mb-5 text-sm text-app-text-light">
                  Try adjusting your filters or browsing another category.
                </p>
                <button
                  onClick={clearFilter}
                  className="rounded-xl bg-app-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-app-green-light"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
                {products
                  .filter((product) => product.stock > 0)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-14 flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      updateFilter("page", String(i + 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`flex h-10 min-w-[40px] items-center justify-center rounded-xl px-3 text-sm font-medium transition-colors ${
                      page === i + 1
                        ? "bg-app-green text-white"
                        : "bg-white text-app-text-light hover:bg-app-cream"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setMobileFiltersOpen(false)}
          />

          <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-[28px] bg-white shadow-2xl animate-slide-in-up">
            <div className="flex items-center justify-between border-b border-app-border px-4 py-4">
              <h3 className="text-lg font-semibold text-app-text">Filters</h3>
              <button
                className="rounded-lg p-2 transition-colors hover:bg-app-cream"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <div className="p-4">
              <FilterPanel
                categories={categoriesData}
                category={category}
                organic={organic}
                minPrice={minPrice}
                maxPrice={maxPrice}
                updateFilter={updateFilter}
                clearFilter={clearFilter}
                hasFilters={hasFilters}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
