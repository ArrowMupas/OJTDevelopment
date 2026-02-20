import {
  House,
  ScrollText,
  Settings,
  SquarePen,
  UsersRound,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4 hidden md:block shadow-inner h-screen">
      {/* <h2 className="text-lg font-bold mb-4">Menu</h2> */}
      <ul className="space-y-2">
        <li>
          <a
            href="/drivermonitoring"
            className="block p-2 rounded hover:bg-highlight hover:text-white transition"
          >
            <SquarePen className="h-4 w-4 inline-block mr-2" />
            Driver Monitoring
          </a>
        </li>
        <li>
          <a
            href="/transactions"
            className="block p-2 rounded hover:bg-highlight hover:text-white transition"
          >
            <ScrollText className="h-4 w-4 inline-block mr-2" />
            Transactions
          </a>
        </li>
        <li>
          <a
            href="/maintenance"
            className="block p-2 rounded hover:bg-highlight hover:text-white transition"
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
