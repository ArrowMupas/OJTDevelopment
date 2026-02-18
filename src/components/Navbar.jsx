export default function Navbar() {
  return (
    <header className="bg-green-600 text-white p-4 shadow-md">
      <div className="max-w-7.5xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
        <img
              className="h-11 w-auto cursor-pointer"
              src="https://rmn.ph/wp-content/uploads/2017/04/NEA-LOGO.png"
              alt="Logo"
              onError={(e) => {
                e.currentTarget.src = 'https://8upload.com/display/68d52d9e15810/logo-alas1.jpg.php';
              }}
            />
        <h1 className="text-xl font-bold">NEA Transportation</h1>
        </div>
        <nav className="space-x-4">
          <a href="/" className="hover:underline">
            Home
          </a>
          <a href="#about" className="hover:underline">
            About
          </a>
          <a href="/Contact" className="hover:underline">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
