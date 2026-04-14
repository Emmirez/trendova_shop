const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Token management
const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");
const setTokens = (access, refresh) => {
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
};
const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

// Refresh access token using refresh token
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    throw new Error("Session expired. Please login again.");
  }

  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
};

// Core fetch with auto token refresh
const apiFetch = async (endpoint, options = {}, retry = true) => {
  const token = getAccessToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Token expired — try refresh once
  if (res.status === 401 && retry) {
    try {
      const newToken = await refreshAccessToken();
      return apiFetch(
        endpoint,
        {
          ...options,
          headers: { ...headers, Authorization: `Bearer ${newToken}` },
        },
        false,
      );
    } catch {
      clearTokens();
      throw new Error("Session expired. Please login again."); // ← this
    }
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// Auth endpoints
const authService = {
  login: (credentials) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  logout: () =>
    apiFetch("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken: getRefreshToken() }),
    }),

  getMe: () => apiFetch("/auth/me"),

  refreshToken: refreshAccessToken,
};

// User endpoints
const userService = {
  // UPDATED: Accept query parameters for pagination, search, role filtering
  getAllUsers: ({ page = 1, limit = 20, search = "", role = "" } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (search) params.append("search", search);
    if (role) params.append("role", role);

    return apiFetch(`/users?${params.toString()}`);
  },

  // Keep original getAll for backward compatibility if needed
  getAll: () => apiFetch("/users"),

  getById: (id) => apiFetch(`/users/${id}`),

  updateProfile: (data) =>
    apiFetch("/users/profile", { method: "PUT", body: JSON.stringify(data) }),

  changePassword: (data) =>
    apiFetch("/users/change-password", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  promoteToAdmin: (userId) =>
    apiFetch(`/users/${userId}/promote`, { method: "PATCH" }),

  demoteToUser: (userId) =>
    apiFetch(`/users/${userId}/demote`, { method: "PATCH" }),

  deleteUser: (userId) => apiFetch(`/users/${userId}`, { method: "DELETE" }),

  // ADD WISHLIST METHODS HERE (in userService, not productService)
  getWishlist: () => apiFetch("/users/wishlist"),

  addToWishlist: (productId) =>
    apiFetch(`/users/wishlist/${productId}`, {
      method: "POST",
    }),

  removeFromWishlist: (productId) =>
    apiFetch(`/users/wishlist/${productId}`, {
      method: "DELETE",
    }),
};

// Order endpoints
const orderService = {
  getMyOrders: () => apiFetch("/orders/my-orders"),
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/orders${query ? `?${query}` : ""}`);
  },
  getById: (id) => apiFetch(`/orders/${id}`),
  updateStatus: (id, status) =>
    apiFetch(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  cancelOrder: (id) =>
    apiFetch(`/orders/${id}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ status: "cancelled" }),
    }),
  deleteOrder: (id) =>
    apiFetch(`/orders/${id}/delete`, {
      method: "DELETE",
    }),
  updatePaymentStatus: (id, status) =>
    apiFetch(`/orders/${id}/payment-status`, {
      method: "PATCH",
      body: JSON.stringify({ paymentStatus: status }),
    }),
  createOrder: (data) =>
    apiFetch("/orders/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  trackOrder: (orderNumber) => apiFetch(`/orders/track/${orderNumber}`),
  verifyPayment: (reference) => apiFetch(`/orders/verify/${reference}`),
  getStats: () => apiFetch("/orders/stats"),
};

// Product endpoints
const productService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/products${query ? `?${query}` : ""}`);
  },

  getById: (id) => apiFetch(`/products/${id}`),

  create: (data) =>
    apiFetch("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiFetch(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiFetch(`/products/${id}`, {
      method: "DELETE",
    }),
};

const ticketService = {
  getTickets: async ({
    page = 1,
    limit = 20,
    status = "",
    search = "",
  } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (status && status !== "All") params.append("status", status);
    if (search) params.append("search", search);

    return apiFetch(`/tickets?${params.toString()}`);
  },

  getTicketById: (id) => apiFetch(`/tickets/${id}`),

  createTicket: (data) =>
    apiFetch("/tickets", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  addReply: (id, text) =>
    apiFetch(`/tickets/${id}/reply`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  updateStatus: (id, status) =>
    apiFetch(`/tickets/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  deleteTicket: (id) =>
    apiFetch(`/tickets/${id}`, {
      method: "DELETE",
    }),

  getStats: () => apiFetch("/tickets/admin/stats"),
};

// Notification endpoints
const notificationService = {
  getNotifications: ({
    page = 1,
    limit = 20,
    type = "",
    unread = false,
  } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (type && type !== "All") params.append("type", type);
    if (unread) params.append("unread", "true");

    return apiFetch(`/notifications?${params.toString()}`);
  },

  getUnreadCount: () => apiFetch("/notifications/unread/count"),

  markAsRead: (id) =>
    apiFetch(`/notifications/${id}/read`, { method: "PATCH" }),

  markAllAsRead: () => apiFetch("/notifications/read-all", { method: "PATCH" }),

  deleteNotification: (id) =>
    apiFetch(`/notifications/${id}`, { method: "DELETE" }),

  deleteAllNotifications: () =>
    apiFetch("/notifications/delete-all", { method: "DELETE" }),

  // Admin only
  createNotification: (data) =>
    apiFetch("/notifications", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

const adminNotificationService = {
  getNotifications: ({
    page = 1,
    limit = 20,
    type = "",
    unread = false,
  } = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (type && type !== "All") params.append("type", type);
    if (unread) params.append("unread", "true");

    return apiFetch(`/admin/notifications?${params.toString()}`);
  },

  getUnreadCount: () => apiFetch("/admin/notifications/unread/count"),

  createNotification: (data) =>
    apiFetch("/admin/notifications", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  markAsRead: (id) =>
    apiFetch(`/admin/notifications/${id}/read`, { method: "PATCH" }),

  markAllAsRead: () =>
    apiFetch("/admin/notifications/read-all", { method: "PATCH" }),

  deleteNotification: (id) =>
    apiFetch(`/admin/notifications/${id}`, { method: "DELETE" }),

  deleteAllNotifications: () =>
    apiFetch("/admin/notifications/delete-all", { method: "DELETE" }),

  createSystemNotification: (data) =>
    apiFetch("/admin/notifications/system/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Address endpoints
const addressService = {
  getAddresses: () => apiFetch("/users/addresses"),

  addAddress: (data) =>
    apiFetch("/users/addresses", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateAddress: (addressId, data) =>
    apiFetch(`/users/addresses/${addressId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteAddress: (addressId) =>
    apiFetch(`/users/addresses/${addressId}`, {
      method: "DELETE",
    }),

  setDefaultAddress: (addressId) =>
    apiFetch(`/users/addresses/${addressId}/default`, {
      method: "PATCH",
    }),
};

// Look endpoints
const lookService = {
  getLooks: () => apiFetch("/looks"),
  getLooksForAdmin: () => apiFetch("/looks/admin"),
  updateLook: (id, data) =>
    apiFetch(`/looks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  initializeLooks: () =>
    apiFetch("/looks/initialize", {
      method: "POST",
    }),
  createLook: (data) =>
    apiFetch("/looks", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Instagram endpoints
const instagramService = {
  getFeed: () => apiFetch("/instagram"),
  getFeedForAdmin: () => apiFetch("/instagram/admin"),
  addToFeed: (data) =>
    apiFetch("/instagram", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateFeedItem: (id, data) =>
    apiFetch(`/instagram/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  removeFromFeed: (id) =>
    apiFetch(`/instagram/${id}`, {
      method: "DELETE",
    }),
};

export {
  apiFetch,
  authService,
  userService,
  orderService,
  productService,
  ticketService,
  notificationService,
  adminNotificationService,
  addressService,
  lookService,
  instagramService,
  setTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
};
