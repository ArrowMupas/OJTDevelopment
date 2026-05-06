import {
  CirclePlus,
  FolderClock,
  Car,
  Tag,
  User,
  Users,
  Store,
  Undo2,
  ArrowRightCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OurInput from "../../components/OurInput";
import { repairSchema } from "../../schemas/repairSchema";
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

  const navigate = useNavigate();

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

    if (!error) {
      setVehicles(data || []);
    }
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

    if (!error) {
      const normalized = (data || []).map((item) => ({
        ...item,
        step: item.current_step ?? 0,
      }));

      setRepairs(normalized);
    }
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

    setRepairs((prev) => [
      {
        ...data,
        step: data.current_step ?? 0,
      },
      ...prev,
    ]);

    reset();
    toast.success("Record created successfully");
    document.getElementById("trackingModal").close();
  }

  async function updateStep(id, action) {
    const target = repairs.find((repair) => repair.id === id);
    if (!target) return;

    const steps = getSteps(target.type);

    let newStep = target.step;

    if (action === "next" && target.step < steps.length - 1) {
      newStep++;
    }

    if (action === "prev" && target.step > 0) {
      newStep--;
    }

    const { error } = await supabase
      .from("maintenance_records")
      .update({
        current_step: newStep,
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update step");
      return;
    }

    toast.success("Step updated successfully");
    setRepairs((prev) =>
      prev.map((repair) =>
        repair.id === id ? { ...repair, step: newStep } : repair,
      ),
    );
  }

  return (
    <main className="min-h-screen space-y-7 px-3 py-4 pb-25 sm:px-5">
      <div className="flex justify-between">
        <div>
          <h1 className="text-lg font-bold">Repair & Maintenance</h1>
          <p className="text-sm text-gray-500">
            Manage and monitor vehicle repair progress
          </p>
        </div>

        <div className="flex gap-2">
          <select
            className="select select-neutral"
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
          >
            <option value="internal">Internal</option>
            <option value="external">External</option>
            <option value="internal-mini">Internal (Mini Repair)</option>
          </select>

          <button
            className="btn btn-info text-white"
            onClick={() => navigate("/tracking-history")}
          >
            <FolderClock className="size-4" />
            Tracking History
          </button>

          <button
            className="btn btn-success text-white"
            onClick={() => document.getElementById("trackingModal").showModal()}
          >
            <CirclePlus className="size-4" />
            Add Repair
          </button>
        </div>
      </div>

      {/* MODAL */}
      <dialog id="trackingModal" className="modal">
        <div className="modal-box max-w-md rounded-xl p-8">
          <h1 className="text-xl font-bold">Add New Repair</h1>
          <p className="text-sm text-gray-500">
            Fill in the details to add a new repair record
          </p>

          <button
            className="btn btn-circle btn-ghost absolute top-3 right-3"
            onClick={() => document.getElementById("trackingModal").close()}
          >
            ✕
          </button>

          <form
            onSubmit={handleSubmit(createMaintenanceRecord)}
            className="mt-4 space-y-7"
          >
            {/* VEHICLE */}
            <div>
              <label className="text-sm font-bold">Vehicle</label>
              <select
                className={`select select-bordered w-full ${
                  errors.vehicleId ? "select-error" : ""
                }`}
                defaultValue=""
                {...register("vehicleId")}
              >
                <option value="" disabled>
                  Select vehicle
                </option>

                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.plate_number})
                  </option>
                ))}
              </select>

              {errors.vehicleId && (
                <span className="text-error text-sm">
                  {errors.vehicleId.message}
                </span>
              )}
            </div>

            {/* TYPE */}
            <div>
              <label className="text-sm font-bold">Repair Type</label>
              <select
                className={`select select-bordered w-full ${
                  errors.type ? "select-error" : ""
                }`}
                defaultValue=""
                {...register("type")}
              >
                <option value="" disabled>
                  Select type
                </option>
                <option value="internal">Internal</option>
                <option value="external">External</option>
                <option value="internal-mini">Internal (Mini Repair)</option>
              </select>

              {errors.type && (
                <span className="text-error text-sm">
                  {errors.type.message}
                </span>
              )}
            </div>

            {/* EXTERNAL */}
            {selectedType === "external" && (
              <OurInput
                label="Service Shop"
                name="serviceShop"
                register={register}
                error={errors.serviceShop}
              />
            )}

            {/* INTERNAL */}
            {selectedType !== "external" && selectedType && (
              <>
                <div>
                  <label className="text-sm font-bold">
                    Maintenance Personnel 1
                  </label>
                  <select
                    className={`select select-bordered w-full ${
                      errors.maintenance1 ? "select-error" : ""
                    }`}
                    defaultValue=""
                    {...register("maintenance1")}
                  >
                    <option value="" disabled>
                      Select Personnel
                    </option>
                    <option value="Fernando L. Aquino">
                      Fernando L. Aquino
                    </option>
                    <option value="Joseph Neil S. Leonardo">
                      Joseph Neil S. Leonardo
                    </option>
                    <option value="Ruel V. Bebanco">Ruel V. Bebanco</option>
                    <option value="None">None</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold">
                    Maintenance Personnel 2
                  </label>
                  <select
                    className={`select select-bordered w-full ${
                      errors.maintenance2 ? "select-error" : ""
                    }`}
                    defaultValue=""
                    {...register("maintenance2")}
                  >
                    <option value="" disabled>
                      Select Personnel
                    </option>
                    <option value="Fernando L. Aquino">
                      Fernando L. Aquino
                    </option>
                    <option value="Joseph Neil S. Leonardo">
                      Joseph Neil S. Leonardo
                    </option>
                    <option value="Ruel V. Bebanco">Ruel V. Bebanco</option>
                    <option value="None">None</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-lg w-full rounded-lg bg-green-600 text-white uppercase hover:bg-green-500"
            >
              Save
            </button>
          </form>
        </div>
      </dialog>

      {/* LIST - Redesigned with first page's style */}
      <div className="space-y-4">
        {repairs
          .filter((repair) => repair.type === viewType)
          .map((repair) => {
            const steps = getSteps(repair.type);

            return (
              <div
                key={repair.id}
                className="overflow-hidden rounded-2xl bg-white p-4 shadow-md sm:p-6"
              >
                {/* HEADER with vehicle info and action buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3">
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
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-2">
                    {repair.step > 0 && (
                      <button
                        className="btn btn-xs sm:btn-sm flex items-center gap-1"
                        onClick={() => updateStep(repair.id, "prev")}
                      >
                        <Undo2 size={14} />
                        Undo
                      </button>
                    )}

                    {repair.step < steps.length - 1 && (
                      <button
                        className="btn btn-xs btn-success sm:btn-sm flex items-center gap-1"
                        onClick={() => updateStep(repair.id, "next")}
                      >
                        <ArrowRightCircle size={14} />
                        Proceed
                      </button>
                    )}
                  </div>
                </div>

                {/* DETAILS SECTION */}
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

                {/* TIMELINE */}
                <div className="mt-5 overflow-x-auto">
                  <ul className="steps steps-horizontal">
                    {steps.map((label, i) => {
                      const active = i <= repair.step;

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
    </main>
  );
}
