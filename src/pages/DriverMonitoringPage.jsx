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
      d.vehicle.toLowerCase().includes(search.toLowerCase())
  );

  const overallAverage = (
    drivers.reduce((sum, d) => sum + parseFloat(calculateAverage(d)), 0) /
    drivers.length
  ).toFixed(2);

  return (
    <div className="min-h-screen bg-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              Driver Performance Monitoring
            </h1>
            <p className="text-gray-500">
              Survey evaluation overview
            </p>
          </div>

          <div className="relative w-72">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search driver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 p-5 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Average Rating</p>
              <p className="text-2xl font-bold text-gray-800">
                {overallAverage}
              </p>
            </div>
            <Star className="w-6 h-6 text-yellow-400" />
          </div>

          <div className="bg-white border border-gray-200 p-5 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Surveys</p>
              <p className="text-2xl font-bold text-green-600">3</p>
            </div>
            <FileChartColumnIncreasing className="w-6 h-6 text-green-600" />
          </div>

          <div className="bg-white border border-gray-200 p-5 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">On-Time Rate</p>
              <p className="text-2xl font-bold text-yellow-600">95%</p>
            </div>
            <Clock className="w-6 h-6 text-yellow-400" />
          </div>

          <div className="bg-white border border-gray-200 p-5 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Drivers</p>
              <p className="text-2xl font-bold text-gray-800">
                {drivers.length}
              </p>
            </div>
            <Car className="w-7 h-7 text-green-600" />
          </div>
        </div>

        {/* Driver Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-green-600 text-white uppercase text-xs tracking-wider">
              <tr>
                <th className="text-left px-6 py-3">Driver</th>
                <th className="text-left px-6 py-3">Vehicle</th>
                <th className="text-left px-6 py-3">Average</th>
                <th className="text-left px-6 py-3">Surveys</th>
                <th className="text-left px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((driver, index) => {
                const avg = calculateAverage(driver);

                return (
                  <>
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50 cursor-pointer transition"
                      onClick={() =>
                        setSelectedDriver(
                          selectedDriver === index ? null : index
                        )
                      }
                    >
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {driver.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {driver.vehicle}
                      </td>
                      <td className="px-6 py-4">{avg}</td>
                      <td className="px-6 py-4">{driver.surveys}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                            avg
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

                    {/* Expandable Detail */}
                    {selectedDriver === index && (
                      <tr className="bg-gray-50">
                        <td colSpan="5" className="px-6 py-6">
                          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
                            <div>
                              <p><strong>Appearance:</strong> {driver.appearance}</p>
                              <p><strong>Behavior:</strong> {driver.behavior}</p>
                              <p><strong>Safety Driving:</strong> {driver.safety}</p>
                              <p><strong>Cleanliness:</strong> {driver.cleanliness}</p>
                              <p><strong>On Time:</strong> {driver.onTime}</p>
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
      </div>
    </div>
  );
}