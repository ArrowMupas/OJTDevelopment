// MainLayout.jsx
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
