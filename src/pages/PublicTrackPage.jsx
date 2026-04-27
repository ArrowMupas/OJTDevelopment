import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OurInput from "../components/OurInput";
import { repairSchema } from "../schemas/repairSchema";
import toast from "react-hot-toast";

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
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("name", { ascending: true });

    if (!error) setVehicles(data || []);
  }

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
      .order("created_at", { ascending: false });

    if (error) return;

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

    const { error } = await supabase
      .from("maintenance_records")
      .update({ current_step: newStep })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update step");
      return;
    }

    toast.success("Step updated successfully", {
      position: "bottom-right",
    });
    setRepairs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, step: newStep } : r)),
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold uppercase">Repair & Maintenance</h1>
          <p className="mt-2 text-gray-600">
            Manage and monitor vehicle repair progress
          </p>
        </div>

        {/* TOP BAR */}
        <div className="mb-5 flex flex-col items-center gap-4 rounded-xl bg-green-600 p-6 text-white sm:flex-row sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold uppercase">
              Repair Tracking
            </h2>
            <p className="text-sm opacity-90">
              Monitor vehicle repair progress
            </p>
          </div>

          <div className="flex gap-2">
            <button
              className="btn btn-info text-white uppercase"
              onClick={() =>
                document.getElementById("trackingModal").showModal()
              }
            >
              <CirclePlus className="size-6" />
              Add New Repair
            </button>

            <select
              className="select text-green-700"
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
            >
              <option value="internal">Internal</option>
              <option value="external">External</option>
              <option value="internal-mini">Internal (Mini Repair)</option>
            </select>
          </div>
        </div>

        {/* MODAL */}
        <dialog id="trackingModal" className="modal">
          <div className="modal-box rounded-xl p-8">
            <h1 className="mb-4 text-2xl font-bold uppercase">
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
              className="space-y-5"
            >
              {/* VEHICLE */}
              <div>
                <label className="text-sm font-bold">Vehicle</label>
                <select
                  className={`select select-bordered w-full ${
                    errors.vehicleId ? "select-error" : ""
                  }`}
                  {...register("vehicleId")}
                >
                  <option value="">Select vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.plate_number})
                    </option>
                  ))}
                </select>

                {errors.vehicleId && (
                  <p className="text-error mt-1 text-sm">
                    {errors.vehicleId.message}
                  </p>
                )}
              </div>

              {/* TYPE */}
              <div>
                <label className="text-sm font-bold">Type</label>
                <select
                  className={`select select-bordered w-full ${
                    errors.type ? "select-error" : ""
                  }`}
                  {...register("type")}
                >
                  <option value="">Select type</option>
                  <option value="internal">Internal</option>
                  <option value="external">External</option>
                  <option value="internal-mini">Internal (Mini Repair)</option>
                </select>

                {errors.type && (
                  <p className="text-error mt-1 text-sm">
                    {errors.type.message}
                  </p>
                )}
              </div>

              {/* SERVICE SHOP (external only) */}
              {selectedType === "external" && (
                <OurInput
                  label="Service Shop"
                  name="serviceShop"
                  register={register}
                  error={errors.serviceShop}
                />
              )}

              {/* INTERNAL PERSONNEL */}
              {selectedType !== "external" && selectedType && (
                <>
                  <div>
                    <label className="text-sm font-bold">Maintenance 1</label>
                    <select
                      className={`select select-bordered w-full ${
                        errors.maintenance1 ? "select-error" : ""
                      }`}
                      {...register("maintenance1")}
                    >
                      <option value="">Select Personnel</option>
                      <option value="Fernando L. Aquino">
                        Fernando L. Aquino
                      </option>
                      <option value="Joseph Neil S. Leonardo">
                        Joseph Neil S. Leonardo
                      </option>
                      <option value="Ruel V. Bebanco">Ruel V. Bebanco</option>
                      <option value="None">None</option>
                    </select>

                    {errors.maintenance1 && (
                      <p className="text-error mt-1 text-sm">
                        {errors.maintenance1.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-bold">Maintenance 2</label>
                    <select
                      className={`select select-bordered w-full ${
                        errors.maintenance2 ? "select-error" : ""
                      }`}
                      {...register("maintenance2")}
                    >
                      <option value="">Select Personnel</option>
                      <option value="Fernando L. Aquino">
                        Fernando L. Aquino
                      </option>
                      <option value="Joseph Neil S. Leonardo">
                        Joseph Neil S. Leonardo
                      </option>
                      <option value="Ruel V. Bebanco">Ruel V. Bebanco</option>
                      <option value="None">None</option>
                    </select>

                    {errors.maintenance2 && (
                      <p className="text-error mt-1 text-sm">
                        {errors.maintenance2.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              <button
                type="submit"
                className="btn btn-lg w-full bg-green-600 text-white uppercase hover:bg-green-500"
              >
                Save
              </button>
            </form>
          </div>
        </dialog>

        {/* LIST */}
        <div className="space-y-4">
          {repairs
            .filter((r) => r.type === viewType)
            .map((repair) => {
              const steps = getSteps(repair.type);

              return (
                <div key={repair.id} className="rounded-xl bg-white p-8 shadow">
                  {/* HEADER */}
                  <div className="mb-4 flex items-center gap-2">
                    <h2 className="font-semibold">{repair.vehicles?.name}</h2>

                    <span className="badge badge-primary">
                      {repair.vehicles?.plate_number}
                    </span>
                  </div>

                  {/* TIMELINE */}
                  <ul className="steps w-full">
                    {steps.map((label, i) => {
                      const active = i <= repair.step;
                      const current = i === repair.step;

                      return (
                        <li
                          key={i}
                          className={`step ${active ? "step-success" : ""}`}
                        >
                          <div className="flex flex-col items-center">
                            <span>{label}</span>

                            {current && (
                              <div className="mt-2 flex gap-2">
                                {repair.step > 0 && (
                                  <button
                                    className="btn btn-xs"
                                    onClick={() =>
                                      updateStep(repair.id, "prev")
                                    }
                                  >
                                    Undo
                                  </button>
                                )}

                                {repair.step < steps.length - 1 && (
                                  <button
                                    className="btn btn-xs btn-success"
                                    onClick={() =>
                                      updateStep(repair.id, "next")
                                    }
                                  >
                                    Proceed
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* DETAILS */}
                  <div className="mt-6 text-sm">
                    {repair.type === "external" ? (
                      <div>
                        <p className="font-semibold">Service Shop:</p>
                        <p className="text-gray-600">
                          {repair.service_shop || "N/A"}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold">Personnel:</p>

                        <ul className="mt-1 list-disc pl-5 text-gray-700">
                          {repair.assigned_personnel_1 ||
                          repair.assigned_personnel_2 ? (
                            <>
                              {repair.assigned_personnel_1 && (
                                <li>{repair.assigned_personnel_1}</li>
                              )}
                              {repair.assigned_personnel_2 && (
                                <li>{repair.assigned_personnel_2}</li>
                              )}
                            </>
                          ) : (
                            <li className="text-gray-400">
                              No personnel assigned
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
