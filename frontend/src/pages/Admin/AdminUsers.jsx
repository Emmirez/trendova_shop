import { useState, useEffect } from "react";
import { Shield, ShieldOff, Trash2, Search, AlertTriangle } from "lucide-react";
import { userService } from "../../services/apiService";
import usePermission from "../../hooks/usePermission";

const roleColors = {
  superadmin: "text-purple-600 bg-purple-50 border-purple-200",
  admin: "text-yellow-700 bg-yellow-50 border-yellow-200",
  user: "text-obsidian/50 bg-obsidian/5 border-obsidian/10",
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const { canPromoteUsers, canDeleteUsers } = usePermission();

  // Fetch users from API
  const fetchUsers = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers({
        page,
        limit: 20,
        search,
      });
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Failed to fetch users:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, userSearch);
  }, [userSearch]);

  const handlePromote = async (userId) => {
    setActionLoading(userId);
    try {
      await userService.promoteToAdmin(userId);
      await fetchUsers(pagination.page, userSearch);
    } catch (err) {
      console.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDemote = async (userId) => {
    setActionLoading(userId);
    try {
      await userService.demoteToUser(userId);
      await fetchUsers(pagination.page, userSearch);
    } catch (err) {
      console.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId) => {
    setActionLoading(userId);
    try {
      await userService.deleteUser(userId);
      setConfirmDelete(null);
      await fetchUsers(pagination.page, userSearch);
    } catch (err) {
      console.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 border border-purple-200 bg-purple-50 rounded-lg">
          <Shield size={16} className="text-purple-500 flex-shrink-0" />
          <p className="font-mono text-[10px] tracking-[0.2em] text-purple-600 uppercase">
            Superadmin access — promote, demote and delete users. All actions
            are logged.
          </p>
        </div>

        <div
          className="border theme-border rounded-lg"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
            <h3 className="font-mono text-[11px] tracking-[0.3em] theme-text-muted uppercase">
              All Users
            </h3>
            <span className="font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase">
              {pagination.total} users
            </span>
          </div>

          <div className="px-6 py-4 border-b theme-border">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 theme-text-muted"
              />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-3 border theme-border theme-text font-body text-sm focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                style={{ backgroundColor: "var(--input-bg)" }}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className="border-b theme-border"
                  style={{ backgroundColor: "var(--table-header)" }}
                >
                  <th className="px-6 py-3 text-left font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left font-mono text-[9px] tracking-[0.2em] theme-text-muted uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border">
                {users.map((u) => (
                  <tr key={u._id} className="transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 rounded-lg">
                          <span className="font-display font-bold text-gold text-sm">
                            {u.name?.charAt(0) || "?"}
                          </span>
                        </div>
                        <span className="font-body text-sm theme-text-secondary">
                          {u.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body text-xs theme-text-muted">
                      {u.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] uppercase border rounded-lg ${roleColors[u.role] || roleColors.user}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-body text-xs theme-text-muted">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] theme-text-secondary">
                      {u.ordersCount || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {canPromoteUsers &&
                          u.role !== "superadmin" &&
                          (u.role === "user" ? (
                            <button
                              onClick={() => handlePromote(u._id)}
                              disabled={actionLoading === u._id}
                              className="flex items-center gap-1 px-2 py-1 border border-gold/30 text-gold hover:border-gold font-mono text-[9px] tracking-[0.1em] uppercase transition-colors disabled:opacity-40 rounded-lg"
                            >
                              <Shield size={11} /> Promote
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDemote(u._id)}
                              disabled={actionLoading === u._id}
                              className="flex items-center gap-1 px-2 py-1 border theme-border theme-text-secondary hover:border-gold/30 hover:text-gold font-mono text-[9px] tracking-[0.1em] uppercase transition-colors disabled:opacity-40 rounded-lg"
                            >
                              <ShieldOff size={11} /> Demote
                            </button>
                          ))}
                        {canDeleteUsers && u.role !== "superadmin" && (
                          <button
                            onClick={() => setConfirmDelete(u)}
                            className="theme-text-muted hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 px-6 py-4 border-t theme-border">
              <button
                onClick={() => fetchUsers(pagination.page - 1, userSearch)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border theme-border theme-text-muted font-mono text-[10px] tracking-[0.2em] uppercase disabled:opacity-30 rounded-lg"
              >
                Previous
              </button>
              <span className="px-4 py-2 font-mono text-[11px] theme-text-secondary">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => fetchUsers(pagination.page + 1, userSearch)}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 border theme-border theme-text-muted font-mono text-[10px] tracking-[0.2em] uppercase disabled:opacity-30 rounded-lg"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-obsidian/50 backdrop-blur-sm z-50 flex items-center justify-center px-6">
          <div
            className="border theme-border p-8 max-w-md w-full shadow-xl rounded-lg"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
              <h3 className="font-display font-bold theme-text text-xl">
                Delete User
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
                className="flex-1 py-3 border theme-border theme-text-secondary font-mono text-[11px] tracking-[0.2em] uppercase hover:border-gold/30 transition-colors rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete._id)}
                disabled={actionLoading === confirmDelete._id}
                className="flex-1 py-3 bg-red-500 text-white font-mono text-[11px] tracking-[0.2em] uppercase hover:bg-red-600 transition-colors disabled:opacity-50 rounded-lg"
              >
                {actionLoading === confirmDelete._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUsers;
