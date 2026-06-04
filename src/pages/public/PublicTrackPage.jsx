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
  History,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OurInput from "../../components/OurInput";
import { repairSchema } from "../../schemas/repairSchema";
import toast from "react-hot-toast";
import { format } from "date-fns";
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
  const [mechanics, setMechanics] = useState([]);
  const [remarksModal, setRemarksModal] = useState(false);
  const [pendingRepair, setPendingRepair] = useState(null);
  const [remarks, setRemarks] = useState("");

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

  async function fetchMechanics() {
    const { data } = await supabase
      .from("drivers")
      .select("*")
      .eq("is_mechanic", true)
      .eq("is_deleted", false)
      .order("last_name", { ascending: true });

    const formattedMechanics = (data || []).map((mechanic) => ({
      ...mechanic,
      full_name:
        `${mechanic.first_name} ${mechanic.middle_initial}. ${mechanic.last_name}`.trim(),
    }));

    setMechanics(formattedMechanics || []);
  }

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
    fetchMechanics();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      fetchRecords();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
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

    if (action === "next" && target.step === 0) {
      setPendingRepair({ id, steps });
      setRemarksModal(true);
      return;
    }

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

  async function confirmRemarks() {
    if (!pendingRepair) return;

    const newStep = 1;

    const { error } = await supabase
      .from("maintenance_records")
      .update({
        current_step: newStep,
        remarks: remarks,
      })
      .eq("id", pendingRepair.id);

    if (error) {
      toast.error("Failed to save remarks");
      return;
    }

    setRepairs((prev) =>
      prev.map((r) =>
        r.id === pendingRepair.id ? { ...r, step: newStep, remarks } : r,
      ),
    );

    setRemarks("");
    setPendingRepair(null);
    setRemarksModal(false);

    toast.success("Moved from Inspection with remarks saved");
  }

  return (
    <main className="min-h-screen px-3 py-10 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        {/* HEADER */}
        <div className="mb-5 flex justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold uppercase sm:text-5xl">Repair</h1>
            <p className="text-sm sm:text-base">
              Manage and monitor vehicle repair progress
            </p>
          </div>
        </div>

        {/* TOP BAR */}
        <div className="mb-5 flex flex-row justify-between">
          <div className="flex w-full justify-between gap-2 sm:w-auto sm:items-center">
            <Link to="/repairs/completed">
              <button className="btn btn-info btn-sm sm:btn-md truncate text-white uppercase">
                <History className="size-5" />
              </button>
            </Link>

            <button
              className="btn btn-accent btn-sm sm:btn-md text-white uppercase"
              onClick={() =>
                document.getElementById("trackingModal").showModal()
              }
            >
              <CirclePlus className="size-5 sm:size-6" />
              Add Repair
            </button>

            <label htmlFor="" className="select select-sm sm:select-md">
              <span className="label">Type</span>
              <select
                className="select select-sm sm:select-md text-green-700"
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
              >
                <option value="internal">Internal</option>
                <option value="external">External</option>
                <option value="internal-mini">Mini Repair</option>
              </select>
            </label>
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
                    <option value="">Select Mechanic 1</option>
                    {mechanics.map((mechanic) => (
                      <option key={mechanic.id} value={mechanic.full_name}>
                        {mechanic.full_name}
                      </option>
                    ))}
                    <option value="None">None</option>
                  </select>

                  <select
                    className="select select-bordered w-full"
                    {...register("maintenance2")}
                  >
                    <option value="">Select Mechanic 2</option>
                    {mechanics.map((mechanic) => (
                      <option key={mechanic.id} value={mechanic.full_name}>
                        {mechanic.full_name}
                      </option>
                    ))}
                    <option value="None">None</option>
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

              const isRecentlyUpdated = () => {
                if (!repair.last_updated_at) return false;
                const updated = new Date(repair.last_updated_at);
                const now = new Date();
                const diffSeconds = (now - updated) / 1000;
                return diffSeconds < 120;
              };

              const recentlyUpdated = isRecentlyUpdated();

              return (
                <div
                  key={repair.id}
                  className={`card bg-base-100 rounded-xl border shadow-sm transition-all duration-300 ${
                    recentlyUpdated ? "border-info bg-info/5 " : ""
                  }`}
                >
                  <div className="card-body relative p-4 sm:p-5">
                    {recentlyUpdated && (
                      <div className="absolute top-0 right-0 z-10">
                        <div className="badge badge-info badge-sm badge-soft">
                          Recently Updated
                        </div>
                      </div>
                    )}

                    {/* HEADER */}
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <h2 className="flex items-center gap-2 truncate text-base font-semibold sm:text-lg">
                          {repair.vehicles?.name}
                        </h2>
                        <div className="badge badge-primary badge-dash badge-sm truncate">
                          {repair.vehicles?.plate_number}
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex flex-row gap-2">
                        {repair.step > 0 && (
                          <button
                            className="btn btn-sm btn-error btn-square text-white"
                            onClick={() => updateStep(repair.id, "prev")}
                          >
                            <Undo2 size={14} />
                          </button>
                        )}

                        {repair.step < steps.length - 1 && (
                          <button
                            className="btn btn-sm btn-success btn-square text-white"
                            onClick={() => updateStep(repair.id, "next")}
                          >
                            <ArrowRightCircle size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-gray-500">Remarks</div>
                        <p className="text-xs">{repair?.remarks || "-"}</p>
                      </div>
                      {repair.last_updated_at && (
                        <div className="shrink-0 text-right">
                          <div className="text-xs text-gray-400">
                            Updated:{" "}
                            {format(new Date(repair.last_updated_at), "HH:mm")}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="my-5 flex flex-col gap-2">
                        <ul className="steps steps-vertical sm:steps-horizontal w-full overflow-x-clip">
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

                      {/* DETAILS */}
                      <div className="text-base-content space-y-2 text-xs sm:text-sm">
                        {repair.type !== "external" ? (
                          <div className="space-y-2">
                            {/* Personnel 1 */}
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
                            {/* Personnel 2 */}
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
                            <Store size={14} className="" />

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
                </div>
              );
            })}
        </div>
      </div>

      <dialog open={remarksModal} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Inspection Remarks</h3>

          <textarea
            className="textarea textarea-bordered mt-3 w-full"
            placeholder="Enter inspection remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <div className="modal-action">
            <button
              className="btn"
              onClick={() => {
                setRemarksModal(false);
                setRemarks("");
                setPendingRepair(null);
              }}
            >
              Cancel
            </button>

            <button
              className="btn btn-success text-white"
              onClick={confirmRemarks}
            >
              Save & Continue
            </button>
          </div>
        </div>
      </dialog>
    </main>
  );
}
