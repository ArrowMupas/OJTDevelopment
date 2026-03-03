import {
  ActivityIcon,
  Car,
  ClipboardCheck,
  House,
  MessageCircleQuestionMark,
  ScrollText,
  Settings,
  SquareActivity,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-green-300 hidden md:flex flex-col shadow-inner font-rubik">
      <div className="px-4 py-3 border-b border-green-300">
        <div className="flex items-center gap-3">
          <img
            className="h-15 object-contain"
            src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/nea-logo.png"
            alt="NEA Logo"
            onError={(e) => {
              e.currentTarget.src =
                "https://8upload.com/display/68d52d9e15810/logo-alas1.jpg.php";
            }}
          />
          <div className="tracking-tight">
            <p className="text-lg font-bold font-rubik">NEA Dashboard</p>
            <p className="text-xs text-gray-800">
              Transport Operations Services Unit (TOSU)
            </p>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="flex-1 overflow-y-auto px-2 ">
        <ul className="menu w-full">
          <li>
            <Link
              to="/manage-requests"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-highlight hover:text-white transition text-sm"
            >
              <Car size={18} />
              Vehicle Requests
            </Link>
          </li>

          <li>
            <details className="group" open>
              <summary className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-highlight hover:text-white transition text-sm">
                <SquareActivity size={18} />
                Monitoring
              </summary>
              <ul className="menu rounded-box ml-4 p-2 w-full">
                <li>
                  <Link
                    to="/drivermonitoring"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-highlight hover:text-white transition text-sm"
                  >
                    <Users size={16} />
                    Driver Monitoring
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vehiclemonitoring"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-highlight hover:text-white transition text-sm"
                  >
                    <Car size={16} />
                    Vehicle Monitoring
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vehiclestatusqueue"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-highlight hover:text-white transition text-sm"
                  >
                    <ActivityIcon size={16} />
                    Vehicle Status
                  </Link>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <Link
              to="/transactions"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-highlight hover:text-white transition text-sm"
            >
              <ScrollText size={18} />
              Transactions
            </Link>
          </li>

          <li>
            <Link
              to="/survey"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-highlight hover:text-white transition text-sm"
            >
              <ClipboardCheck size={18} />
              Survey
            </Link>
          </li>

          <li>
            <details className="group" open>
              <summary className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-highlight hover:text-white transition text-sm">
                <Settings size={18} />
                Maintenance
              </summary>
              <ul className="menu rounded-box ml-4 p-2 w-full">
                <li>
                  <Link
                    to="/vehicles"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-highlight hover:text-white transition text-sm"
                  >
                    <Car size={16} />
                    Vehicle Maintenance
                  </Link>
                </li>
                <li>
                  <Link
                    to="/drivers"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-highlight hover:text-white transition text-sm"
                  >
                    <Users size={16} />
                    Driver Maintenance
                  </Link>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <Link
              to="/inquiry"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-highlight hover:text-white transition text-sm"
            >
              <MessageCircleQuestionMark size={18} />
              Inquiry
            </Link>
          </li>

          <li>
            <Link
              to="/"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-highlight hover:text-white transition text-sm"
            >
              <House size={18} />
              Home
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
