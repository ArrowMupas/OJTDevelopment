export default function Navbar() {
  return (
    <header className="bg-green-600 text-white py-4 px-8 shadow-lg border-b border-gray-500/50 w-full">
      <div className=" flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            className="h-10 w-auto cursor-pointer"
            src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/nea-logo.png"
            alt="Logo"
            onError={(e) => {
              e.currentTarget.src =
                "https://8upload.com/display/68d52d9e15810/logo-alas1.jpg.php";
            }}
            onClick={() => (window.location.href = "/")}
          />
          <h1 className="text-sm font-semibold hidden sm:block">
            National Electrification Administration
            <p className="text-xs text-yellow-200">
              Transport Operations Services Unit (TOSU)
            </p>
          </h1>
        </div>

        <nav className="space-x-7 ">
          <a
            href="/inquiry"
            className="text-sm hover:no-underline hover:text-yellow-200"
          >
            Admin
          </a>

          <a
            href="/ "
            className="text-sm hover:no-underline hover:text-yellow-200"
          >
            Home
          </a>

          <a
            href="/dashboard "
            className="text-sm hover:no-underline hover:text-yellow-200"
          >
            Dashboard
          </a>

          <a
            href="#about"
            className="text-sm hover:no-underline hover:text-yellow-200 "
          >
            About
          </a>
          <a
            href="/Contact"
            className="text-sm hover:no-underline hover:text-yellow-200"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
