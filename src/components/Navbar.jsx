import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const hiddenNavRoutes = ["/survey", "/request-vehicle"];
  const hideNavLinks = hiddenNavRoutes.includes(location.pathname);

  const isDashboardPage = location.pathname === "/dashboard";

  const navLinks = [
    { href: "/inquiry", label: "Admin" },
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/survey", label: "Survey" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-green-600 text-white py-4 px-8 shadow-lg border-b border-gray-500/50 w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            className="h-10 w-auto cursor-pointer"
            src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/nea-logo.png"
            alt="Logo"
            onClick={() => (window.location.href = "/")}
          />

          <div className="flex flex-col">
            <h1 className="font-bold hidden text-sm md:text-sm lg:text-lg sm:block">
              {isDashboardPage
                ? "Vehicle Request Dashboard"
                : "National Electrification Administration"}
            </h1>
            {!isDashboardPage && (
              <p className="hidden sm:block text-xs text-yellow-100">
                Transport Operations Services Unit (TOSU)
              </p>
            )}
          </div>
        </div>

        {!hideNavLinks && (
          <nav className="flex space-x-4 sm:space-x-6 md:space-x-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative text-xs text-white hover:text-yellow-200 transition-colors duration-200 uppercase font-bold"
                >
                  <span className={`${isActive ? "text-yellow-100" : ""}`}>
                    {link.label}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-200 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
