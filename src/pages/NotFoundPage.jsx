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
