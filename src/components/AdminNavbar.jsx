import { Bell, ChevronDown, Menu } from "lucide-react";
import { useLocation } from "react-router";

export default function AdminNavbar() {
  const location = useLocation();

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/vehicle-requests": "Manage Requests",
    "/drivermonitoring": "Driver Monitoring",
    "/vehiclestatusqueue": "Vehicle Status",
    "/transactions": "Transactions",
    "/survey": "Survey",
    "/vehicles": "Vehicles",
    "/registration": "Vehicle Registration",
    "/staff-management": "Transport Operations Services Unit (Staff)",
    "/inquiries": "Inquiry",
    "/pms": "Vehicle Monitoring",
    "/battery": "Vehicle Monitoring",
    "/tires": "Vehicle Monitoring",
    "/history": "Vehicle Changes History",
    "/vehicle-requests/completed": "Completed Requests",
    "/track": "PMS Tracking",
  };

  const pageTitle = pageTitles[location.pathname] || "Admin Panel";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-5 shadow-lg">
      <div className="flex items-center gap-3">
        <label
          htmlFor="admin-drawer"
          className="btn btn-ghost btn-sm lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </label>

        <h1 className="font-semibold">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-6">
        <button className="transition hover:opacity-80">
          <Bell className="h-5 w-5" />
        </button>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="flex cursor-pointer items-center gap-2 hover:opacity-80"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white font-semibold text-green-600">
              A
            </div>
            <ChevronDown className="h-4 w-4" />
          </div>

          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box z-50 w-48 bg-white p-2 text-black shadow"
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
