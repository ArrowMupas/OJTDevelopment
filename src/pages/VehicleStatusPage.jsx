import { AlertCircle, CheckCircle2, Clock, Search } from "lucide-react";
import { useState } from "react";

export default function InsuranceExpiryQueue() {
  const [search, setSearch] = useState("");

  const vehicles = [
    {
      model: "Toyota Altis",
      plate: "SJX840",
      expiry: "2024-11-01",
      policy: "1000775941",
    },
    {
      model: "Isuzu Sportivo",
      plate: "SLD629",
      expiry: "2024-10-01",
      policy: "1000772907",
    },
    {
      model: "Isuzu Crosswind",
      plate: "SKX918",
      expiry: "2024-09-01",
      policy: "1000769364",
    },
    {
      model: "Isuzu Dmax",
      plate: "SND-1339",
      expiry: "2026-03-05",
      policy: "1000773382",
    },
    {
      model: "Honda City",
      plate: "SJH181",
      expiry: "2026-05-20",
      policy: "1000748702",
    },
  ];

  const getStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return {
        label: "Expired",
        color: "bg-red-100 text-error",
        icon: <AlertCircle className="text-error h-4 w-4" />,
      };

    if (diffDays <= 15)
      return {
        label: "Expiring Soon",
        color: "bg-yellow-100 text-yellow-600",
        icon: <Clock className="h-4 w-4 text-yellow-600" />,
      };

    return {
      label: "Active",
      color: "bg-green-100 text-green-600",
      icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
    };
  };

  const filtered = vehicles.filter(
    (v) =>
      v.plate.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()),
  );

  const expiredCount = vehicles.filter(
    (v) => getStatus(v.expiry).label === "Expired",
  ).length;
  const urgentCount = vehicles.filter(
    (v) => getStatus(v.expiry).label === "Expiring Soon",
  ).length;
  const activeCount = vehicles.filter(
    (v) => getStatus(v.expiry).label === "Active",
  ).length;

  return (
    <main className="h-full px-5 py-4 pb-25">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-lg font-bold">Insurance Expiry Monitoring</h1>
        <p className="text-sm text-gray-500">Vehicle insurance overview</p>
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <label className="input input-neutral w-72">
          <Search className="h-4 w-6" />
          <input
            type="search"
            placeholder="Search vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>

      {/* SUMMARY CARDS */}
      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <div className="card bg-base-100 shadow">
          <div className="card-body flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2">
                <AlertCircle className="text-error h-5 w-5" />
              </div>
              <span className="text-error text-sm font-bold uppercase">
                Expired
              </span>
            </div>
            <span className="text-error text-xl font-bold">{expiredCount}</span>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-yellow-100 p-2">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <span className="text-sm font-bold text-yellow-600 uppercase">
                Expiring Soon
              </span>
            </div>
            <span className="text-xl font-bold text-yellow-600">
              {urgentCount}
            </span>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm font-bold text-green-600 uppercase">
                Active
              </span>
            </div>
            <span className="text-xl font-bold text-green-600">
              {activeCount}
            </span>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card bg-base-100 shadow">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-green-600 text-xs text-white uppercase">
              <tr>
                <th>Plate Number</th>
                <th>Vehicle Model</th>
                <th>Policy Number</th>
                <th>Expiry Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((v, i) => {
                const status = getStatus(v.expiry);
                return (
                  <tr key={i} className="hover">
                    <td className="font-semibold">{v.plate}</td>
                    <td>{v.model}</td>
                    <td className="font-mono">{v.policy}</td>
                    <td>{new Date(v.expiry).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge gap-1 ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
