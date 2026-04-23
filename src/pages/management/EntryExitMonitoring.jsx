import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { LucideFileClock } from "lucide-react";
import { Link } from "react-router-dom";

export default function EntryExitPage() {
  const [type, setType] = useState("private");

  const [plate, setPlate] = useState("");
  const [driver, setDriver] = useState("");
  const [vehicleName, setVehicleName] = useState("");

  const [govVehicle, setGovVehicle] = useState("");
  const [govDriver, setGovDriver] = useState("");

  const [activeEntries, setActiveEntries] = useState([]);
  const [history, setHistory] = useState([]);

  const drivers = ["Juan Dela Cruz", "Pedro Santos", "Maria Reyes"];
  const vehicles = ["ABC-123", "XYZ-789", "DEF-456"];

  const handleEntry = () => {
    const now = new Date();

    let entryData;

    if (type === "private") {
      if (!plate || !driver || !vehicleName) {
        return toast.error("Please fill all private vehicle fields");
      }

      entryData = {
        type: "Private",
        plate,
        driver,
        vehicleName,
        timeIn: now,
      };
    } else {
      if (!govVehicle || !govDriver || !govVehicleName) {
        return toast.error("Please select all government vehicle fields");
      }

      entryData = {
        type: "Government",
        plate: govVehicle,
        driver: govDriver,
        vehicleName: govVehicleName,
        timeIn: now,
      };
    }

    setActiveEntries((prev) => [...prev, entryData]);

    setPlate("");
    setDriver("");
    setVehicleName("");
    setGovVehicle("");
    setGovDriver("");
    setGovVehicleName("");

    toast.success("Vehicle entered");
  };

  const handleExit = (index) => {
    const now = new Date();
    const entry = activeEntries[index];

    const updatedEntry = {
      ...entry,
      timeOut: now,
    };

    setHistory((prev) => [updatedEntry, ...prev]);
    setActiveEntries((prev) => prev.filter((_, i) => i !== index));

    toast.success("Vehicle exited");
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-7xl p-8 py-20"
    >
      <div className="text-center">
        <h1 className="mt-7 text-5xl font-bold uppercase">
          Entry & Exit Monitoring
        </h1>
        <p className="mt-2 text-gray-600">
          Monitor vehicle entry and exit in real-time
        </p>
      </div>

      <div className="flex justify-end">
        <Link to="/entry-exit-history">
          <button className="btn btn-success flex gap-2 text-white">
            <LucideFileClock className="h-4 w-6" />
            Vehicle History
          </button>
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 items-start gap-8">
        <div className="flex min-h-[260px] w-full flex-col justify-between rounded-xl border p-6 shadow-sm">
          <div className="mb-6 flex gap-4">
            <button
              className={`btn flex-1 ${type === "private" ? "bg-green-600 text-white" : ""}`}
              onClick={() => setType("private")}
            >
              Private
            </button>
            <button
              className={`btn flex-1 ${type === "government" ? "bg-green-600 text-white" : ""}`}
              onClick={() => setType("government")}
            >
              Government
            </button>
          </div>

          <div className="grid min-h-[70px] grid-cols-2 gap-4">
            {type === "private" ? (
              <>
                <input
                  type="text"
                  placeholder="Plate Number"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  className="input input-bordered w-full"
                />
                <input
                  type="text"
                  placeholder="Driver Name"
                  value={driver}
                  onChange={(e) => setDriver(e.target.value)}
                  className="input input-bordered w-full"
                />

                <input
                  type="text"
                  placeholder="Vehicle Name (e.g. Toyota, Honda)"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="input input-bordered col-span-2 w-full"
                />
              </>
            ) : (
              <>
                <select
                  className="select select-bordered w-full"
                  value={govVehicle}
                  onChange={(e) => setGovVehicle(e.target.value)}
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((v, i) => (
                    <option key={i}>{v}</option>
                  ))}
                </select>

                <select
                  className="select select-bordered w-full"
                  value={govDriver}
                  onChange={(e) => setGovDriver(e.target.value)}
                >
                  <option value="">Select Driver</option>
                  {drivers.map((d, i) => (
                    <option key={i}>{d}</option>
                  ))}
                </select>
              </>
            )}
          </div>

          <button
            onClick={handleEntry}
            className="btn mt-6 w-full bg-green-600 text-white"
          >
            IN
          </button>
        </div>

        <div className="rounded-xl border p-2 shadow">
          <div className="w-full">
            <h2 className="mt-2 mb-4 flex justify-center text-2xl font-semibold">
              Vehicles Inside
            </h2>

            <div className="w-full overflow-x-auto rounded-lg">
              <table className="table w-full">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="w-24">Type</th>
                    <th className="w-32">Plate</th>
                    <th className="w-32">Vehicle</th>
                    <th className="w-40">Driver</th>
                    <th className="w-40">Time In</th>
                    <th className="w-40">Time Out</th>
                    <th className="w-24 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {activeEntries.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-6 text-center">
                        No active entries
                      </td>
                    </tr>
                  ) : (
                    activeEntries.map((entry, index) => (
                      <tr key={index}>
                        <td>{entry.type}</td>
                        <td>{entry.plate}</td>
                        <td>{entry.vehicleName}</td>
                        <td>{entry.driver}</td>
                        <td>{formatDate(entry.timeIn)}</td>
                        <td>{formatDate(entry.timeOut)}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm bg-red-500 text-white"
                            onClick={() => handleExit(index)}
                          >
                            OUT
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
