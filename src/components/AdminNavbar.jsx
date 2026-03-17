import { Bell, ChevronDown, Menu } from "lucide-react";
import { useLocation } from "react-router";

export default function AdminNavbar() {
  const location = useLocation();

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/manage-requests": "Manage Requests",
    "/drivermonitoring": "Driver Monitoring",
    "/vehiclemonitoring": "Vehicle Maintenance",
    "/vehiclestatusqueue": "Vehicle Status",
    "/transactions": "Transactions",
    "/survey": "Survey",
    "/vehicles": "Vehicles",
    "/registration": "Vehicle Registration",
    "/drivers": "Transport Operations Services Unit (Staff)",
    "/inquiry": "Inquiry",
    "/battery": "Vehicle Monitoring",
    "/tires": "Vehicle Monitoring",
    "/completerequest": "Completed Requests",
  };

  const pageTitle = pageTitles[location.pathname] || "Admin Panel";

  return (
    <header className="sticky top-0 z-50 bg-white px-5 h-16 shadow-lg flex items-center justify-between">
      <div className="flex items-center gap-3">
        <label
          htmlFor="admin-drawer"
          className="btn btn-ghost btn-sm lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </label>

        <h1 className="font-semibold">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-6">
        <button className="hover:opacity-80 transition">
          <Bell className="w-5 h-5" />
        </button>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="flex items-center gap-2 cursor-pointer hover:opacity-80"
          >
            <div className="w-8 h-8 rounded-full bg-white text-green-600 flex items-center justify-center font-semibold">
              A
            </div>
            <ChevronDown className="w-4 h-4" />
          </div>

          <ul
            tabIndex={0}
            className="dropdown-content menu bg-white text-black rounded-box z-50 w-48 p-2 shadow"
          >
            <li>
              <a>Profile</a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a className="text-error">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
