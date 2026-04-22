import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function EntryExitHistory() {
  const [history, setHistory] = useState([]);

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("vehicleHistory");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const filteredHistory = useMemo(() => {
    return history.filter((entry) => {
      const matchesSearch =
        entry.plate?.toLowerCase().includes(search.toLowerCase()) ||
        entry.vehicle?.toLowerCase().includes(search.toLowerCase()) ||
        entry.driver?.toLowerCase().includes(search.toLowerCase()) ||
        entry.type?.toLowerCase().includes(search.toLowerCase());

      const entryDate = new Date(entry.timeIn);

      const matchesFrom = fromDate ? entryDate >= new Date(fromDate) : true;

      const matchesTo = toDate
        ? entryDate <= new Date(toDate + "T23:59:59")
        : true;

      return matchesSearch && matchesFrom && matchesTo;
    });
  }, [history, search, fromDate, toDate]);

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
          Entry & Exit History
        </h1>
        <p className="mt-2 text-gray-600">
          View the history of vehicle entries and exits
        </p>
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate(-1)}
          className="btn bg-green-600 text-white"
        >
          ← Back to Monitoring
        </button>
      </div>

      <div className="mt-6 grid grid-cols-3 items-center gap-4">
        <label className="input input-bordered flex w-72 items-center gap-2">
          <Search className="h-4 w-4" />
          <input
            type="text"
            placeholder="Search plate, driver, type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="grow"
          />
        </label>

        <div>
          <input
            type="date"
            className="input input-bordered"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <input
            type="date"
            className="input input-bordered"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-10">
        <div className="w-full overflow-x-auto rounded-lg border shadow-sm">
          <table className="table w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="w-24">Type</th>
                <th className="w-40">Vehicle</th>
                <th className="w-32">Plate</th>
                <th className="w-40">Driver</th>
                <th className="w-40">Time In</th>
                <th className="w-40">Time Out</th>
              </tr>
            </thead>

            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center">
                    No matching records found
                  </td>
                </tr>
              ) : (
                filteredHistory.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.type}</td>
                    <td>{entry.vehicle}</td>
                    <td>{entry.plate}</td>
                    <td>{entry.driver}</td>
                    <td>{formatDate(entry.timeIn)}</td>
                    <td>{formatDate(entry.timeOut)}</td>
                  </tr>
                ))
              )}
            </tbody>

            <tfoot className="bg-green-500 text-white">
              <tr>
                <td colSpan="6" className="py-2 text-center">
                  Total Records: {filteredHistory.length}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
