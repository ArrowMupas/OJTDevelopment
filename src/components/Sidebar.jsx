import {
  ActivityIcon,
  Car,
  House,
  MessageCircleQuestionMark,
  ScrollText,
  ChartColumnStacked,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const MenuLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 p-2 rounded-r-lg text-sm transition-all text-gray-300
          ${
            isActive
              ? "border-l-4 border-green-600 bg-green-700 text-white"
              : "border-l-4 border-transparent"
          }
          hover:bg-green-700 hover:text-white`}
      >
        <Icon size={18} />
        {children}
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-green-900 hidden md:flex flex-col shadow-inner text-white">
      <div className="px-4 py-3 border-b border-green-300">
        <div className="flex items-center gap-3">
          <img
            className="h-15 object-contain bg-white rounded-4xl"
            src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/national_electrification_logo.png"
            alt="NEA Logo"
            onError={(e) => {
              e.currentTarget.src =
                "https://8upload.com/display/68d52d9e15810/logo-alas1.jpg.php";
            }}
          />
          <div className="tracking-tight">
            <p className="text-lg font-bold font-rubik">NEA Dashboard</p>
            <p className="text-xs text-gray-300">
              Transport Operations Services Unit (TOSU)
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-1 ">
        <ul className="menu w-full space-y-1 font-semibold text-sm">
          <li>
            <MenuLink to="/admindashboard" icon={ChartColumnStacked}>
              Admin Dashboard
            </MenuLink>
          </li>
          <li>
            <MenuLink to="/manage-requests" icon={Car}>
              Vehicle Requests
            </MenuLink>
          </li>

          <li>
            <details className="group" open>
              <summary className="flex items-center gap-3 p-2 rounded-r-lg cursor-pointer text-sm hover:bg-green-400 text-gray-200 hover:text-green-900 transition-all">
                Monitoring
              </summary>
              <ul className="menu rounded-box ml-4 p-2 w-full space-y-1">
                <li>
                  <MenuLink to="/drivermonitoring" icon={Users}>
                    Driver Monitoring
                  </MenuLink>
                </li>
                <li>
                  <MenuLink to="/vehiclemonitoring" icon={Car}>
                    Vehicle Monitoring
                  </MenuLink>
                </li>
                <li>
                  <MenuLink to="/vehiclestatusqueue" icon={ActivityIcon}>
                    Vehicle Status
                  </MenuLink>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <details className="group" open>
              <summary className="flex items-center gap-3 p-2 rounded-r-lg cursor-pointer text-sm hover:bg-green-400 text-gray-200 hover:text-green-900 transition-all">
                Maintenance
              </summary>
              <ul className="menu rounded-box ml-4 p-2 w-full space-y-1">
                <li>
                  <MenuLink to="/vehicles" icon={Car}>
                    Vehicle Maintenance
                  </MenuLink>
                </li>
                <li>
                  <MenuLink to="/drivers" icon={Users}>
                    List of Drivers
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
            <MenuLink to="/inquiry" icon={MessageCircleQuestionMark}>
              Inquiry
            </MenuLink>
          </li>

          <li>
            <MenuLink to="/" icon={House}>
              Home
            </MenuLink>
          </li>
        </ul>
      </div>
    </aside>
  );
}
