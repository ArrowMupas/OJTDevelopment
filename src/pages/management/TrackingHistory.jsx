import { ArrowLeft, ClockCheck, FileArchive, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import * as XLSX from "xlsx";

const internalSteps = [
  "Inspection",
  "Job Order",
  "Spare Parts Complete",
  "On-Going Repair",
  "Accomplished | For Release",
];

const externalSteps = [
  "Inspection",
  "Job Order",
  "Received Disbursement Voucher with Check",
  "On-Going Repair",
  "Accomplished | For Release",
];

const miniSteps = ["Inspection", "Accomplished | For Release"];

export default function TrackingHistory() {
  const [repairs, setRepairs] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // PAGINATION
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 10;
  const navigate = useNavigate();
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const getSteps = (type) => {
    if (type === "internal-mini") return miniSteps;
    if (type === "external") return externalSteps;
    return internalSteps;
  };

  async function fetchRecords(
    searchTerm = "",
    type = "all",
    start = "",
    end = "",
    pageNum = 1,
  ) {
    setLoading(true);

    const from = (pageNum - 1) * PAGE_SIZE;

    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("maintenance_records")
      .select(
        `
        *,
        vehicles (
          name,
          plate_number
        )
      `,
        { count: "exact" },
      )
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false })
      .range(from, to);

    // TYPE FILTER
    if (type !== "all") {
      query = query.eq("type", type);
    }

    // SEARCH
    if (searchTerm) {
      query = query.or(
        `
        service_shop.ilike.%${searchTerm}%,
        assigned_personnel_1.ilike.%${searchTerm}%,
        assigned_personnel_2.ilike.%${searchTerm}%
      `,
      );
    }

    // DATE FILTER
    if (start) {
      query = query.gte("completed_at", start);
    }

    if (end) {
      query = query.lte("completed_at", end);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error(error);

      setLoading(false);

      return;
    }

    let normalized = (data || []).map((item) => ({
      ...item,
      step: item.current_step ?? 0,
    }));

    // VEHICLE SEARCH
    if (searchTerm) {
      const keyword = searchTerm.toLowerCase();

      normalized = normalized.filter(
        (r) =>
          r.vehicles?.name?.toLowerCase().includes(keyword) ||
          r.vehicles?.plate_number?.toLowerCase().includes(keyword) ||
          r.service_shop?.toLowerCase().includes(keyword) ||
          r.assigned_personnel_1?.toLowerCase().includes(keyword) ||
          r.assigned_personnel_2?.toLowerCase().includes(keyword),
      );
    }

    setRepairs(normalized);

    setTotalCount(count || 0);

    setLoading(false);
  }

  useEffect(() => {
    fetchRecords(search, filterType, startDate, endDate, page);
  }, [page]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value, type, start, end) => {
        setPage(1);

        fetchRecords(value, type, start, end, 1);
      }, 400),
    [],
  );

  async function handleExport() {
    setExporting(true);

    try {
      let query = supabase
        .from("maintenance_records")
        .select(
          `
          *,
          vehicles (
            name,
            plate_number
          )
        `,
        )
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false });

      // TYPE FILTER
      if (filterType !== "all") {
        query = query.eq("type", filterType);
      }

      // SEARCH
      if (search) {
        query = query.or(`
          service_shop.ilike.%${search}%,
          assigned_personnel_1.ilike.%${search}%,
          assigned_personnel_2.ilike.%${search}%
        `);
      }

      // DATE FILTER
      if (startDate) {
        query = query.gte("completed_at", startDate);
      }

      if (endDate) {
        query = query.lte("completed_at", endDate);
      }

      const { data, error } = await query;

      if (error) {
        console.error(error);

        setExporting(false);

        return;
      }

      let exportData = data || [];

      // VEHICLE SEARCH
      if (search) {
        const keyword = search.toLowerCase();

        exportData = exportData.filter(
          (r) =>
            r.vehicles?.name?.toLowerCase().includes(keyword) ||
            r.vehicles?.plate_number?.toLowerCase().includes(keyword) ||
            r.service_shop?.toLowerCase().includes(keyword) ||
            r.assigned_personnel_1?.toLowerCase().includes(keyword) ||
            r.assigned_personnel_2?.toLowerCase().includes(keyword),
        );
      }

      if (exportData.length === 0) {
        setExporting(false);

        return;
      }

      const sheetData = [
        ["Repair History Report"],
        [],
        ["Total Records:", exportData.length],
        ["Generated On:", format(new Date(), "MMMM d, yyyy hh:mm a")],
        [],
        [
          "Vehicle",
          "Plate Number",
          "Repair Type",
          "Completed At",
          "Personnel 1",
          "Personnel 2",
          "Service Shop",
          "Remarks",
        ],

        ...exportData.map((repair) => [
          repair.vehicles?.name || "-",

          repair.vehicles?.plate_number || "-",

          repair.type === "internal-mini"
            ? "Mini Repair"
            : repair.type === "internal"
              ? "Internal"
              : "External",

          repair.completed_at
            ? format(new Date(repair.completed_at), "MMM dd, yyyy hh:mm a")
            : "-",

          repair.assigned_personnel_1 || "-",

          repair.assigned_personnel_2 || "-",

          repair.service_shop || "-",

          repair.remarks || "-",
        ]),
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

      worksheet["!cols"] = [
        { wch: 30 },
        { wch: 20 },
        { wch: 20 },
        { wch: 25 },
        { wch: 25 },
        { wch: 25 },
        { wch: 30 },
        { wch: 40 },
      ];

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Repair History");

      XLSX.writeFile(
        workbook,
        `repair_history_${format(new Date(), "yyyyMMdd_HHmmss")}.xlsx`,
      );
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  }

  return (
    <main className="min-h-screen space-y-7 px-3 py-4 pb-25 sm:px-5">
      {/* HEADER */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-square btn-warning btn-dash h-auto"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-lg font-bold">Repair History</h1>

            <p className="text-sm text-gray-500">
              View completed repair records
            </p>
          </div>
        </div>

        <button
          className="btn btn-secondary"
          onClick={handleExport}
          disabled={exporting}
        >
          <FileArchive className="h-4 w-4" />

          {exporting ? "Exporting..." : "Generate Report"}
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col gap-2 lg:flex-row">
        {/* SEARCH */}
        <label className="input input-bordered min-w-full sm:min-w-80">
          <Search className="size-4 opacity-60" />

          <input
            type="search"
            placeholder="Search vehicle, plate, personnel..."
            value={search}
            onChange={(e) => {
              const value = e.target.value;

              setSearch(value);

              debouncedSearch(value, filterType, startDate, endDate);
            }}
          />
        </label>

        {/* TYPE */}
        <select
          className="select select-bordered min-w-full sm:min-w-60"
          value={filterType}
          onChange={(e) => {
            const value = e.target.value;

            setFilterType(value);

            setPage(1);

            fetchRecords(search, value, startDate, endDate, 1);
          }}
        >
          <option value="all">All</option>

          <option value="internal">Internal</option>

          <option value="external">External</option>

          <option value="internal-mini">Internal (Mini Repair)</option>
        </select>

        {/* DATE FROM */}
        <input
          type="date"
          className="input input-bordered"
          value={startDate}
          onChange={(e) => {
            const value = e.target.value;

            setStartDate(value);

            setPage(1);

            fetchRecords(search, filterType, value, endDate, 1);
          }}
        />

        {/* DATE TO */}
        <input
          type="date"
          className="input input-bordered"
          value={endDate}
          onChange={(e) => {
            const value = e.target.value;

            setEndDate(value);

            setPage(1);

            fetchRecords(search, filterType, startDate, value, 1);
          }}
        />

        {/* CLEAR */}
        <button
          className="btn btn-error btn-soft"
          onClick={() => {
            setSearch("");

            setFilterType("all");

            setStartDate("");

            setEndDate("");

            setPage(1);

            fetchRecords("", "all", "", "", 1);
          }}
        >
          Clear
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : repairs.length === 0 ? (
        <div className="card bg-base-100 border shadow-sm">
          <div className="card-body items-center py-12 text-center">
            <ClockCheck className="size-14 text-gray-400" />

            <h2 className="text-lg font-semibold">
              No completed repairs found
            </h2>

            <p className="text-sm text-gray-500">
              Completed maintenance records will appear here
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            {repairs.map((repair) => {
              const steps = getSteps(repair.type);

              return (
                <div
                  key={repair.id}
                  className="card bg-base-100 rounded-xl border border-gray-300 shadow-sm hover:ring hover:ring-green-500"
                >
                  <div className="card-body p-4 sm:p-5">
                    {/* HEADER */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-base font-semibold sm:text-lg">
                          {repair.vehicles?.name}
                        </h2>

                        <div className="badge badge-primary badge-dash badge-sm truncate">
                          {repair.vehicles?.plate_number}
                        </div>

                        <div
                          className={`badge badge-sm uppercase ${
                            repair.type === "external"
                              ? "badge-warning"
                              : repair.type === "internal-mini"
                                ? "badge-info"
                                : "badge-primary"
                          }`}
                        >
                          {repair.type === "internal-mini"
                            ? "Mini Repair"
                            : repair.type === "internal"
                              ? "Internal"
                              : "External"}
                        </div>

                        <div className="badge badge-success badge-sm">
                          Completed
                        </div>
                      </div>

                      {repair.completed_at && (
                        <div className="text-xs text-gray-500">
                          {format(
                            new Date(repair.completed_at),
                            "MMM dd, yyyy • hh:mm a",
                          )}
                        </div>
                      )}
                    </div>

                    {/* REMARKS */}
                    <div>
                      <div className="text-xs text-gray-500">Remarks</div>

                      <p className="text-xs">{repair?.remarks || "—"}</p>
                    </div>

                    {/* TIMELINE */}
                    <div className="mt-5">
                      <ul className="steps steps-vertical sm:steps-horizontal w-full overflow-x-clip">
                        {steps.map((label, i) => (
                          <li
                            key={i}
                            className="step step-success text-success text-xs font-bold"
                          >
                            {label}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* DETAILS */}
                    <div className="text-base-content space-y-2 text-xs sm:text-sm">
                      {repair.type !== "external" ? (
                        <div className="space-y-2">
                          <div>
                            <div className="truncate text-xs text-gray-500">
                              Personnel 1
                            </div>

                            <div className="truncate text-xs font-bold sm:text-sm">
                              {repair.assigned_personnel_1 || "—"}
                            </div>
                          </div>

                          <div>
                            <div className="truncate text-xs text-gray-500">
                              Personnel 2
                            </div>

                            <div className="truncate text-xs font-bold sm:text-sm">
                              {repair.assigned_personnel_2 || "—"}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-xs text-gray-500">
                            Service Shop
                          </div>

                          <div className="truncate text-sm font-medium">
                            {repair.service_shop || "—"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAGINATION */}
          <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-gray-500">Total Records: {totalCount}</p>

            <div className="join">
              <button
                className="join-item btn btn-sm"
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
                    className={`join-item btn btn-sm ${
                      p === page ? "btn-active" : ""
                    }`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}

              <button
                className="join-item btn btn-sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                »
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
