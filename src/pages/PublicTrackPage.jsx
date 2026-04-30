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
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-8 text-center sm:mb-12">
          <h1 className="text-3xl font-bold uppercase sm:text-5xl">
            Repair & Maintenance
          </h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Manage and monitor vehicle repair progress
          </p>
        </div>

        {/* TOP BAR */}
        <div className="mb-5 flex flex-col gap-4 rounded-xl bg-green-600 p-4 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-lg font-semibold uppercase sm:text-2xl">
              Repair Tracking
            </h2>
            <p className="text-xs opacity-90 sm:text-sm">
              Monitor vehicle repair progress
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              className="btn btn-info w-full text-white uppercase sm:w-auto"
              onClick={() =>
                document.getElementById("trackingModal").showModal()
              }
            >
              <CirclePlus className="size-5 sm:size-6" />
              Add Repair
            </button>

            <select
              className="select w-full text-green-700 sm:w-auto"
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
          <div className="modal-box w-11/12 max-w-lg rounded-xl p-5 sm:p-8">
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

        {/* LIST */}
        <div className="space-y-3 sm:space-y-4">
          {repairs
            .filter((r) => r.type === viewType)
            .map((repair) => {
              const steps = getSteps(repair.type);

              return (
                <div
                  key={repair.id}
                  className="rounded-xl bg-white p-3 shadow sm:p-8"
                >
                  {/* HEADER */}
                  <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-semibold sm:text-base">
                        {repair.vehicles?.name}
                      </h2>

                      <span className="badge badge-primary text-xs">
                        {repair.vehicles?.plate_number}
                      </span>
                    </div>

                    {/* MOBILE BUTTONS */}
                    <div className="flex gap-2 sm:hidden">
                      {repair.step > 0 && (
                        <button
                          className="btn btn-xs"
                          onClick={() => updateStep(repair.id, "prev")}
                        >
                          Undo
                        </button>
                      )}

                      {repair.step < steps.length - 1 && (
                        <button
                          className="btn btn-xs btn-success"
                          onClick={() => updateStep(repair.id, "next")}
                        >
                          Proceed
                        </button>
                      )}
                    </div>
                  </div>

                  {/* TIMELINE */}
                  <div className="overflow-hidden sm:overflow-x-auto">
                    <ul className="steps w-full min-w-0 sm:min-w-[600px]">
                      {steps.map((label, i) => {
                        const active = i <= repair.step;

                        return (
                          <li
                            key={i}
                            className={`step ${active ? "step-success" : ""}`}
                          >
                            {/* SMALLER FONT ON MOBILE */}
                            <div className="text-center text-[9px] leading-tight sm:text-sm">
                              {label}
                            </div>
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
