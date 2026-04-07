import {
  ActivityIcon,
  Car,
  MessageCircleQuestionMark,
  ScrollText,
  ChartColumnStacked,
  Users,
  LogOut,
  FolderClosed,
  MapPin,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Sidebar() {
  const location = useLocation();

  const MenuLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 rounded-r-lg p-2 text-sm text-gray-300 transition-all ${
          isActive
            ? "border-l-4 border-green-600 bg-green-700 text-white"
            : "border-l-4 border-transparent"
        } hover:bg-green-700 hover:text-white`}
      >
        <Icon size={18} />
        {children}
      </Link>
    );
  };

  const handleLogout = async () => {
    // Uncomment for real logout
    // await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <aside className="flex min-h-full w-64 flex-col bg-green-900 text-white shadow-inner">
      {/* LOGO */}
      <div className="border-b border-green-300 px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="flex aspect-square h-15 cursor-pointer items-center justify-center rounded-full bg-white p-1"
            onClick={() => (window.location.href = "/")}
          >
            <img
              className="h-full w-full object-contain"
              src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/national_electrification_logo.png"
              alt="NEA Logo"
              onError={(e) => {
                e.currentTarget.src =
                  "https://8upload.com/display/68d52d9e15810/logo-alas1.jpg.php";
              }}
            />
          </div>
          <div className="tracking-tight">
            <p className="font-rubik text-lg font-bold">NEA Dashboard</p>
            <p className="text-xs text-gray-300">
              Transport Operations Services Unit (TOSU)
            </p>
          </div>
        </div>
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto px-1">
        <ul className="menu w-full space-y-1 text-sm font-semibold">
          <li>
            <MenuLink to="/admindashboard" icon={ChartColumnStacked}>
              Admin Dashboard
            </MenuLink>
          </li>

          <li>
            <MenuLink to="/vehicle-requests" icon={Car}>
              Vehicle Requests
            </MenuLink>
          </li>

          <li>
            <details className="group" open>
              <summary className="flex cursor-pointer items-center gap-3 rounded-r-lg p-2 text-sm text-gray-200 transition-all hover:bg-green-400 hover:text-green-900">
                Monitoring
              </summary>

              <ul className="menu rounded-box ml-4 w-full space-y-1 p-2">
                {/* <li>
                  <MenuLink to="/drivermonitoring" icon={Users}>
                    Driver Monitoring
                  </MenuLink>
                </li> */}

                <li>
                  <MenuLink to="/vehicles" icon={Car}>
                    Insurance & Registration
                  </MenuLink>
                </li>

                <li>
                  <MenuLink to="/vehiclestatusqueue" icon={ActivityIcon}>
                    Vehicle Status
                  </MenuLink>
                </li>
                <li>
                  <MenuLink to="/track" icon={MapPin}>
                    PMS Tracking
                  </MenuLink>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <details className="group" open>
              <summary className="flex cursor-pointer items-center gap-3 rounded-r-lg p-2 text-sm text-gray-200 transition-all hover:bg-green-400 hover:text-green-900">
                Maintenance
              </summary>

              <ul className="menu rounded-box ml-4 w-full space-y-1 p-2">
                <li>
                  <MenuLink to="/pms" icon={Car}>
                    Vehicle Maintenance
                  </MenuLink>
                </li>

                <li>
                  <MenuLink to="/staff-management" icon={Users}>
                    Staff
                  </MenuLink>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <MenuLink to="/transactions" icon={ScrollText}>
              Transactions
            </MenuLink>
          </li>

          <li>
            <MenuLink to="/inquiries" icon={MessageCircleQuestionMark}>
              Inquiry
            </MenuLink>
          </li>
          <li></li>
        </ul>
      </div>

      {/* LOGOUT */}
      <div className="border-t border-green-700 p-3">
        <button
          onClick={handleLogout}
          className="btn btn-ghost hover:text-error flex w-full justify-start"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
