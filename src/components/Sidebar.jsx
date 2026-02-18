export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4 hidden md:block shadow-inner">
      <h2 className="text-lg font-bold mb-4">Menu</h2>
      <ul className="space-y-2">
        <li>
          <a
            href="/"
            className="block p-2 rounded hover:bg-blue-500 hover:text-white transition"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#todos"
            className="block p-2 rounded hover:bg-blue-500 hover:text-white transition"
          >
            Management
          </a>
        </li>
        <li>
          <a
            href="#about"
            className="block p-2 rounded hover:bg-blue-500 hover:text-white transition"
          >
            Transactions
          </a>
        </li>
        <li>
          <a
            href="#contact"
            className="block p-2 rounded hover:bg-blue-500 hover:text-white transition"
          >
            Contact
          </a>
        </li>
      </ul>
    </aside>
  );
}
