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
  "Auto Repair Service",
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
    <div className="min-h-screen bg-gray-100 px-3 py-10 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-8 text-center sm:mb-12">
          <h1 className="text-3xl font-bold uppercase sm:text-5xl">
            Repair & Maintenance
          </h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Completed repair records
          </p>
        </div>

        {/* TOP BAR */}
        <div className="mb-5 flex flex-col gap-4 rounded-xl bg-[#30694B] p-4 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <button
              className="btn btn-square btn-outline"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="size-7" />
            </button>
            <ClockCheck className="h-6 w-6 sm:h-8 sm:w-8" />

            <div>
              <h2 className="text-lg font-semibold uppercase sm:text-2xl">
                Completed Repairs
              </h2>
              <p className="text-xs opacity-90 sm:text-sm">
                Archive of finished maintenance jobs
              </p>
            </div>
          </div>

          <select
            className="select w-full text-green-700 sm:w-auto"
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
          >
            <option value="external">External</option>
            <option value="internal">Internal</option>
            <option value="internal-mini">Internal (Mini Repair)</option>
          </select>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {cars
            .filter((car) => car.type === viewType)
            .map((car) => {
              const steps = getSteps(car.type);

              return (
                <div
                  key={car.id}
                  className="overflow-hidden rounded-2xl bg-white p-4 shadow-md sm:p-6"
                >
                  {/* HEADER - MATCHING ORIGINAL REPAIR DESIGN */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <h2 className="flex min-w-0 items-center gap-2 text-xs font-bold sm:text-sm">
                        <Car size={16} className="shrink-0" />
                        <span className="truncate">{car.vehicles?.name}</span>
                      </h2>

                      <div className="badge badge-primary badge-sm sm:badge-md badge-dash truncate">
                        {car.vehicles?.plate_number}
                      </div>

                      <div className="badge badge-outline badge-sm uppercase">
                        <Tag size={12} className="shrink-0" />
                        <span className="truncate">{car.type}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <p className="text-sm text-gray-500">
                        Completed at:{" "}
                        {car.completed_at
                          ? format(
                              new Date(car.completed_at),
                              "MMM dd, yyyy • hh:mm a",
                            )
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {/* DETAILS - MATCHING ORIGINAL EXACTLY */}
                  <div className="mt-4 grid gap-2 text-xs text-gray-500 sm:grid-cols-2 sm:text-sm">
                    {car.type !== "external" ? (
                      <div className="flex flex-col">
                        <div className="flex items-start gap-2">
                          <User size={14} className="mt-0.5 shrink-0" />
                          <span className="truncate">
                            <span className="">Personnel 1:</span>{" "}
                            {car.assigned_personnel_1 || "—"}
                          </span>
                        </div>

                        <div className="flex items-start gap-2">
                          <Users size={14} className="mt-0.5 shrink-0" />
                          <span className="truncate">
                            <span className="">Personnel 2:</span>{" "}
                            {car.assigned_personnel_2 || "—"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex min-w-0 items-start gap-2 sm:col-span-2">
                        <Store size={14} className="mt-0.5 shrink-0" />
                        <span className="truncate">
                          <span className="">Service Shop:</span>{" "}
                          {car.service_shop || "—"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* TIMELINE - MATCHING ORIGINAL EXACTLY */}
                  <div className="mt-5 overflow-x-auto">
                    <ul className="steps">
                      {steps.map((label, i) => {
                        const active = i <= car.step;

                        return (
                          <li
                            key={i}
                            className={`step ${active ? "step-success" : ""}`}
                          >
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
      </div>
    </div>
  );
}
