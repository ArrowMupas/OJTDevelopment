import { Bell, ChevronDown } from "lucide-react";
import { useLocation } from "react-router";

export default function AdminNavbar() {
  const location = useLocation();

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/manage-requests": "Manage Requests",
    "/drivermonitoring": "Driver Monitoring",
    "/vehiclemonitoring": "Vehicle Monitoring",
    "/vehiclestatusqueue": "Vehicle Status",
    "/transactions": "Transactions",
    "/survey": "Survey",
    "/vehicles": "Vehicle Maintenance",
    "/drivers": "Driver Maintenance",
    "/inquiry": "Inquiry",
    "/battery": "Vehicle Monitoring",
  };

  const pageTitle = pageTitles[location.pathname] || "Admin Panel";

  return (
    <header className="sticky top-0 z-40 bg-gray-100  px-5 h-16 shadow-lg  flex items-center justify-between">
      <h1 className="font-semibold">{pageTitle}</h1>
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
              <a className="text-red-500">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
