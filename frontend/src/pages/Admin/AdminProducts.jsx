/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Search, AlertTriangle } from "lucide-react";
import { productService } from "../../services/apiService";
import { uploadImage } from "../../services/uploadService";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);

const categories = [
  "Tracksuits",
  "Couture",
  "Footwear",
  "Accessories",
  "Gadgets",
];
const badges = ["New", "Sale", "Bestseller", "Limited", "Exclusive"];

const emptyForm = {
  name: "",
  category: "",
  price: "",
  originalPrice: "",
  badge: "",
  description: "",
  image: "",
  hoverImage: "",
  colors: "",
  sizes: "",
  tags: "",
  stock: "",
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [hoverUploading, setHoverUploading] = useState(false);

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await productService.getAll();
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

 const handleImageUpload = async (e, field) => {
  const file = e.target.files[0];
  if (!file) return;

  const isHover = field === 'hoverImage';
  isHover ? setHoverUploading(true) : setImageUploading(true);
  setFormError('');

  try {
    const url = await uploadImage(file);
    setForm(prev => ({ ...prev, [field]: url }));
  } catch (err) {
    setFormError(`Upload failed: ${err.message}`);
  } finally {
    isHover ? setHoverUploading(false) : setImageUploading(false);
    // Reset file input so same file can be re-selected
    e.target.value = '';
  }
};

  // Open add form
  const handleAdd = () => {
    setForm(emptyForm);
    setEditProduct(null);
    setFormError("");
    setShowForm(true);
  };

  // Open edit form
  const handleEdit = (product) => {
    setForm({
      name: product.name || "",
      category: product.category || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      badge: product.badge || "",
      description: product.description || "",
      image: product.image || "",
      hoverImage: product.hoverImage || "",
      colors: Array.isArray(product.colors) ? product.colors.join(", ") : "",
      sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : "",
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      stock: product.stock || "",
    });
    setEditProduct(product);
    setFormError("");
    setShowForm(true);
  };

  // Submit form
  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.category ||
      !form.price ||
      !form.description ||
      !form.image
    ) {
      setFormError(
        "Name, category, price, description and image are required.",
      );
      return;
    }

    setFormLoading(true);
    setFormError("");

    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      stock: Number(form.stock) || 0,
      colors: form.colors
        ? form.colors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [],
      sizes: form.sizes
        ? form.sizes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      badge: form.badge || null,
    };

    try {
      if (editProduct) {
        await productService.update(editProduct._id, payload);
      } else {
        await productService.create(payload);
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setFormError(err.message || "Failed to save product");
    } finally {
      setFormLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      await productService.delete(id);
      setConfirmDelete(null);
      fetchProducts();
    } catch (err) {
      setError(err.message || "Failed to delete product");
    }
  };

  // Filter
  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === "All" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <>
      <div
        className="border theme-border"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b theme-border">
          <h3 className="font-mono text-[11px] tracking-[0.3em] theme-text-muted uppercase">
            Products
            <span className="ml-2 text-gold">({filtered.length})</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {/* Search */}
            <div className="relative">
              <Search
                size={12}
                className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="pl-8 pr-3 py-2 border theme-border theme-text font-body text-xs focus:outline-none focus:border-gold/40 transition-colors w-40"
                style={{ backgroundColor: "var(--input-bg)" }}
              />
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-gold text-obsidian font-mono text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors"
            >
              <Plus size={13} />
              Add Product
            </button>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 px-6 py-3 border-b theme-border">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1 font-mono text-[9px] tracking-[0.2em] uppercase border transition-all ${
                categoryFilter === c
                  ? "bg-gold text-obsidian border-gold"
                  : "theme-border theme-text-muted hover:border-gold/40 hover:text-gold"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-4 p-3 border border-red-400/20 bg-red-400/5">
            <p className="font-mono text-[10px] tracking-[0.2em] text-red-400 uppercase">
              {error}
            </p>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            <p className="font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase">
              Loading products...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className="border-b theme-border"
                  style={{ backgroundColor: "var(--table-header)" }}
                >
                  {[
                    "Name",
                    "Category",
                    "Price",
                    "Stock",
                    "Badge",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y theme-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center font-body theme-text-muted text-sm"
                    >
                      No products found
                    </td>
                  </tr>
                ) : (
                  filtered.map((product) => (
                    <tr key={product._id} className="transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-12 object-cover flex-shrink-0"
                            />
                          )}
                          <p className="font-body text-sm theme-text-secondary">
                            {product.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-[10px] theme-text-muted uppercase tracking-wider">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 font-body text-gold text-sm font-semibold">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-mono text-[10px] tracking-wider ${product.stock <= 3 ? "text-red-500" : "text-green-500"}`}
                        >
                          {product.stock} left
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-[9px] tracking-[0.2em] text-gold uppercase">
                          {product.badge || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleEdit(product)}
                            className="theme-text-muted hover:text-gold transition-colors"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(product)}
                            className="theme-text-muted hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-12 overflow-y-auto">
          <div
            className="w-full max-w-2xl border theme-border shadow-2xl"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
              <h3 className="font-display font-bold theme-text text-lg">
                {editProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {formError && (
                <div className="p-3 border border-red-400/20 bg-red-400/5">
                  <p className="font-mono text-[10px] tracking-[0.2em] text-red-400 uppercase">
                    {formError}
                  </p>
                </div>
              )}

              {/* Row 1 — Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Onyx Velour Tracksuit"
                    className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors"
                    style={{ backgroundColor: "var(--input-bg)" }}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors appearance-none"
                    style={{ backgroundColor: "var(--input-bg)" }}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2 — Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    placeholder="450000"
                    className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors"
                    style={{ backgroundColor: "var(--input-bg)" }}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    Original Price (₦)
                  </label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) =>
                      setForm({ ...form, originalPrice: e.target.value })
                    }
                    placeholder="600000 (optional)"
                    className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors"
                    style={{ backgroundColor: "var(--input-bg)" }}
                  />
                </div>
              </div>

              {/* Row 3 — Stock & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    placeholder="10"
                    className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors"
                    style={{ backgroundColor: "var(--input-bg)" }}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    Badge
                  </label>
                  <select
                    value={form.badge}
                    onChange={(e) =>
                      setForm({ ...form, badge: e.target.value })
                    }
                    className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors appearance-none"
                    style={{ backgroundColor: "var(--input-bg)" }}
                  >
                    <option value="">No badge</option>
                    {badges.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                  Description *
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Product description..."
                  className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors resize-none"
                  style={{ backgroundColor: "var(--input-bg)" }}
                />
              </div>

              {/* Image Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    Product Image *
                  </label>
                  {form.image && (
                    <img
                      src={form.image}
                      alt="preview"
                      className="w-full h-32 object-cover mb-2 border theme-border"
                    />
                  )}
                  <label className="w-full flex items-center justify-center gap-2 py-3 border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all cursor-pointer font-mono text-[10px] tracking-[0.2em] uppercase">
                    {imageUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Plus size={13} />
                        {form.image ? "Change Image" : "Upload Image"}
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, "image")}
                    />
                  </label>
                  {/* Also allow URL input as fallback */}
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                    placeholder="Or paste image URL..."
                    className="w-full border theme-border theme-text font-body text-xs px-4 py-2 mt-2 focus:outline-none focus:border-gold/40 transition-colors"
                    style={{ backgroundColor: "var(--input-bg)" }}
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    Hover Image
                  </label>
                  {form.hoverImage && (
                    <img
                      src={form.hoverImage}
                      alt="hover preview"
                      className="w-full h-32 object-cover mb-2 border theme-border"
                    />
                  )}
                  <label className="w-full flex items-center justify-center gap-2 py-3 border theme-border theme-text-muted hover:border-gold/40 hover:text-gold transition-all cursor-pointer font-mono text-[10px] tracking-[0.2em] uppercase">
                    {hoverUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Plus size={13} />
                        {form.hoverImage
                          ? "Change Image"
                          : "Upload Hover Image"}
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, "hoverImage")}
                    />
                  </label>
                  <input
                    type="text"
                    value={form.hoverImage}
                    onChange={(e) =>
                      setForm({ ...form, hoverImage: e.target.value })
                    }
                    placeholder="Or paste image URL..."
                    className="w-full border theme-border theme-text font-body text-xs px-4 py-2 mt-2 focus:outline-none focus:border-gold/40 transition-colors"
                    style={{ backgroundColor: "var(--input-bg)" }}
                  />
                </div>
              </div>

              {/* Colors, Sizes, Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    Colors
                  </label>
                  <input
                    type="text"
                    value={form.colors}
                    onChange={(e) =>
                      setForm({ ...form, colors: e.target.value })
                    }
                    placeholder="#000000, #ffffff"
                    className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors"
                    style={{ backgroundColor: "var(--input-bg)" }}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    Sizes
                  </label>
                  <input
                    type="text"
                    value={form.sizes}
                    onChange={(e) =>
                      setForm({ ...form, sizes: e.target.value })
                    }
                    placeholder="S, M, L, XL"
                    className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors"
                    style={{ backgroundColor: "var(--input-bg)" }}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="luxury, premium"
                    className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors"
                    style={{ backgroundColor: "var(--input-bg)" }}
                  />
                </div>
              </div>

              <p className="font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase">
                * Colors, Sizes and Tags — separate with commas
              </p>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t theme-border">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 border theme-border theme-text-secondary font-mono text-[11px] tracking-[0.2em] uppercase hover:border-gold/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={formLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                {formLoading ? (
                  <div className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                ) : null}
                {formLoading
                  ? "Saving..."
                  : editProduct
                    ? "Update Product"
                    : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-obsidian/50 backdrop-blur-sm z-50 flex items-center justify-center px-6">
          <div
            className="border theme-border p-8 max-w-md w-full shadow-xl"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
              <h3 className="font-display font-bold theme-text text-xl">
                Delete Product
              </h3>
            </div>
            <p className="font-body theme-text-secondary text-sm mb-2">
              Are you sure you want to delete{" "}
              <span className="theme-text font-semibold">
                {confirmDelete.name}
              </span>
              ?
            </p>
            <p className="font-body text-red-500/70 text-xs mb-8">
              This action is permanent and cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 border theme-border theme-text-secondary font-mono text-[11px] tracking-[0.2em] uppercase hover:border-gold/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete._id)}
                className="flex-1 py-3 bg-red-500 text-white font-mono text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProducts;
