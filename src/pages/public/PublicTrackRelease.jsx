import {
  ArrowLeft,
  ArrowRightCircle,
  Car,
  ClockCheck,
  Store,
  Tag,
  Undo2,
  User,
  Users,
  History,
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

export default function PublicTrackRelease() {
  const [cars, setCars] = useState([]);
  const [viewType, setViewType] = useState("external");
  const navigate = useNavigate();

  const getSteps = (type) => {
    if (type === "internal-mini") return miniSteps;
    if (type === "external") return externalSteps;
    return internalSteps;
  };

  async function fetchCompleted() {
    const { data } = await supabase
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

    const normalized = (data || []).map((item) => ({
      ...item,
      step: item.current_step ?? 0,
    }));

    setCars(normalized);
  }

  useEffect(() => {
    fetchCompleted();
  }, []);

  return (
    <main className="min-h-screen px-3 py-10 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        {/* HEADER */}
        <div className="mb-5 flex justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold uppercase sm:text-5xl">
              Completed Repairs
            </h1>
            <p className="text-sm sm:text-base">
              Archive of finished maintenance jobs
            </p>
          </div>
          <button
            className="btn btn-info btn-sm sm:btn-md truncate text-white uppercase"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="size-5" />
          </button>
        </div>

        {/* TOP BAR */}
        <div className="mb-5 flex flex-row justify-between">
          <div className="flex w-full justify-between gap-2 sm:w-auto sm:items-center">
            <label htmlFor="" className="select select-sm sm:select-md">
              <span className="label">Type</span>
              <select
                className="select select-sm sm:select-md text-green-700"
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
              >
                <option value="external">External</option>
                <option value="internal">Internal</option>
                <option value="internal-mini">Mini Repair</option>
              </select>
            </label>
          </div>
        </div>

        <div className="h-screen space-y-2 overflow-auto sm:space-y-4">
          {cars
            .filter((car) => car.type === viewType)
            .map((car) => {
              const steps = getSteps(car.type);

              return (
                <div
                  key={car.id}
                  className="card bg-base-100 rounded-xl border shadow-sm"
                >
                  <div className="card-body p-4 sm:p-5">
                    {/* HEADER */}
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <h2 className="flex items-center gap-2 truncate text-base font-semibold sm:text-lg">
                          {car.vehicles?.name}
                        </h2>
                        <div className="badge badge-primary badge-dash badge-sm truncate">
                          {car.vehicles?.plate_number}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:gap-2">
                        <p className="text-center text-xs text-gray-500 sm:text-sm">
                          Completed:
                        </p>
                        <p className="text-xs font-bold sm:text-sm">
                          {car.completed_at
                            ? format(new Date(car.completed_at), "MMM dd, yyyy")
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="min-w-0">
                        <div className="text-xs text-gray-500">Remarks</div>
                        <p className="text-xs">{car?.remarks || "-"}</p>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="my-5 flex flex-col gap-2">
                        <ul className="steps steps-vertical sm:steps-horizontal w-full overflow-x-clip">
                          {steps.map((label, i) => {
                            const active = i <= car.step;
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

                      {/* DETAILS */}
                      <div className="text-base-content space-y-2 text-xs sm:text-sm">
                        {car.type !== "external" ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User size={14} />
                              <div className="min-w-0">
                                <div className="truncate text-xs text-gray-500">
                                  Personnel 1
                                </div>
                                <div className="truncate text-xs font-bold sm:text-sm">
                                  {car.assigned_personnel_1 || "—"}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users size={14} />
                              <div className="min-w-0">
                                <div className="truncate text-xs text-gray-500">
                                  Personnel 2
                                </div>
                                <div className="truncate text-xs font-bold sm:text-sm">
                                  {car.assigned_personnel_2 || "—"}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <Store size={14} />
                            <div className="min-w-0">
                              <div className="text-xs text-gray-500">
                                Service Shop
                              </div>
                              <div className="truncate text-sm font-medium">
                                {car.service_shop || "—"}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </main>
  );
}
