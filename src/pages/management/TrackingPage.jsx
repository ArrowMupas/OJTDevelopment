import { FolderClock, Car, Tag, User, Users, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

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

export default function TrackingPage() {
  const [repairs, setRepairs] = useState([]);
  const [viewType, setViewType] = useState("all");
  const navigate = useNavigate();

  const getSteps = (type) => {
    if (type === "internal-mini") return miniSteps;
    if (type === "external") return externalSteps;
    return internalSteps;
  };

  async function fetchRecords() {
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
      .is("completed_at", null)
      .order("created_at", { ascending: false });

    if (!error) {
      const normalized = (data || []).map((item) => ({
        ...item,
        step: item.current_step ?? 0,
      }));

      setRepairs(normalized);
    }
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <main className="min-h-screen space-y-7 px-3 py-4 pb-25 sm:px-5">
      <div className="flex justify-between">
        <div>
          <h1 className="text-lg font-bold">Repair & Maintenance</h1>
          <p className="text-sm text-gray-500">
            View and monitor vehicle repair progress
          </p>
        </div>

        <div className="flex gap-2">
          <label htmlFor="" className="select min-w-67">
            <span className="label">Type</span>
            <select
              className="select select-neutral"
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
              <option value="internal-mini">Internal (Mini Repair)</option>
            </select>
          </label>

          <button
            className="btn btn-info text-white"
            onClick={() => navigate("/tracking-history")}
          >
            <FolderClock className="size-4" />
            Tracking History
          </button>
        </div>
      </div>

      {/* LIST - Pure display with remarks */}
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
        {repairs.filter(
          (repair) => viewType === "all" || repair.type === viewType,
        ).length === 0 ? (
          <div className="col-span-full">
            <div className="card bg-base-100 rounded-xl border border-dashed shadow-sm">
              <div className="card-body items-center py-14 text-center">
                <FolderClock className="size-14 text-gray-400" />

                <h2 className="text-lg font-semibold">
                  No active repairs found
                </h2>

                <p className="max-w-sm text-sm text-gray-500">
                  Ongoing maintenance and repair records will appear here.
                </p>
              </div>
            </div>
          </div>
        ) : (
          repairs
            .filter((repair) => viewType === "all" || repair.type === viewType)
            .map((repair) => {
              const steps = getSteps(repair.type);

              return (
                <div
                  key={repair.id}
                  className="card bg-base-100 rounded-xl border border-gray-300 shadow-sm hover:ring hover:ring-green-500"
                >
                  <div className="card-body p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="flex items-center gap-2 truncate text-base font-semibold sm:text-lg">
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
                      </div>
                    </div>

                    {/* REMARKS SECTION */}
                    <div>
                      <div className="text-xs text-gray-500">Remarks</div>

                      <p className="text-xs">{repair?.remarks || "—"}</p>
                    </div>

                    {/* TIMELINE */}
                    <div className="mt-5 flex flex-col gap-2">
                      <ul className="steps steps-vertical sm:steps-horizontal w-full overflow-x-clip">
                        {steps.map((label, i) => {
                          const active = i <= repair.step;

                          return (
                            <li
                              key={i}
                              className={`step text-xs font-bold ${
                                active ? "step-success text-success" : ""
                              }`}
                            >
                              {label}
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* DETAILS SECTION */}
                    <div className="text-base-content space-y-2 text-xs sm:text-sm">
                      {repair.type !== "external" ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="min-w-0">
                              <div className="truncate text-xs text-gray-500">
                                Personnel 1
                              </div>

                              <div className="truncate text-xs font-bold sm:text-sm">
                                {repair.assigned_personnel_1 || "—"}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="min-w-0">
                              <div className="truncate text-xs text-gray-500">
                                Personnel 2
                              </div>

                              <div className="truncate text-xs font-bold sm:text-sm">
                                {repair.assigned_personnel_2 || "—"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2">
                          <div className="min-w-0">
                            <div className="text-xs text-gray-500">
                              Service Shop
                            </div>

                            <div className="truncate text-sm font-medium">
                              {repair.service_shop || "—"}
                            </div>
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
    </main>
  );
}
