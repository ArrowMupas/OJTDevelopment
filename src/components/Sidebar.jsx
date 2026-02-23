import {
  House,
  LayoutDashboard,
  ScrollText,
  Settings,
  SquareActivity,
  SquarePen,
  UsersRound,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-58 bg-gray-100 p-4 hidden md:block shadow-inner h-screen">
      {/* <h2 className="text-lg font-bold mb-4">Menu</h2> */}
      <ul className="space-y-2">
        <li>
          <a
            href="/dashboard"
            className="block p-2 rounded hover:bg-highlight hover:text-white transition text-sm"
          >
            <LayoutDashboard className="h-4 w-4 inline-block mr-2" />
            Dashboard
          </a>
        </li>

        <div className="dropdown dropdown-right">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-md ml-1 border-none w-49 justify-start px-1 hover:bg-highlight hover:text-white transition bg-gray-100 font-normal"
          >
            <SquareActivity className="h-4 w-4 inline-block mr-1" />
            Monitoring
          </div>
          <ul
            tabIndex="-1"
            className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li className="focus:bg-highlight">
              <a href="/drivermonitoring" className="active:bg-highlight">
                Driver Monitoring
              </a>
            </li>
            <li>
              <a className="active:bg-highlight">Vehicle Monitoring</a>
            </li>
          </ul>
        </div>
        <li>
          <a
            href="/transactions"
            className="block p-2 rounded hover:bg-highlight hover:text-white transition text-sm"
          >
            <ScrollText className="h-4 w-4 inline-block mr-2" />
            Transactions
          </a>
        </li>
        <li>
          <a
            href="/maintenance"
            className="block p-2 rounded hover:bg-highlight hover:text-white transition text-sm"
          >
            <Settings className="h-4 w-4 inline-block mr-2" />
            Maintenance
          </a>
        </li>
        {/* <li>
          <a
            href="#contact"
            className="block p-2 rounded hover:bg-highlight hover:text-white transition"
          >
            ------
          </a>
        </li> */}
      </ul>
    </aside>
  );
}
