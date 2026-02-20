// MainLayout.jsx
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 h-full">
        <Sidebar />
        <main className="flex-1 flex flex-col ">
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
}
