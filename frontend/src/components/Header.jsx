import { useState } from "react";
import CartSidebar from "./CartSidebar";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import useAuth from "../hooks/useAuth";
import AdminBottomNav from "./AdminBottomNav";

const Header = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
       {isAdmin
        ? <AdminBottomNav />
        : <BottomNav onCartOpen={() => setCartOpen(true)} />
      }
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Header;
