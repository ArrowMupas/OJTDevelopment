import {
  CirclePlus,
  Car,
  Hash,
  Tag,
  User,
  Users,
  Store,
  Undo2,
  ArrowRightCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OurInput from "../../components/OurInput";
import { repairSchema } from "../../schemas/repairSchema";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

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
  const [vehicles, setVehicles] = useState([]);
  const [viewType, setViewType] = useState("internal");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(repairSchema),
  });

  const selectedType = watch("type");

  const getSteps = (type) => {
    if (type === "internal-mini") return miniSteps;
    if (type === "external") return externalSteps;
    return internalSteps;
  };

  async function fetchVehicles() {
    const { data } = await supabase
      .from("vehicles")
      .select("*")
      .order("name", { ascending: true });

    setVehicles(data || []);
  }

  async function fetchRecords() {
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
      .is("completed_at", null)
      .order("created_at", { ascending: false });

    const normalized = (data || []).map((item) => ({
      ...item,
      step: item.current_step ?? 0,
    }));

    setRepairs(normalized);
  }

  useEffect(() => {
    fetchVehicles();
    fetchRecords();
  }, []);

  async function createMaintenanceRecord(formData) {
    const payload = {
      vehicle_id: Number(formData.vehicleId),
      type: formData.type,
      current_step: 0,
      assigned_personnel_1:
        formData.type === "external" ? null : formData.maintenance1,
      assigned_personnel_2:
        formData.type === "external" ? null : formData.maintenance2,
      service_shop: formData.type === "external" ? formData.serviceShop : null,
    };

    const { data, error } = await supabase
      .from("maintenance_records")
      .insert([payload])
      .select(
        `
        *,
        vehicles (
          name,
          plate_number
        )
      `,
      )
      .single();

    if (error) {
      toast.error("Failed to save record");
      return;
    }

    setRepairs((prev) => [{ ...data, step: data.current_step ?? 0 }, ...prev]);
    reset();
    toast.success("Record created successfully");
    document.getElementById("trackingModal").close();
  }

  async function updateStep(id, action) {
    const target = repairs.find((r) => r.id === id);
    if (!target) return;

    const steps = getSteps(target.type);
    let newStep = target.step;

    if (action === "next" && newStep < steps.length - 1) newStep++;
    if (action === "prev" && newStep > 0) newStep--;

    await supabase
      .from("maintenance_records")
      .update({ current_step: newStep })
      .eq("id", id);

    setRepairs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, step: newStep } : r)),
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-3 py-10 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        {/* HEADER */}
        <div className="mb-5 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold uppercase sm:text-5xl">
              Repair & Maintenance
            </h1>
            <p className="text-sm sm:text-base">
              Manage and monitor vehicle repair progress
            </p>
          </div>

          <Link to="/repairs/completed">
            <button className="btn btn-info btn-sm sm:btn-md truncate text-white uppercase">
              REPAIR HISTORY
            </button>
          </Link>
        </div>

        {/* TOP BAR */}
        <div className="mb-5 flex flex-row justify-between">
          <div className="flex w-full justify-between gap-2 sm:w-auto sm:items-center">
            <button
              className="btn btn-accent btn-sm sm:btn-md text-white uppercase"
              onClick={() =>
                document.getElementById("trackingModal").showModal()
              }
            >
              <CirclePlus className="size-5 sm:size-6" />
              Add Repair
            </button>

            <select
              className="select select-sm sm:select-md text-green-700"
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
            >
              <option value="internal">Internal</option>
              <option value="external">External</option>
              <option value="internal-mini">Mini Repair</option>
            </select>
          </div>
        </div>

        {/* MODAL */}
        <dialog id="trackingModal" className="modal">
          <div className="modal-box max-w-lg rounded-xl p-5 sm:p-8">
            <h1 className="mb-4 text-xl font-bold uppercase sm:text-2xl">
              Add New Repair
            </h1>

            <button
              className="btn btn-circle btn-ghost absolute top-3 right-3"
              onClick={() => document.getElementById("trackingModal").close()}
            >
              ✕
            </button>

            <form
              onSubmit={handleSubmit(createMaintenanceRecord)}
              className="space-y-4"
            >
              <select
                className="select select-bordered w-full"
                {...register("vehicleId")}
              >
                <option value="">Select vehicle</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.plate_number})
                  </option>
                ))}
              </select>

              <select
                className="select select-bordered w-full"
                {...register("type")}
              >
                <option value="">Select type</option>
                <option value="internal">Internal</option>
                <option value="external">External</option>
                <option value="internal-mini">Mini Repair</option>
              </select>

              {selectedType === "external" && (
                <OurInput
                  label="Service Shop"
                  name="serviceShop"
                  register={register}
                />
              )}

              {selectedType !== "external" && selectedType && (
                <>
                  <select
                    className="select select-bordered w-full"
                    {...register("maintenance1")}
                  >
                    <option value="">Maintenance 1</option>
                    <option>Fernando L. Aquino</option>
                    <option>Joseph Neil S. Leonardo</option>
                    <option>Ruel V. Bebanco</option>
                    <option>None</option>
                  </select>

                  <select
                    className="select select-bordered w-full"
                    {...register("maintenance2")}
                  >
                    <option value="">Maintenance 2</option>
                    <option>Fernando L. Aquino</option>
                    <option>Joseph Neil S. Leonardo</option>
                    <option>Ruel V. Bebanco</option>
                    <option>None</option>
                  </select>
                </>
              )}

              <button className="btn w-full bg-green-600 text-white">
                Save
              </button>
            </form>
          </div>
        </dialog>

        <div className="h-screen space-y-2 overflow-auto sm:space-y-4">
          {repairs
            .filter((r) => r.type === viewType)
            .map((repair) => {
              const steps = getSteps(repair.type);

              return (
                <div
                  key={repair.id}
                  className="card bg-base-100 border-base-200 rounded-2xl border shadow-sm"
                >
                  <div className="card-body p-4 sm:p-5">
                    {/* HEADER */}
                    <div className="flex justify-between">
                      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2">
                          <h2 className="flex items-center gap-2 truncate text-base font-semibold sm:text-lg">
                            {repair.vehicles?.name}
                          </h2>
                          <div className="badge badge-primary badge-dash badge-sm truncate">
                            {repair.vehicles?.plate_number}
                          </div>
                        </div>

                        <div className="badge badge-neutral badge-sm flex items-center gap-1 uppercase">
                          {repair.type}
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex flex-col gap-2 sm:flex-row">
                        {repair.step > 0 && (
                          <button
                            className="btn btn-xs sm:btn-sm btn-error text-white"
                            onClick={() => updateStep(repair.id, "prev")}
                          >
                            <Undo2 size={14} />
                            Undo
                          </button>
                        )}

                        {repair.step < steps.length - 1 && (
                          <button
                            className="btn btn-xs sm:btn-sm btn-success text-white"
                            onClick={() => updateStep(repair.id, "next")}
                          >
                            <ArrowRightCircle size={14} />
                            Proceed
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                      {/* DETAILS */}
                      <div className="text-base-content/70 mt-3 text-xs sm:text-sm">
                        {repair.type !== "external" ? (
                          <div className="space-y-2">
                            {/* Personnel 1 */}
                            <div className="flex items-center gap-2">
                              <User size={14} className="" />
                              <div className="min-w-0">
                                <div className="truncate text-xs text-gray-500">
                                  Personnel 1
                                </div>
                                <div className="truncate text-sm font-bold">
                                  {repair.assigned_personnel_1 || "—"}
                                </div>
                              </div>
                            </div>
                            {/* Personnel 2 */}
                            <div className="flex items-center gap-2">
                              <Users size={14} className="" />
                              <div className="min-w-0">
                                <div className="truncate text-xs text-gray-500">
                                  Personnel 2
                                </div>
                                <div className="truncate text-sm font-bold">
                                  {repair.assigned_personnel_2 || "—"}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <Store size={14} className="" />

                            <div className="min-w-0">
                              <div className="text-base-content/60 text-xs">
                                Service Shop
                              </div>

                              <div className="truncate text-sm font-medium">
                                {repair.service_shop || "—"}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* TIMELINE */}
                      <div className="p-2">
                        <ul className="steps sm:steps-horizontal steps-vertical w-full overflow-x-auto">
                          {steps.map((label, i) => {
                            const active = i <= repair.step;
                            return (
                              <li
                                key={i}
                                className={`step text-xs font-bold ${
                                  active ? "step-success text-success " : ""
                                }`}
                              >
                                {label}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
