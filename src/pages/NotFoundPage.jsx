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

// <div className="px-4 py-3 border-b border-green-300">
//   <div
//     className="flex items-center gap-3 cursor-pointer group"
//     onClick={() => (window.location.href = "/")}
//   >
//     <img
//       className="h-15 object-contain"
//       src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/nea-logo.png"
//       alt="NEA Logo"
//       onError={(e) => {
//         e.currentTarget.src =
//           "https://8upload.com/display/68d52d9e15810/logo-alas1.jpg.php";
//       }}
//     />

//     {/* Organization Text */}
//     <div className="tracking-tight">
//       <p className="text-lg font-bold font-rubik">NEA Dashboard </p>
//       <p className="text-xs text-gray-800">
//         Transport Operations Services Unit (TOSU)
//       </p>
//     </div>
//   </div>
// </div>;
