import {
  Car,
  Clock,
  FileChartColumnIncreasing,
  Search,
  StarIcon,
} from "lucide-react";
import { useState } from "react";

export default function DriverMonitoringPage() {
  const [selectedDriver, setSelectedDriver] = useState(null);

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

  const getStatus = (avg) => {
    if (avg <= 1.2) return "bg-green-100 text-green-700";
    if (avg <= 1.5) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const overallAverage = (
    drivers.reduce((sum, d) => sum + parseFloat(calculateAverage(d)), 0) /
    drivers.length
  ).toFixed(2);

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-3xl font-bold text-black">
          Driver Performance Monitoring
        </h1>
        <p className="text-gray-500">Survey evaluation of drivers</p>
      </div>

      {/* Filters */}
      <div className=" mb-6 flex gap-4 flex-wrap">
        <label className="input  border-black">
          <Search className="h-4 w-6" />
          <input type="search" required placeholder="Search" />
        </label>

        <select defaultValue="Date Range" className="select">
          <option disabled={true}>Pick a color</option>
          <option>Crimson</option>
          <option>Amber</option>
          <option>Velvet</option>
        </select>

        <select defaultValue="Vehicle Type" className="select">
          <option disabled={true}>Pick a vehicle</option>
          <option>Isuzu DMax</option>
          <option>Others</option>
        </select>
      </div>
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {/* Average Rating */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{overallAverage}</h2>
              <p className="text-gray-500">Average Rating</p>
            </div>
            <StarIcon className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        {/* Total Surveys */}

        <button>
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">3</h2>
                <p className="text-gray-500">Total Surveys</p>
              </div>
              <FileChartColumnIncreasing className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </button>
        {/* On-Time Rate */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">95%</h2>
              <p className="text-gray-500">On-Time Rate</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        {/* Active Drivers */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{drivers.length}</h2>
              <p className="text-gray-500">Active Drivers</p>
            </div>
            <Car className="w-10 h-10 text-green-600" />
          </div>
        </div>
      </div>

      {/* Driver Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-green-600 text-white text-sm">
            <tr>
              <th className="p-4">Driver</th>
              <th className="p-4">Vehicle</th>
              <th className="p-4">Avg</th>
              <th className="p-4">Surveys</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, index) => {
              const avg = calculateAverage(driver);
              return (
                <>
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      setSelectedDriver(selectedDriver === index ? null : index)
                    }
                  >
                    <td className="p-4 font-medium">{driver.name}</td>
                    <td className="p-4">{driver.vehicle}</td>
                    <td className="p-4">{avg}</td>
                    <td className="p-4">{driver.surveys}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${getStatus(
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

                  {/* Expandable Detail */}
                  {selectedDriver === index && (
                    <tr className="bg-gray-50">
                      <td colSpan="5" className="p-6">
                        <div className="space-y-2">
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
                            <strong>Vehicle Cleanliness:</strong>{" "}
                            {driver.cleanliness}
                          </p>
                          <p>
                            <strong>On Time:</strong> {driver.onTime}
                          </p>
                          <div>
                            <strong>Comments:</strong>
                            <ul className="list-disc ml-6">
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
  );
}
