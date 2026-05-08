import Footer from "../components/Footer.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { Outlet } from "react-router";
import AdminNavbar from "../components/AdminNavbar.jsx";
import { useEffect } from "react";
import useDriverStore from "../stores/driverStore.js";

export default function MainLayout() {
  const fetchDrivers = useDriverStore((state) => state.fetchDrivers);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  return (
    <div className="drawer lg:drawer-open bg-back min-h-screen">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex min-h-screen flex-col">
        <AdminNavbar />

        <main className="flex flex-1 flex-col">
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
