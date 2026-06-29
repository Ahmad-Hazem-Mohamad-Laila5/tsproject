import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  EditIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
  PackageIcon,
  AlertTriangleIcon,
} from "lucide-react";
import type { Product } from "../../types";
import Loading from "../../components/Loading";
import api from "../../config/api";
import toast from "react-hot-toast";

export default function AdminProducts() {
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data.products || []);
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return products;

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(normalized) ||
        product.category?.toLowerCase().includes(normalized),
    );
  }, [products, query]);

  const outOfStockCount = useMemo(
    () => products.filter((product) => product.stock <= 0).length,
    [products],
  );

  const handleMarkOutOfStock = async (id: string, name: string) => {
    if (
      !window.confirm(
        `Are you sure you want to mark "${name}" as out of stock?`,
      )
    ) {
      return;
    }

    try {
      await api.put(`/products/${id}`, { stock: 0 });
      toast.success("Product marked as out of stock.");
      fetchProducts();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update product");
    }
  };

  if (loading) {
    return (
      <Loading
        title="Loading products"
        subtitle="Preparing your inventory list"
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-app-border/70 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="mb-2 inline-flex rounded-full bg-app-green/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-app-green">
              Catalog management
            </span>
            <h1 className="text-2xl font-semibold text-app-text sm:text-3xl">
              Products
            </h1>
            <p className="mt-1 text-sm text-app-text-light">
              Manage your catalog, update stock, and keep product details fresh.
            </p>
          </div>

          <Link
            to="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-app-green px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-app-green-light"
          >
            <PlusIcon className="size-4" />
            Add product
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-app-cream/60 p-4">
            <p className="text-sm text-app-text-light">Total products</p>
            <p className="mt-2 text-2xl font-semibold text-app-text">
              {products.length}
            </p>
          </div>

          <div className="rounded-2xl bg-app-cream/60 p-4">
            <p className="text-sm text-app-text-light">In stock</p>
            <p className="mt-2 text-2xl font-semibold text-app-text">
              {products.length - outOfStockCount}
            </p>
          </div>

          <div className="rounded-2xl bg-red-50 p-4">
            <p className="text-sm text-red-600">Out of stock</p>
            <p className="mt-2 text-2xl font-semibold text-red-700">
              {outOfStockCount}
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-app-border/70 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-app-border px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-app-text">
              Inventory list
            </h2>
            <p className="mt-1 text-sm text-app-text-light">
              Browse and update product availability.
            </p>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-app-text-light" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or category"
              className="w-full rounded-xl border border-app-border bg-white py-2.5 pl-10 pr-4 text-sm text-app-text outline-none transition-colors placeholder:text-app-text-light/70 focus:border-app-green"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-app-cream/60 text-[11px] font-semibold uppercase tracking-[0.08em] text-app-text-light">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-app-border">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14">
                    <div className="flex flex-col items-center justify-center text-center">
                      {products.length === 0 ? (
                        <>
                          <PackageIcon className="mb-3 size-12 text-app-border" />
                          <p className="text-lg font-semibold text-app-text">
                            No products yet
                          </p>
                          <p className="mt-1 text-sm text-app-text-light">
                            Add your first product to start building the
                            catalog.
                          </p>
                        </>
                      ) : (
                        <>
                          <AlertTriangleIcon className="mb-3 size-10 text-app-border" />
                          <p className="text-lg font-semibold text-app-text">
                            No matching products
                          </p>
                          <p className="mt-1 text-sm text-app-text-light">
                            Try a different search term.
                          </p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-app-cream/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="size-14 rounded-xl bg-app-cream object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-app-text">
                            {product.name}
                          </p>
                          <p className="mt-0.5 text-xs text-app-text-light">
                            {product.unit || "No unit specified"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-medium tabular-nums text-app-text">
                      {currency}
                      {product.price.toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          product.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-app-text-light">
                      {product.category || "Uncategorized"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          aria-label={`Edit ${product.name}`}
                          className="inline-flex items-center gap-2 rounded-xl border border-app-border bg-white px-3 py-2 text-sm font-medium text-app-text transition-colors hover:bg-app-cream"
                        >
                          <EditIcon className="size-4" />
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            handleMarkOutOfStock(product.id, product.name)
                          }
                          aria-label={`Mark ${product.name} as out of stock`}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                        >
                          <XIcon className="size-4" />
                          Out of stock
                        </button>
                      </div>
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
