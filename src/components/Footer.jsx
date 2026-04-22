import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer footer-horizontal footer-center text-primary-content bg-green-600 p-10">
      <aside>
        <Link to="/admindashboard">
          <div className="flex aspect-square w-20 cursor-pointer items-center justify-center rounded-full bg-white p-1">
            <img
              className="h-full w-full object-contain"
              src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/national_electrification_logo.png"
              alt="Logo"
            />
          </div>
        </Link>
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
