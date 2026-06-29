import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ImageIcon,
  PackageIcon,
  SaveIcon,
  TagIcon,
} from "lucide-react";
import { categoriesData } from "../../assets/assets";
import Loading from "../../components/Loading";
import api from "../../config/api";
import toast from "react-hot-toast";

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    image: "",
    category: "",
    unit: "",
    stock: "",
    isOrganic: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isEdit) {
          setLoading(false);
          return;
        }

        const { data: prodData } = await api.get(`/products/${id}`);
        const p = prodData.product;

        setFormData({
          name: p.name || "",
          description: p.description || "",
          price: p.price?.toString() || "",
          originalPrice: p.originalPrice ? p.originalPrice.toString() : "",
          image: p.image || "",
          category: p.category || "",
          unit: p.unit || "",
          stock: p.stock?.toString() || "",
          isOrganic: Boolean(p.isOrganic),
        });
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to load product data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEdit]);

  const imagePreview = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return formData.image || "";
  }, [imageFile, formData.image]);

  useEffect(() => {
    return () => {
      if (imageFile && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imageFile, imagePreview]);

  const handleChange = (
    key: keyof typeof formData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalImageUrl = formData.image;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("image", imageFile);

        const { data } = await api.post("/upload", uploadData);
        finalImageUrl = data.url;
      }

      if (!finalImageUrl) {
        toast.error("Please upload a product image.");
        setSaving(false);
        return;
      }

      const payload = {
        ...formData,
        image: finalImageUrl,
        price: Number(formData.price),
        originalPrice: formData.originalPrice
          ? Number(formData.originalPrice)
          : 0,
        stock: Number(formData.stock),
      };

      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast.success("Product updated successfully.");
      } else {
        await api.post("/products", payload);
        toast.success("Product created successfully.");
      }

      navigate("/admin/products");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to save product. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Loading
        title={isEdit ? "Loading product details" : "Preparing form"}
        subtitle="Please wait a moment"
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-app-border/70 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Link
              to="/admin/products"
              className="flex size-10 items-center justify-center rounded-xl border border-app-border bg-white text-app-text-light transition-colors hover:bg-app-cream hover:text-app-text"
            >
              <ArrowLeftIcon className="size-5" />
            </Link>

            <div>
              <span className="mb-2 inline-flex rounded-full bg-app-orange/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-app-orange">
                {isEdit ? "Edit product" : "New product"}
              </span>
              <h1 className="text-2xl font-semibold text-app-text sm:text-3xl">
                {isEdit ? "Update product details" : "Create a new product"}
              </h1>
              <p className="mt-1 text-sm text-app-text-light">
                Add product information, inventory, pricing, and media.
              </p>
            </div>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <section className="rounded-[28px] border border-app-border/70 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <PackageIcon className="size-5 text-app-green" />
              <h2 className="text-lg font-semibold text-app-text">
                Product details
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-app-text">
                  Product name
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full rounded-xl border border-app-border bg-white px-4 py-3 text-sm text-app-text outline-none transition-colors placeholder:text-app-text-light/70 focus:border-app-green"
                  placeholder="e.g. Organic Avocado"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-app-text">
                  Category
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full rounded-xl border border-app-border bg-white px-4 py-3 text-sm text-app-text outline-none transition-colors focus:border-app-green"
                >
                  <option value="">Select a category</option>
                  {categoriesData.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-app-text">
                  Unit
                </label>
                <input
                  required
                  type="text"
                  value={formData.unit}
                  onChange={(e) => handleChange("unit", e.target.value)}
                  className="w-full rounded-xl border border-app-border bg-white px-4 py-3 text-sm text-app-text outline-none transition-colors focus:border-app-green"
                  placeholder="kg, piece, liter"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-app-text">
                  Description
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full resize-none rounded-xl border border-app-border bg-white px-4 py-3 text-sm text-app-text outline-none transition-colors focus:border-app-green"
                  placeholder="Write a short product description"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-app-border/70 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <TagIcon className="size-5 text-app-green" />
              <h2 className="text-lg font-semibold text-app-text">
                Pricing & inventory
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-app-text">
                  Price ({currency})
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  className="w-full rounded-xl border border-app-border bg-white px-4 py-3 text-sm text-app-text outline-none transition-colors focus:border-app-green"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-app-text">
                  Original price ({currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    handleChange("originalPrice", e.target.value)
                  }
                  className="w-full rounded-xl border border-app-border bg-white px-4 py-3 text-sm text-app-text outline-none transition-colors focus:border-app-green"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-app-text">
                  Stock quantity
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleChange("stock", e.target.value)}
                  className="w-full rounded-xl border border-app-border bg-white px-4 py-3 text-sm text-app-text outline-none transition-colors focus:border-app-green"
                />
              </div>

              <div className="flex items-end">
                <label className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-app-border bg-app-cream/50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-app-text">
                      Organic product
                    </p>
                    <p className="mt-1 text-xs text-app-text-light">
                      Mark this product as organic in the storefront.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={formData.isOrganic}
                    onChange={(e) =>
                      handleChange("isOrganic", e.target.checked)
                    }
                    className="size-5 rounded border-app-border text-app-green focus:ring-app-green"
                  />
                </label>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-app-border/70 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <ImageIcon className="size-5 text-app-green" />
              <h2 className="text-lg font-semibold text-app-text">
                Product image
              </h2>
            </div>

            <div className="rounded-2xl border border-dashed border-app-border bg-app-cream/50 p-4">
              <div className="mb-4 overflow-hidden rounded-2xl bg-white">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center text-sm text-app-text-light">
                    No image selected
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full cursor-pointer rounded-xl border border-app-border bg-white px-4 py-3 text-sm text-app-text file:mr-4 file:rounded-lg file:border-0 file:bg-app-orange file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-app-orange-dark"
              />

              <p className="mt-3 text-xs leading-6 text-app-text-light">
                Upload a clear product photo. Square or slightly vertical images
                work best.
              </p>
            </div>
          </section>

          <section className="rounded-[28px] border border-app-border/70 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-app-text">Actions</h2>

            <div className="mt-5 space-y-3">
              <button
                disabled={saving}
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-app-orange px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-app-orange-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                <SaveIcon className="size-4" />
                {saving
                  ? "Saving..."
                  : isEdit
                    ? "Save changes"
                    : "Create product"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="w-full rounded-xl border border-app-border px-5 py-3 text-sm font-medium text-app-text transition-colors hover:bg-app-cream"
              >
                Cancel
              </button>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
