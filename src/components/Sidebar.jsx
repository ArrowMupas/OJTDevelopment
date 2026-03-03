import {
  Car,
  ClipboardCheck,
  House,
  LayoutDashboard,
  MessageCircleQuestionMark,
  ScrollText,
  Settings,
  SquareActivity,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-50 hidden md:flex flex-col shadow-inner font-rubik">
      {/* Logo and Header Section */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => (window.location.href = "/")}
        >
          {/* Logo */}
          <img
            className="h-10 w-10 object-contain"
            src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/nea-logo.png"
            alt="NEA Logo"
            onError={(e) => {
              e.currentTarget.src =
                "https://8upload.com/display/68d52d9e15810/logo-alas1.jpg.php";
            }}
          />

          {/* Organization Text */}
          <div className="tracking-tight">
            <p className="text-lg font-bold font-rubik">NEA Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-2">
        <ul className="menu rounded-box w-full">
          {/* Dashboard Section */}
          <li>
            <details className="group" open>
              <summary className="flex items-center p-2 rounded cursor-pointer hover:bg-highlight hover:text-white transition text-sm">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </summary>
              <ul className="menu rounded-box ml-4 p-2">
                <li>
                  <a
                    href="/dashboard"
                    className="hover:bg-highlight hover:text-white transition text-sm"
                  >
                    Activity View
                  </a>
                </li>
                <li>
                  <a
                    href="/manage-requests"
                    className="hover:bg-highlight hover:text-white transition text-sm"
                  >
                    Manage Request
                  </a>
                </li>
              </ul>
            </details>
          </li>

          {/* Monitoring Section */}
          <li>
            <details className="group" open>
              <summary className="flex items-center p-2 rounded cursor-pointer hover:bg-highlight hover:text-white transition text-sm">
                <SquareActivity className="h-4 w-4 mr-2" />
                Monitoring
              </summary>
              <ul className="menu rounded-box ml-4 p-2">
                <li>
                  <a
                    href="/drivermonitoring"
                    className="hover:bg-highlight hover:text-white transition text-sm"
                  >
                    Driver Monitoring
                  </a>
                </li>
                <li>
                  <a
                    href="/vehiclemonitoring"
                    className="hover:bg-highlight hover:text-white transition text-sm"
                  >
                    Vehicle Monitoring
                  </a>
                </li>
                <li>
                  <a
                    href="/vehiclestatusqueue"
                    className="hover:bg-highlight hover:text-white transition text-sm"
                  >
                    Vehicle Status
                  </a>
                </li>
              </ul>
            </details>
          </li>

          {/* Transactions */}
          <li>
            <a
              href="/transactions"
              className="flex items-center p-2 rounded hover:bg-highlight hover:text-white transition text-sm"
            >
              <ScrollText className="h-4 w-4 mr-2" />
              Transactions
            </a>
          </li>

          {/* Survey */}
          <li>
            <a
              href="/survey"
              className="flex items-center p-2 rounded hover:bg-highlight hover:text-white transition text-sm"
            >
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Survey
            </a>
          </li>

          {/* Maintenance Section */}
          <li>
            <details className="group" open>
              <summary className="flex items-center p-2 rounded cursor-pointer hover:bg-highlight hover:text-white transition text-sm">
                <Settings className="h-4 w-4 mr-2" />
                Maintenance
              </summary>
              <ul className="menu rounded-box ml-4 p-2">
                <li>
                  <a
                    href="/vehicles"
                    className="hover:bg-highlight hover:text-white transition text-sm"
                  >
                    Vehicle Maintenance
                  </a>
                </li>
                <li>
                  <a
                    href="/drivers"
                    className="hover:bg-highlight hover:text-white transition text-sm"
                  >
                    Driver Maintenance
                  </a>
                </li>
              </ul>
            </details>
          </li>

          {/* Inquiry */}
          <li>
            <a
              href="/inquiry"
              className="flex items-center p-2 rounded hover:bg-highlight hover:text-white transition text-sm"
            >
              <MessageCircleQuestionMark className="h-4 w-4 mr-2" />
              Inquiry
            </a>
          </li>

          {/* Home Link */}
          <li>
            <a
              href="/"
              className="flex items-center p-2 rounded hover:bg-highlight hover:text-white transition text-sm"
            >
              <House className="h-4 w-4 mr-2" />
              Home
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}
