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
  ];

  return (
    <header className="bg-green-700 text-white py-4 px-4 sm:px-8 border-b border-green-400 w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div
            className="w-10 sm:w-12 aspect-square bg-white rounded-full p-1 flex items-center justify-center cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <img
              className="w-full h-full object-contain"
              src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/national_electrification_logo.png"
              alt="Logo"
            />
          </div>

          <div className="flex flex-col">
            {isDashboardPage ? (
              <h1 className="font-black hidden text-sm sm:block  font-bolda uppercase">
                Vehicle Request Dashboard
              </h1>
            ) : (
              <h1 className="font-semibold hidden text-sm sm:block font-bolda uppercase">
                National Electrification Administration{" "}
              </h1>
            )}

            {!isDashboardPage && (
              <p className="hidden sm:block text-xs text-yellow-100">
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
                  className="relative text-xs text-white hover:text-yellow-200 transition-colors duration-200 font-bold uppercase "
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
