import {
  Car,
  Clock,
  FileChartColumnIncreasing,
  Search,
  Star,
} from "lucide-react";
import { useState } from "react";

export default function DriverMonitoringPage() {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [search, setSearch] = useState("");

  const drivers = [
    {
      name: "SUSAYA, VIRGILYO Y.",
      vehicle: "Honda City",
      appearance: 1,
      behavior: 1,
      safety: 1,
      cleanliness: 1,
      onTime: 1,
      surveys: 1,
      comments: ["No comment"],
    },
    {
      name: "BIAY M. DERRICK",
      vehicle: "Toyota Vios",
      appearance: 1,
      behavior: 1,
      safety: 2,
      cleanliness: 1,
      onTime: 1,
      surveys: 1,
      comments: ["No comment"],
    },
    {
      name: "GOLLOSO, DEXTER O.",
      vehicle: "Isuzu DMax",
      appearance: 1,
      behavior: 1,
      safety: 2,
      cleanliness: 1,
      onTime: 2,
      surveys: 1,
      comments: ["N/A"],
    },
  ];

  const calculateAverage = (driver) => {
    const total =
      driver.appearance +
      driver.behavior +
      driver.safety +
      driver.cleanliness +
      driver.onTime;
    return (total / 5).toFixed(2);
  };

  const getStatusStyle = (avg) => {
    if (avg <= 1.2) return "text-green-600 bg-green-100";
    if (avg <= 1.5) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const filtered = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.vehicle.toLowerCase().includes(search.toLowerCase()),
  );

  const overallAverage = (
    drivers.reduce((sum, d) => sum + parseFloat(calculateAverage(d)), 0) /
    drivers.length
  ).toFixed(2);

  return (
    <main className="px-5 py-4 h-full pb-25">

      {/* Header */}
      <h1 className="text-lg font-bold">Driver Performance Monitoring</h1>
      <p className="text-gray-500 text-sm mb-6">
        Survey evaluation overview
      </p>

    {/* Search */}
<div className="mb-6">
  <label className="input input-neutral w-72">
    <Search className="h-4 w-6" />
    <input
      type="search"
      placeholder="Search driver..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </label>
</div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body p-4 flex-row items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Average Rating</p>
              <p className="text-xl font-bold">{overallAverage}</p>
            </div>
            <Star className="w-6 h-6 text-yellow-400" />
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body p-4 flex-row items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Surveys</p>
              <p className="text-xl font-bold text-green-600">3</p>
            </div>
            <FileChartColumnIncreasing className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body p-4 flex-row items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">On-Time Rate</p>
              <p className="text-xl font-bold text-yellow-600">95%</p>
            </div>
            <Clock className="w-6 h-6 text-yellow-400" />
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body p-4 flex-row items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Active Drivers</p>
              <p className="text-xl font-bold">{drivers.length}</p>
            </div>
            <Car className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Driver Table */}
      <div className="overflow-x-auto border border-base-300 rounded-lg">
        <table className="table table-zebra text-sm">
          <thead className="bg-green-600 text-white">
            <tr>
              <th>Driver</th>
              <th>Vehicle</th>
              <th>Average</th>
              <th>Surveys</th>
              <th>Adjectival Rating</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((driver, index) => {
              const avg = calculateAverage(driver);

              return (
                <>
                  <tr
                    key={index}
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedDriver(
                        selectedDriver === index ? null : index,
                      )
                    }
                  >
                    <td className="font-semibold">{driver.name}</td>
                    <td>{driver.vehicle}</td>
                    <td>{avg}</td>
                    <td>{driver.surveys}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                          avg,
                        )}`}
                      >
                        {avg <= 1.2
                          ? "Excellent"
                          : avg <= 1.5
                          ? "Good"
                          : "Needs Review"}
                      </span>
                    </td>
                  </tr>

                  {/* Expandable Details */}
                  {selectedDriver === index && (
                    <tr>
                      <td colSpan="5">
                        <div className="grid md:grid-cols-2 gap-6 p-4 text-sm">
                          <div>
                            <p>
                              <strong>Appearance:</strong> {driver.appearance}
                            </p>
                            <p>
                              <strong>Behavior:</strong> {driver.behavior}
                            </p>
                            <p>
                              <strong>Safety Driving:</strong> {driver.safety}
                            </p>
                            <p>
                              <strong>Cleanliness:</strong>{" "}
                              {driver.cleanliness}
                            </p>
                            <p>
                              <strong>On Time:</strong> {driver.onTime}
                            </p>
                          </div>

                          <div>
                            <strong>Comments:</strong>
                            <ul className="list-disc ml-5 mt-2">
                              {driver.comments.map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}