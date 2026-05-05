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

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const PAGE_SIZE = 50;

  const navigate = useNavigate();

  async function fetchHistory(
    searchTerm = "",
    start = "",
    end = "",
    pageNum = 1,
  ) {
    setLoading(true);

    const from = (pageNum - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

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
        { count: "exact" },
      )
      .lte("time", endOfYesterday.toISOString())
      .order("time", { ascending: false })
      .range(from, to);

    const searchColumns = ["plate_number", "vehicle_name", "driver_name"];

    if (searchTerm) {
      let orQueryParts = searchColumns.map(
        (field) => `${field}.ilike.%${searchTerm}%`,
      );
      query = query.or(orQueryParts.join(","));
    }

    if (start) query = query.gte("time", start);
    if (end) query = query.lte("time", end + "T23:59:59");

    const { data, error, count } = await query;

    if (error) {
      console.error("History fetch error:", error);
    } else {
      setHistory(data || []);
      setTotalCount(count || 0);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchHistory(search, fromDate, toDate, page);
  }, [page]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value, start, end) => {
        setPage(1);
        fetchHistory(value, start, end, 1);
      }, 400),
    [],
  );

  async function handleExport() {
    setLoading(true);

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
      .order("time", { ascending: false });

    if (search) {
      const searchColumns = ["plate_number", "vehicle_name", "driver_name"];
      const orQueryParts = searchColumns.map(
        (field) => `${field}.ilike.%${search}%`,
      );
      query = query.or(orQueryParts.join(","));
    }

    if (fromDate) query = query.gte("time", fromDate);
    if (toDate) query = query.lte("time", toDate + "T23:59:59");

    const { data, error } = await query;

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const exportData = data || [];

    let reportTitle = "Entry & Exit History Report";

    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const sameDay = fromDate === toDate;

      if (sameDay) {
        reportTitle += ` for ${format(start, "MMMM d, yyyy")}`;
      } else {
        reportTitle += ` from ${format(start, "MMMM d")} to ${format(
          end,
          "MMMM d, yyyy",
        )}`;
      }
    } else if (fromDate) {
      reportTitle += ` starting ${format(new Date(fromDate), "MMMM d, yyyy")}`;
    } else if (toDate) {
      reportTitle += ` up to ${format(new Date(toDate), "MMMM d, yyyy")}`;
    }

    const sheetData = [
      [reportTitle],
      [],
      ["Plate", "Vehicle", "Driver", "Log Type", "Time", "Guard"],
      ...exportData.map((entry) => [
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

    setLoading(false);
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

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

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

        <label className="input">
          <span className="label">From Date</span>
          <input
            type="date"
            className="input input-bordered w-full"
            value={fromDate}
            onChange={(e) => {
              const value = e.target.value;
              setFromDate(value);
              setPage(1);
              fetchHistory(search, value, toDate, 1);
            }}
          />
        </label>

        <label className="input">
          <span className="label">To Date</span>
          <input
            type="date"
            className="input input-bordered w-full"
            value={toDate}
            onChange={(e) => {
              const value = e.target.value;
              setToDate(value);
              setPage(1);
              fetchHistory(search, fromDate, value, 1);
            }}
          />
        </label>

        <button
          className="btn btn-error btn-soft"
          onClick={() => {
            setSearch("");
            setFromDate("");
            setToDate("");
            setPage(1);
            fetchHistory("", "", "", 1);
          }}
        >
          Clear
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-base-100 mt-10">
        <div className="border-base-content/5 bg-base-100 h-screen overflow-x-auto border">
          <table className="table-pin-rows table w-full">
            <thead className="uppercase">
              <tr>
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
                  <td colSpan="6" className="py-12 text-center">
                    <span className="loading loading-infinity loading-xl"></span>
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    No history found
                  </td>
                </tr>
              ) : (
                history.map((entry) => (
                  <tr key={entry.id} className="hover:bg-base-200 capitalize">
                    <td>
                      <div className="badge badge-dash badge-primary badge-sm truncate">
                        {entry.plate_number}
                      </div>
                    </td>
                    <td>{entry.vehicle_name}</td>
                    <td>{entry.driver_name}</td>
                    <td className="truncate">
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
                    <td className="truncate">{formatDate(entry.time)}</td>
                    <td>
                      {entry.guard
                        ? `${entry.guard.role ? entry.guard.role + " " : ""}${entry.guard.last_name}, ${entry.guard.first_name} `
                        : "No guard"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            <tfoot>
              <tr>
                <td colSpan="4" className="py-4 text-center">
                  Total Records: {totalCount}
                </td>
                <td colSpan="2" className="py text-center">
                  <div className="flex justify-center">
                    <div className="join">
                      <button
                        className="join-item btn"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                      >
                        «
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .slice(Math.max(0, page - 3), page + 2)
                        .map((p) => (
                          <button
                            key={p}
                            className={`join-item btn ${p === page ? "btn-active" : ""}`}
                            onClick={() => setPage(p)}
                          >
                            {p}
                          </button>
                        ))}

                      <button
                        className="join-item btn"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        »
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
