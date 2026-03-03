import Footer from "../components/Footer.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { Outlet } from "react-router";
import AdminNavbar from "../components/AdminNavbar.jsx";

export default function MainLayout() {
  return (
    <div className="min-h-screen">
      <Sidebar />

      <div className="ml-64 flex flex-col min-h-screen">
        <AdminNavbar />

        <main className="flex-1 flex flex-col">
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
}
