export default function Footer() {
  return (
    <footer className="footer footer-horizontal footer-center bg-green-600 text-primary-content p-10">
      <aside>
        <img
          className="h-20 w-auto cursor-pointer bg-white rounded-full p-0.5"
          src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/national_electrification_logo.png"
          alt="Logo"
        />
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
