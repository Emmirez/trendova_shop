import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { orderService } from "../../services/apiService";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);

const AdminPayments = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 10;

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getAll({ limit: 200 });
      const orders = response.orders || [];
      
      // Transform orders into payment records
      const paymentRecords = orders.map(order => ({
        ref: order.paymentReference || order.orderNumber,
        orderNumber: order.orderNumber,
        user: order.customer?.name || 'N/A',
        email: order.customer?.email,
        amount: order.total,
        method: order.paymentMethod === 'card' ? 'Card' : 'Bank Transfer',
        status: order.paymentStatus === 'paid' ? 'Successful' : 
                order.orderStatus === 'cancelled' ? 'Refunded' : 'Pending',
        date: new Date(order.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        rawDate: order.createdAt,
      }));
      
      // Sort by date (newest first)
      paymentRecords.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
      setPayments(paymentRecords);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = payments.filter((p) => {
    const matchSearch =
      p.ref.toLowerCase().includes(search.toLowerCase()) ||
      p.user.toLowerCase().includes(search.toLowerCase()) ||
      p.orderNumber?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  
  const totalRevenue = payments
    .filter((p) => p.status === "Successful")
    .reduce((sum, p) => sum + p.amount, 0);
  
  const successfulCount = payments.filter((p) => p.status === "Successful").length;
  const pendingCount = payments.filter((p) => p.status === "Pending").length;
  const refundedCount = payments.filter((p) => p.status === "Refunded").length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 size={40} className="animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: formatPrice(totalRevenue),
            sub: "Successful only",
          },
          { label: "Transactions", value: payments.length, sub: "All time" },
          { label: "Successful", value: successfulCount, sub: "Payments" },
          { label: "Pending", value: pendingCount, sub: "Awaiting approval" },
        ].map(({ label, value, sub }) => (
          <div
            key={label}
            className="p-6 border theme-border rounded-lg"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <p className="font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase mb-2">
              {label}
            </p>
            <p className="font-display font-black theme-text text-2xl">
              {value}
            </p>
            <p className="font-mono text-[9px] theme-text-muted mt-1">
              {sub}
            </p>
          </div>
        ))}
      </div>

      <div
        className="border theme-border rounded-lg"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b theme-border">
          <h3 className="font-mono text-[11px] tracking-[0.3em] theme-text-muted uppercase">
            Payment History{" "}
            <span className="ml-2 text-gold">({filtered.length})</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search
                size={12}
                className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search ref, order or name..."
                className="pl-8 pr-3 py-2 border theme-border theme-text font-body text-xs focus:outline-none focus:border-gold/40 transition-colors w-48 rounded-lg"
                style={{ backgroundColor: "var(--input-bg)" }}
              />
            </div>
            {["All", "Successful", "Pending", "Refunded"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] uppercase border transition-all rounded-lg ${
                  statusFilter === s
                    ? "bg-gold text-obsidian border-gold"
                    : "theme-border theme-text-muted hover:border-gold/40 hover:text-gold"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className="border-b theme-border"
                style={{ backgroundColor: "var(--table-header)" }}
              >
                {[
                  "Order #",
                  "Reference",
                  "Customer",
                  "Amount",
                  "Method",
                  "Status",
                  "Date",
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
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center font-body theme-text-muted text-sm"
                  >
                    No payments found
                  </td>
                </tr>
              ) : (
                paginated.map((payment) => (
                  <tr key={payment.ref} className="transition-colors">
                    <td className="px-6 py-4 font-mono text-[11px] theme-text-secondary tracking-wider">
                      {payment.orderNumber}
                    </td>
                    <td className="px-6 py-4 font-mono text-[10px] theme-text-muted">
                      {payment.ref === payment.orderNumber ? '—' : payment.ref}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-body text-sm theme-text-secondary">
                          {payment.user}
                        </p>
                        <p className="font-mono text-[9px] theme-text-muted">
                          {payment.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body text-gold text-sm font-semibold">
                      {formatPrice(payment.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase px-2 py-1 border theme-border rounded-lg">
                        {payment.method}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] uppercase border rounded-lg ${
                          payment.status === "Successful"
                            ? "text-green-600 bg-green-50 border-green-200"
                            : payment.status === "Pending"
                            ? "text-yellow-600 bg-yellow-50 border-yellow-200"
                            : "text-blue-600 bg-blue-50 border-blue-200"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-body text-xs theme-text-muted">
                      {payment.date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t theme-border">
            <p className="font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase">
              Page {page} of {totalPages} · {filtered.length} results
            </p>
            <div className="flex items-center gap-1 flex-wrap justify-center">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border theme-border theme-text-muted font-mono text-[10px] tracking-[0.2em] uppercase hover:border-gold/40 hover:text-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed rounded-lg"
              >
                ← Prev
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (page <= 3) pageNum = i + 1;
                  else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = page - 2 + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 font-mono text-[10px] border transition-all rounded-lg ${
                        page === pageNum
                          ? "bg-gold text-obsidian border-gold"
                          : "theme-border theme-text-muted hover:border-gold/40 hover:text-gold"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 border theme-border theme-text-muted font-mono text-[10px] tracking-[0.2em] uppercase hover:border-gold/40 hover:text-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed rounded-lg"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;