import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, FileArchive } from "lucide-react";
import { supabase } from "../../supabaseClient";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import * as XLSX from "xlsx";

export default function EntryExitHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const navigate = useNavigate();

  async function fetchHistory(searchTerm = "", start = "", end = "") {
    setLoading(true);

    const endOfYesterday = new Date();
    endOfYesterday.setHours(0, 0, 0, 0);
    endOfYesterday.setMilliseconds(-1);

    let query = supabase
      .from("entry_log")
      .select(
        `
      *,
      guard (
        id,
        first_name,
        last_name,
        role
      )
    `,
      )
      .lte("time", endOfYesterday.toISOString())
      .order("time", { ascending: false });

    const searchColumns = ["plate_number", "vehicle_name", "driver_name"];

    if (searchTerm) {
      let orQueryParts = searchColumns.map(
        (field) => `${field}.ilike.%${searchTerm}%`,
      );

      query = query.or(orQueryParts.join(","));
    }

    if (start) {
      query = query.gte("time", start);
    }

    if (end) {
      query = query.lte("time", end + "T23:59:59");
    }

    const { data, error } = await query;

    if (error) {
      console.error("History fetch error:", error);
    } else {
      setHistory(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((value, start, end) => {
        fetchHistory(value, start, end);
      }, 400),
    [],
  );

  function handleExport() {
    if (!history.length) return;

    let reportTitle = "Entry & Exit History Report";

    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);

      const sameDay = fromDate === toDate;

      if (sameDay) {
        reportTitle += ` for ${format(start, "MMMM d, yyyy")}`;
      } else {
        reportTitle += ` from ${format(start, "MMMM d")} to ${format(end, "MMMM d, yyyy")}`;
      }
    } else if (fromDate) {
      const start = new Date(fromDate);
      reportTitle += ` starting ${format(start, "MMMM d, yyyy")}`;
    } else if (toDate) {
      const end = new Date(toDate);
      reportTitle += ` up to ${format(end, "MMMM d, yyyy")}`;
    }

    const sheetData = [
      [reportTitle],
      [],
      [
        "Vehicle Type",
        "Plate",
        "Vehicle",
        "Driver",
        "Log Type",
        "Time",
        "Guard",
      ],
      ...history.map((entry) => [
        entry.vehicle_type,
        entry.plate_number,
        entry.vehicle_name,
        entry.driver_name,
        entry.type,
        entry.time ? format(new Date(entry.time), "MMMM d, yyyy hh:mm a") : "-",
        entry.guard
          ? [entry.guard.role, entry.guard.first_name, entry.guard.last_name]
              .filter(Boolean)
              .join(" ")
          : "No guard",
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    worksheet["!cols"] = [
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 25 },
      { wch: 15 },
      { wch: 25 },
      { wch: 25 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "History");

    XLSX.writeFile(workbook, "entry_exit_history.xlsx");
  }

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
      className="mx-auto w-5xl py-15"
    >
      {/* HEADER */}
      <div className="text-center">
        <h1 className="mt-7 text-5xl font-bold uppercase">
          Entry & Exit History
        </h1>

        <p className="mt-2 text-gray-600">
          View completed vehicle entry and exit history
        </p>
      </div>

      {/* ACTIONS */}
      <div className="mt-12 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-neutral btn-outline"
        >
          ← Back to Monitoring
        </button>

        <button className="btn btn-secondary" onClick={handleExport}>
          <FileArchive className="h-4 w-4" />
          Generate Report
        </button>
      </div>

      {/* FILTERS */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {/* SEARCH */}
        <label className="input input-bordered flex w-full items-center gap-2">
          <Search className="h-4 w-4" />
          <input
            type="text"
            placeholder="Search plate, vehicle, driver..."
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              debouncedSearch(value, fromDate, toDate);
            }}
            className="grow"
          />
        </label>

        <label htmlFor="" className="input">
          <span className="label">From Date</span>
          <input
            type="date"
            className="input input-bordered w-full"
            value={fromDate}
            onChange={(e) => {
              const value = e.target.value;
              setFromDate(value);
              fetchHistory(search, value, toDate);
            }}
          />
        </label>

        <label htmlFor="" className="input">
          <span className="label">To Date</span>
          <input
            type="date"
            className="input input-bordered w-full"
            value={toDate}
            onChange={(e) => {
              const value = e.target.value;
              setToDate(value);
              fetchHistory(search, fromDate, value);
            }}
          />
        </label>

        <button
          className="btn btn-error btn-soft"
          onClick={() => {
            setSearch("");
            setFromDate("");
            setToDate("");
            fetchHistory();
          }}
        >
          Clear
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-base-100 mt-10">
        <div className="rounded-box border-base-content/5 bg-base-100 h-screen overflow-x-auto border">
          <table className="table-pin-rows table min-h-50">
            <thead className="uppercase">
              <tr>
                <th>Vehicle Type</th>
                <th>Plate</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Log Type</th>
                <th>Time</th>
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
              ) : history.length === 0 ? (
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
                history.map((entry) => (
                  <tr key={entry.id} className="hover:bg-base-200 capitalize">
                    <td>
                      <span
                        className={`badge badge-sm text-white ${
                          entry.vehicle_type === "private"
                            ? "badge-info"
                            : "badge-error"
                        }`}
                      >
                        {entry.vehicle_type}
                      </span>
                    </td>

                    <td>
                      <div className="badge badge-dash badge-primary badge-sm truncate">
                        {entry.plate_number}
                      </div>
                    </td>

                    <td>{entry.vehicle_name}</td>
                    <td>{entry.driver_name}</td>

                    <td>
                      <span
                        className={`badge badge-sm text-white ${
                          entry.type === "time in"
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {entry.type}
                      </span>
                    </td>

                    <td>{formatDate(entry.time)}</td>

                    <td>
                      {entry.guard
                        ? `${entry.guard.role ? entry.guard.role + " " : ""}${entry.guard.last_name}, ${entry.guard.first_name} `
                        : "No guard"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            <tfoot className="bg-green-400 font-medium">
              <tr>
                <td colSpan="7" className="py-5 text-center text-white">
                  Total Records: {history.length}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
