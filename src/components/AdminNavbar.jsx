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
    "/pms": "Repair and Maintenance",
    "/battery": "Repair and Maintenance",
    "/tires": "Repair and Maintenance",
    "/history": "Vehicle Changes History",
    "/vehicle-requests/completed": "Completed Requests",
    "/track": "PMS Tracking",
  };

  const pageTitle = pageTitles[location.pathname] || "Admin Panel";

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between bg-white px-5 shadow-lg">
      <div className="flex items-center gap-3">
        <label
          htmlFor="admin-drawer"
          className="btn btn-ghost btn-sm lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </label>

        <h1 className="font-semibold">{pageTitle}</h1>
      </div>
    </header>
  );
}
