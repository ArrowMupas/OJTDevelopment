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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-green-200 hidden md:flex flex-col shadow-inner font-rubik">
      <div className="px-4 py-3 border-b border-green-300">
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
            <p className="text-lg font-bold font-rubik">NEA Dashboard </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <ul className="menu rounded-box w-full">
          <li>
            <a
              href="/manage-requests"
              className="flex items-center p-2 rounded hover:bg-highlight hover:text-white transition text-sm"
            >
              <Car className="h-4 w-4 mr-2" />
              Vehicle Requests
            </a>
          </li>

          <li>
            <details className="group" open>
              <summary className="flex items-center p-2 rounded cursor-pointer hover:bg-highlight hover:text-white transition text-sm">
                <SquareActivity className="h-4 w-4 mr-2" />
                Monitoring
              </summary>
              <ul className="menu rounded-box ml-4 p-2 text-xs w-full">
                <li>
                  <a
                    href="/drivermonitoring"
                    className="hover:bg-highlight hover:text-white transition "
                  >
                    Driver Monitoring
                  </a>
                </li>
                <li>
                  <a
                    href="/vehiclemonitoring"
                    className="hover:bg-highlight hover:text-white transition "
                  >
                    Vehicle Monitoring
                  </a>
                </li>
                <li>
                  <a
                    href="/vehiclestatusqueue"
                    className="hover:bg-highlight hover:text-white transition "
                  >
                    Vehicle Status
                  </a>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <a
              href="/transactions"
              className="flex items-center p-2 rounded hover:bg-highlight hover:text-white transition text-sm"
            >
              <ScrollText className="h-4 w-4 mr-2" />
              Transactions
            </a>
          </li>

          <li>
            <details className="group" open>
              <summary className="flex items-center p-2 rounded cursor-pointer hover:bg-highlight hover:text-white transition text-sm">
                <Settings className="h-4 w-4 mr-2" />
                Maintenance
              </summary>
              <ul className="menu rounded-box ml-4 p-2 text-xs w-full">
                <li>
                  <a
                    href="/vehicles"
                    className="hover:bg-highlight hover:text-white transition "
                  >
                    Vehicle Maintenance
                  </a>
                </li>
                <li>
                  <a
                    href="/drivers"
                    className="hover:bg-highlight hover:text-white transition "
                  >
                    Driver Maintenance
                  </a>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <a
              href="/inquiry"
              className="flex items-center p-2 rounded hover:bg-highlight hover:text-white transition text-sm"
            >
              <MessageCircleQuestionMark className="h-4 w-4 mr-2" />
              Inquiry
            </a>
          </li>

          <li>
            <a
              href="/survey"
              className="flex items-center p-2 rounded hover:bg-highlight hover:text-white transition text-sm"
            >
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Survey
            </a>
          </li>

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
