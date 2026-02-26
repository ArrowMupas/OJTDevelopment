import {
  ClipboardCheck,
  LayoutDashboard,
  MessageCircleQuestionMark,
  ScrollText,
  Settings,
  SquareActivity,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-58 bg-gray-50 hidden md:block shadow-inner h-auto p-2">
      <ul className="menu rounded-box w-full">
        <li>
          <details className="group" open>
            <summary className="flex items-center p-2 rounded cursor-pointer hover:bg-highlight hover:text-white transition text-sm">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </summary>
            <ul className="menu  rounded-box ml-4 p-2">
              <li>
                <a
                  href="/dashboard"
                  className="hover:bg-highlight hover:text-white transition text-sm"
                >
                  Acitivity View
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

        <li>
          <details className="group" open>
            <summary className="flex items-center p-2 rounded cursor-pointer hover:bg-highlight hover:text-white transition text-sm">
              <SquareActivity className="h-4 w-4 mr-2" />
              Monitoring
            </summary>
            <ul className="menu  rounded-box ml-4 p-2">
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

        {/* Maintenance */}
        <li>
          <details className="group" open>
            <summary className="flex items-center p-2 rounded cursor-pointer hover:bg-highlight hover:text-white transition text-sm">
              <Settings className="h-4 w-4 mr-2" />
              Maintenance
            </summary>
            <ul className="menu  rounded-box ml-4 p-2">
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
      </ul>
    </aside>
  );
}
