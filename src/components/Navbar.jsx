import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  // Check if current path starts with any of these routes
  const hiddenNavRoutes = [
    "/survey",
    "/request-vehicle",
    "/requestinput",
    // "/repairs",
    // "/repairs/completed",
  ];
  const hideNavLinks = hiddenNavRoutes.some((route) =>
    location.pathname.startsWith(route),
  );

  const isDashboardPage = location.pathname === "/dashboard";

  const navLinks = [
    { href: "/login", label: "Login" },
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/staff", label: "Staff" },
    // { href: "/entry-exit-monitoring", label: "Entry & Exit" },
  ];

  return (
    <header className="w-full max-w-screen bg-green-700 px-4 py-4 text-white sm:px-8">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center">
          <div
            className="flex aspect-square w-8 cursor-pointer items-center justify-center rounded-full bg-white p-1 sm:w-12"
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
              <h1 className="hidden text-lg font-bold tracking-wide sm:block">
                TOSU Vehicle Request Dashboard
              </h1>
            ) : (
              <h1 className="font-bolda hidden text-xs font-semibold uppercase sm:block md:text-sm">
                National Electrification Administration{" "}
              </h1>
            )}

            {!isDashboardPage && (
              <p className="hidden text-xs text-yellow-100 md:block">
                Transport Operations Services Unit (TOSU)
              </p>
            )}
          </div>
        </div>

        {!hideNavLinks && (
          <nav className="flex space-x-1.5 sm:space-x-4 md:space-x-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative truncate text-[11px] font-bold text-white uppercase transition-colors duration-200 hover:text-yellow-200"
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
