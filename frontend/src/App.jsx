import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import Landing from "./pages/Landing/LandingPage";
import About from "./components/About";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import UserDashboard from "./pages/User/UserDashboard.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import useCursor from "./hooks/useCursor";
import ForgotPassword from "./pages/Auth/ForgetPassword.jsx";
import Terms from "./section/Terms.jsx";
import Privacy from "./section/Privacy.jsx";
import Contact from "./section/Contact.jsx";
import Press from "./section/Press.jsx";
import Careers from "./section/Careers.jsx";
import ShippingPolicy from "./section/ShippingPolicy.jsx";
import useScrollToTop from "./hooks/useScrollToTop.js";
import { ThemeProvider } from "./context/ThemeProvider.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import Notifications from "./components/Notifications.jsx";
import CartSidebar from "./components/CartSidebar.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import OrderConfirmation from "./pages/Order/OrderConfirmation.jsx";
import PaymentInstructions from "./pages/Payment/PaymentInstructions.jsx";

function ScrollToTop() {
  useScrollToTop();
  return null;
}

function AppContent() {
  const { cursorRef, followerRef } = useCursor();

  return (
    <div>
      <ScrollToTop />
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--bg-card)",
            color: "var(--theme-text)",
            border: "1px solid var(--theme-border)",
            borderRadius: "12px",
            fontSize: "14px",
            fontFamily: "var(--font-body)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "white",
            },
            style: {
              borderLeft: "4px solid #10b981",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "white",
            },
            style: {
              borderLeft: "4px solid #ef4444",
            },
          },
        }}
      />

      <CartSidebar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
        <Route path="/payment-instructions" element={<PaymentInstructions />} />
        {/* Auth — redirect if already logged in */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* User dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["user", "admin", "superadmin"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin + Superadmin dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin", "superadmin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/press" element={<Press />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute roles={["user", "admin", "superadmin"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Unauthorized */}
        <Route
          path="/unauthorized"
          element={
            <div className="min-h-screen bg-obsidian flex items-center justify-center">
              <div className="text-center">
                <p className="font-mono text-[10px] tracking-[0.4em] text-gold/60 uppercase mb-4">
                  Access Denied
                </p>
                <h1 className="font-display font-black text-cream text-5xl mb-6">
                  403
                </h1>
                <p className="font-body text-cream/40 mb-8">
                  You don't have permission to access this page.
                </p>
                <a
                  href="/"
                  className="px-8 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.3em] uppercase font-bold"
                >
                  Go Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
