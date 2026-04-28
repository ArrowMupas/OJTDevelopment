import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { supabase } from "../../supabaseClient";
import { format } from "date-fns";

export default function EntryExitHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchHistoryLogs = async () => {
    setLoading(true);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayStartISO = startOfToday.toISOString();

    const { data, error } = await supabase
      .from("entry_log")
      .select(
        `
      *,
      guard (
        id,
        first_name,
        last_name
      )
    `,
      )
      .not("time_out", "is", null)
      .lt("time_out", todayStartISO)
      .order("time_out", { ascending: false });

    if (error) {
      console.error("History logs error:", error);
      setLoading(false);
      return;
    }

    setHistory(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistoryLogs();
  }, []);

  const filteredHistory = useMemo(() => {
    return history.filter((entry) => {
      const matchesSearch =
        entry.plate_number?.toLowerCase().includes(search.toLowerCase()) ||
        entry.vehicle_name?.toLowerCase().includes(search.toLowerCase()) ||
        entry.driver_name?.toLowerCase().includes(search.toLowerCase()) ||
        entry.type?.toLowerCase().includes(search.toLowerCase());

      const entryDate = new Date(entry.time_in);

      const matchesFrom = fromDate ? entryDate >= new Date(fromDate) : true;

      const matchesTo = toDate
        ? entryDate <= new Date(toDate + "T23:59:59")
        : true;

      return matchesSearch && matchesFrom && matchesTo;
    });
  }, [history, search, fromDate, toDate]);

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    return (
      <>
        <span className="block text-sm">
          {format(parsedDate, "MMM d, yyyy")}
        </span>
        <span className="text-xs">{format(parsedDate, "hh:mm a")}</span>
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto w-4xl py-20"
    >
      <div className="text-center">
        <h1 className="mt-7 text-5xl font-bold uppercase">
          Entry & Exit History
        </h1>

        <p className="mt-2 text-gray-600">
          View completed vehicle entry and exit history
        </p>
      </div>

      <div className="mt-12 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-neutral btn-outline"
        >
          ← Back to Monitoring
        </button>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <label className="input input-bordered flex items-center gap-2">
          <Search className="h-4 w-4" />

          <input
            type="text"
            placeholder="Search plate, vehicle, driver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="grow"
          />
        </label>

        <input
          type="date"
          className="input input-bordered"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          className="input input-bordered"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      <div className="bg-base-100 mt-10">
        <div className="rounded-box border-base-content/5 bg-base-100 overflow-x-auto border">
          <table className="table min-h-50">
            <thead className="uppercase">
              <tr>
                <th>Type</th>
                <th>Plate</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Guard</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center sm:py-20">
                    <div className="flex flex-col items-center gap-3">
                      <span className="loading loading-infinity loading-xl"></span>
                      <p className="text-gray-500">Loading history...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center sm:py-20">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="size-8 text-gray-500" />
                      <p className="text-gray-500">No history found</p>
                      <p className="text-xs text-gray-500">
                        Try adjusting your filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((entry) => (
                  <tr key={entry.id} className="hover:bg-base-200 capitalize">
                    <td>
                      <span
                        className={`badge ${
                          entry.type === "private"
                            ? "badge-success"
                            : "badge-error"
                        } badge-sm text-white`}
                      >
                        {entry.type}
                      </span>
                    </td>

                    <td>
                      <div className="badge badge-dash badge-primary badge-sm truncate">
                        {entry.plate_number}
                      </div>
                    </td>

                    <td>{entry.vehicle_name}</td>

                    <td>{entry.driver_name}</td>

                    <td>{formatDate(entry.time_in)}</td>

                    <td>{formatDate(entry.time_out)}</td>

                    <td>
                      {entry.guard
                        ? `${entry.guard.first_name} ${entry.guard.last_name}`
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            <tfoot className="bg-green-400 font-medium">
              <tr>
                <td colSpan="7" className="py-5 text-center text-white">
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
