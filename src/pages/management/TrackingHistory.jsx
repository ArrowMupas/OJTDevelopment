import { ArrowLeft, ClockCheck, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

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
  const [filtered, setFiltered] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getSteps = (type) => {
    if (type === "internal-mini") return miniSteps;
    if (type === "external") return externalSteps;

    return internalSteps;
  };

  async function fetchRecords() {
    setLoading(true);

    const { data, error } = await supabase
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

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const normalized = (data || []).map((item) => ({
      ...item,
      step: item.current_step ?? 0,
    }));

    setRepairs(normalized);
    setFiltered(normalized);

    setLoading(false);
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    let temp = [...repairs];

    if (filterType !== "all") {
      temp = temp.filter((r) => r.type === filterType);
    }

    if (search) {
      const keyword = search.toLowerCase();

      temp = temp.filter(
        (r) =>
          r.vehicles?.name?.toLowerCase().includes(keyword) ||
          r.vehicles?.plate_number?.toLowerCase().includes(keyword) ||
          r.service_shop?.toLowerCase().includes(keyword) ||
          r.assigned_personnel_1?.toLowerCase().includes(keyword) ||
          r.assigned_personnel_2?.toLowerCase().includes(keyword),
      );
    }

    setFiltered(temp);
  }, [search, filterType, repairs]);

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

        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="input input-bordered min-w-full sm:min-w-80">
            <Search className="size-4 opacity-60" />

            <input
              type="search"
              placeholder="Search vehicle, plate, personnel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <label className="select min-w-full sm:min-w-60">
            <span className="label">Type</span>

            <select
              className="select select-neutral"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
              <option value="internal-mini">Internal (Mini Repair)</option>
            </select>
          </label>
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : filtered.length === 0 ? (
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
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {filtered.length === 0 ? (
            <div className="col-span-full">
              <div className="card bg-base-100 rounded-xl border border-dashed shadow-sm">
                <div className="card-body items-center py-14 text-center">
                  <ClockCheck className="size-14 text-gray-400" />

                  <h2 className="text-lg font-semibold">
                    No completed repairs found
                  </h2>

                  <p className="max-w-sm text-sm text-gray-500">
                    Completed maintenance records will appear here.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            filtered.map((repair) => {
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
            })
          )}
        </div>
      )}
    </main>
  );
}
