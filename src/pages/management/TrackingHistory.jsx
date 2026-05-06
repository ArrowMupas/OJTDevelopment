import {
  ArrowLeft,
  Car,
  Store,
  Tag,
  User,
  Users,
  ClockCheck,
  SearchIcon,
  Search,
} from "lucide-react";
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

    // FIX: Query completed records directly from Supabase
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
      console.error("Error fetching records:", error);
      setLoading(false);
      return;
    }

    console.log("Fetched completed records:", data); // Debug log

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
      <div className="flex justify-between">
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
              View your vehicle&apos;s repair history
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:w-full sm:flex-row sm:items-center sm:justify-end">
          <label className="input input-neutral">
            <Search className="h-4 w-6" />
            <input
              type="search"
              placeholder="Search vehicle, plate, shop..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <select
            className="select select-neutral w-full sm:w-auto"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="internal">Internal</option>
            <option value="external">External</option>
            <option value="internal-mini">Mini Repair</option>
          </select>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-3 sm:space-y-4">
        {loading && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-md">
            <div className="loading loading-spinner loading-lg text-green-600"></div>
            <p className="mt-3 text-gray-500">Loading records...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center text-gray-500 shadow-md">
            <ClockCheck className="mx-auto mb-3 size-12 opacity-50" />
            <p className="text-lg font-medium">No completed records found</p>
            <p className="text-sm">Completed repairs will appear here</p>
          </div>
        )}

        {!loading &&
          filtered.map((repair) => {
            const steps = getSteps(repair.type);

            return (
              <div
                key={repair.id}
                className="overflow-hidden rounded-2xl bg-white p-4 shadow-md sm:p-6"
              >
                {/* HEADER */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <h2 className="flex min-w-0 items-center gap-2 text-xs font-bold sm:text-sm">
                      <Car size={16} className="shrink-0" />
                      <span className="truncate">{repair.vehicles?.name}</span>
                    </h2>

                    <div className="badge badge-primary badge-sm sm:badge-md badge-dash truncate">
                      {repair.vehicles?.plate_number}
                    </div>

                    <div className="badge badge-outline badge-sm uppercase">
                      <Tag size={12} className="shrink-0" />
                      <span className="truncate">
                        {repair.type === "internal-mini"
                          ? "Mini Repair"
                          : repair.type}
                      </span>
                    </div>

                    <div className="badge badge-success badge-sm">
                      Completed
                    </div>
                  </div>

                  {repair.completed_at && (
                    <p className="text-xs text-gray-500 sm:text-sm">
                      {format(
                        new Date(repair.completed_at),
                        "MMM dd, yyyy • hh:mm a",
                      )}
                    </p>
                  )}
                </div>

                {/* DETAILS */}
                <div className="mt-4 grid gap-2 text-xs text-gray-500 sm:grid-cols-2 sm:text-sm">
                  {repair.type !== "external" ? (
                    <>
                      <div className="flex items-start gap-2">
                        <User size={14} className="mt-0.5 shrink-0" />
                        <span className="truncate">
                          <span className="font-medium">Personnel 1:</span>{" "}
                          {repair.assigned_personnel_1 || "—"}
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <Users size={14} className="mt-0.5 shrink-0" />
                        <span className="truncate">
                          <span className="font-medium">Personnel 2:</span>{" "}
                          {repair.assigned_personnel_2 || "—"}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex min-w-0 items-start gap-2 sm:col-span-2">
                      <Store size={14} className="mt-0.5 shrink-0" />
                      <span className="truncate">
                        <span className="font-medium">Service Shop:</span>{" "}
                        {repair.service_shop || "—"}
                      </span>
                    </div>
                  )}
                </div>

                {/* TIMELINE - All steps completed */}
                <div className="mt-5 overflow-x-auto">
                  <ul className="steps">
                    {steps.map((label, i) => {
                      return (
                        <li key={i} className="step step-success">
                          <div className="text-xs sm:text-sm">{label}</div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
}
