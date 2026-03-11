export default function Footer() {
  return (
    <footer className="footer footer-horizontal footer-center bg-green-600 text-primary-content p-10">
      <aside>
        <div
          className="w-20 aspect-square bg-white rounded-full p-1 flex items-center justify-center cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          <img
            className="w-full h-full object-contain"
            src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/national_electrification_logo.png"
            alt="Logo"
          />
        </div>
        <p className="font-bold">
          Transport Operations Services Unit
          <br />
          National Electrification Administration
        </p>
        <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
      </aside>
    </footer>
  );
}
