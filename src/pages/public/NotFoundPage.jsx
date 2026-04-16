import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="card bg-base-100 max-w-md space-y-4 p-8 text-center">
        <h2 className="text-center text-5xl font-bold tracking-tight uppercase">
          Error 404
        </h2>
        <p className="relative z-10 mx-auto max-w-2xl px-4 text-lg leading-relaxed text-black">
          The page was not found.
        </p>
        <Link to="/">
          <button className="btn btn-error btn-dash btn-lg uppercase">
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
}

{
  /* 
   <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Today's Request</div>
          <div className="stat-value">{requests.length}</div>
          <div className="stat-desc">21% more than last month</div>
        </div>
      </div>

      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Completed Request</div>
          <div className="stat-value">
            {requests.filter((r) => r.status === "Completed").length}
          </div>
          <div className="stat-desc">21% more than last month</div>
        </div>
      </div>

      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Today Request</div>
          <div className="stat-value">
            {requests.filter((r) => r.status !== "Completed").length}
          </div>
          <div className="stat-desc">21% more than last month</div>
        </div>
      </div>

  */
}

/* const location = useLocation();
const path = location.pathname;

let title = "National Electrification Administration";
let subtitle = "Transport Operations Services Unit (TOSU)";

if (path === "/dashboard") {
  title = "Dashboard";
  subtitle = "Overview of all operations";
} else if (path === "/survey") {
  title = "Survey";
  subtitle = "Manage and view surveys";
} else if (path === "/about") {
  title = "About Us";
  subtitle = "Learn more about our team";
} */
