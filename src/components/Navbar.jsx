export default function Navbar() {
  return (
    <header className="bg-green-600 text-white py-4 px-8 shadow-lg w-full">
      <div className="max-w-7.5xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            className="h-11 w-auto cursor-pointer"
            src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/nea-logo.png"
            alt="Logo"
            onError={(e) => {
              e.currentTarget.src =
                "https://8upload.com/display/68d52d9e15810/logo-alas1.jpg.php";
            }}
          />
          <h1 className="text-xl font-bold hidden sm:block">
            National Electrification Administration
            <p className="text-sm text-yellow-200">
              Transport Operations Services Unit (TOSU)
            </p>
          </h1>
        </div>

        <nav className="space-x-7 ">
          <a href="/ " className="hover:no-underline hover:text-yellow-200">
            Home
          </a>
          <a
            href="#about"
            className="hover:no-underline hover:text-yellow-200 "
          >
            About
          </a>
          <a
            href="/Contact"
            className="hover:no-underline hover:text-yellow-200"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
