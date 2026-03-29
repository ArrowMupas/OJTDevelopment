export default function NotFoundPage() {
  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl font-bold mb-2">404</h1>
      <p>Page not found</p>
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

// <div className="grid grid-cols-3 gap-5">
//   <div className="card bg-base-100 card-md shadow-sm relative">
//     <div className="card-body flex-row justify-between items-center border-[#745fc9] border-2 rounded-sm">
//       <div className="space-y-1">
//         <p className="stat-title">Rating</p>
//         <h2 className="stat-value text-[#745fc9] leading-none">4.9</h2>
//         <p className="text-sm">Jayzen P. Galvez</p>
//       </div>
//       <Medal className="h-10 w-10 text-yellow-500" />
//     </div>
//     <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 hover:opacity-30 transition duration-300 rounded-sm"></div>
//   </div>

//   <div className="card bg-base-100 card-md shadow-sm relative">
//     <div className="card-body flex-row justify-between items-center border-[#745fc9] border-2 rounded-sm">
//       <div className="space-y-1">
//         <p className="stat-title">Rating</p>
//         <h2 className="stat-value text-[#745fc9] leading-none">4.1</h2>
//         <p className="text-sm">Joswe L. Tubio</p>
//       </div>
//       <Medal className="h-10 w-10 text-gray-400" />
//     </div>
//     <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 hover:opacity-30 transition duration-300 rounded-sm"></div>
//   </div>

//   <div className="card bg-base-100 card-md shadow-sm relative">
//     <div className="card-body flex-row justify-between items-center border-[#745fc9] border-2 rounded-sm">
//       <div className="space-y-1">
//         <p className="stat-title">Rating</p>
//         <h2 className="stat-value text-[#745fc9] leading-none">3.9</h2>
//         <p className="text-sm">Dester O. Golloso</p>
//       </div>
//       <Medal className="h-10 w-10 text-orange-500" />
//     </div>
//     <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 hover:opacity-30 transition duration-300 rounded-sm"></div>
//   </div>
// </div>
