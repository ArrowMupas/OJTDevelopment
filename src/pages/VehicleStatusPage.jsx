import { 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Search
} from "lucide-react";
import { useState } from "react";

export default function InsuranceExpiryQueue() {
  const [search, setSearch] = useState("");

  const vehicles = [
    { model: "Toyota Altis", plate: "SJX840", expiry: "2024-11-01", policy: "1000775941" },
    { model: "Isuzu Sportivo", plate: "SLD629", expiry: "2024-10-01", policy: "1000772907" },
    { model: "Isuzu Crosswind", plate: "SKX918", expiry: "2024-09-01", policy: "1000769364" },
    { model: "Isuzu Dmax", plate: "SND-1339", expiry: "2026-03-05", policy: "1000773382" },
    { model: "Honda City", plate: "SJH181", expiry: "2026-05-20", policy: "1000748702" },
  ];

  const getStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) 
      return { label: "Expired", color: "bg-red-100 text-red-600", icon: <AlertCircle className="w-5 h-5 text-red-600" /> };
    if (diffDays <= 15) 
      return { label: "Expiring Soon", color: "bg-yellow-100 text-yellow-600", icon: <Clock className="w-5 h-5 text-yellow-600" /> };
    return { label: "Active", color: "bg-green-100 text-green-600", icon: <CheckCircle2 className="w-5 h-5 text-green-600" /> };
  };

  const filtered = vehicles.filter(v =>
    v.plate.toLowerCase().includes(search.toLowerCase()) ||
    v.model.toLowerCase().includes(search.toLowerCase())
  );

  const expiredCount = vehicles.filter(v => getStatus(v.expiry).label === "Expired").length;
  const urgentCount = vehicles.filter(v => getStatus(v.expiry).label === "Expiring Soon").length;
  const activeCount = vehicles.filter(v => getStatus(v.expiry).label === "Active").length;

  return (
    <div className="min-h-screen bg-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Insurance Expiry Monitoring</h1>
            <p className="text-gray-500">Vehicle insurance overview</p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vehicle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full">{<AlertCircle className="w-6 h-6 text-red-600" />}</div>
              <span className="font-bold text-red-600 uppercase">Expired</span>
            </div>
            <span className="text-2xl font-bold text-red-600">{expiredCount}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-full">{<Clock className="w-6 h-6 text-yellow-600" />}</div>
              <span className="font-bold text-yellow-600 uppercase">Expiring Soon</span>
            </div>
            <span className="text-2xl font-bold text-yellow-600">{urgentCount}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">{<CheckCircle2 className="w-6 h-6 text-green-600" />}</div>
              <span className="font-bold text-green-600 uppercase">Active</span>
            </div>
            <span className="text-2xl font-bold text-green-600">{activeCount}</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-green-600 text-white uppercase text-xs tracking-wider">
              <tr>
                <th className="text-left px-6 py-3">Plate Number</th>
                <th className="text-left px-6 py-3">Vehicle Model</th>
                <th className="text-left px-6 py-3">Policy Number</th>
                <th className="text-left px-6 py-3">Expiry Date</th>
                <th className="text-left px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => {
                const status = getStatus(v.expiry);
                return (
                  <tr key={i} className="border-t hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-800">{v.plate}</td>
                    <td className="px-6 py-4 text-gray-600">{v.model}</td>
                    <td className="px-6 py-4 font-mono text-gray-700">{v.policy}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(v.expiry).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.color} gap-1`}>
                        {status.icon} {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}