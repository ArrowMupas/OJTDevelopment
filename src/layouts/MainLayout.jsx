import Footer from "../components/Footer.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { Outlet } from "react-router";
import AdminNavbar from "../components/AdminNavbar.jsx";

export default function MainLayout() {
  return (
    <div className="drawer lg:drawer-open min-h-screen bg-back">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-h-screen">
        <AdminNavbar />

        <main className="flex-1 flex flex-col">
          <Outlet />
          <Footer />
        </main>
      </div>

      <div className="drawer-side">
        <label
          htmlFor="admin-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <Sidebar />
      </div>
    </div>
  );
}
