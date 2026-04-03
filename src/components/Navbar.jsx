import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  // Check if current path starts with any of these routes
  const hiddenNavRoutes = ["/survey", "/request-vehicle", "/requestinput"];
  const hideNavLinks = hiddenNavRoutes.some((route) =>
    location.pathname.startsWith(route),
  );

  const isDashboardPage = location.pathname === "/dashboard";

  const navLinks = [
    // Uncomment for real login
    { href: "/login", label: "login" },
    { href: "/admindashboard", label: "Admin" },
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/public-track", label: "Track PMS" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/staff", label: "Staff" },
  ];

  return (
    <header className="w-full border-b border-green-400 bg-green-700 px-4 py-4 text-white sm:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className="flex aspect-square w-10 cursor-pointer items-center justify-center rounded-full bg-white p-1 sm:w-12"
            onClick={() => (window.location.href = "/")}
          >
            <img
              className="h-full w-full object-contain"
              src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/national_electrification_logo.png"
              alt="Logo"
            />
          </div>

          <div className="flex flex-col">
            {isDashboardPage ? (
              <h1 className="font-bolda hidden text-sm font-black uppercase sm:block">
                Vehicle Request Dashboard
              </h1>
            ) : (
              <h1 className="font-bolda hidden text-sm font-semibold uppercase sm:block">
                National Electrification Administration{" "}
              </h1>
            )}

            {!isDashboardPage && (
              <p className="hidden text-xs text-yellow-100 sm:block">
                Transport Operations Services Unit (TOSU)
              </p>
            )}
          </div>
        </div>

        {!hideNavLinks && (
          <nav className="flex space-x-3 sm:space-x-5 md:space-x-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative text-xs font-bold text-white uppercase transition-colors duration-200 hover:text-yellow-200"
                >
                  <span className={`${isActive ? "text-yellow-100" : ""}`}>
                    {link.label}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full bg-yellow-200" />
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
