import { CirclePlus, FolderClock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

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

  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [maintenance1, setMaintenance1] = useState("");
  const [maintenance2, setMaintenance2] = useState("");
  const [serviceShop, setServiceShop] = useState("");
  const [type, setType] = useState("");

  const navigate = useNavigate();

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

    if (error) {
      console.error("Vehicles error:", error);
      return;
    }

    setVehicles(data || []);
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

    if (error) {
      console.error("Records error:", error);
      return;
    }

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

  async function createMaintenanceRecord() {
    if (!selectedVehicleId || !type) {
      alert("Please complete required fields");
      return;
    }

    if (
      (type === "internal" || type === "internal-mini") &&
      (!maintenance1 || !maintenance2)
    ) {
      alert("2 personnel required");
      return;
    }

    if (type === "external" && !serviceShop) {
      alert("Service shop required");
      return;
    }

    const payload = {
      vehicle_id: selectedVehicleId,
      type,
      current_step: 0,

      assigned_personnel_1: type === "external" ? null : maintenance1,

      assigned_personnel_2: type === "external" ? null : maintenance2,

      service_shop: type === "external" ? serviceShop : null,
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
      console.error("Insert error:", error);
      alert("Failed to save record");
      return;
    }

    setRepairs((prev) => [
      {
        ...data,
        step: data.current_step ?? 0,
      },
      ...prev,
    ]);

    setSelectedVehicleId("");
    setMaintenance1("");
    setMaintenance2("");
    setServiceShop("");
    setType("");

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
      console.error("Update step error:", error);
      alert("Failed to update step");
      return;
    }

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
          <h1 className="flex items-center gap-2 text-lg font-bold">
            Repair & Maintenance
          </h1>
          <p className="text-sm text-gray-500">
            Manage and monitor vehicle repair progress
          </p>
        </div>

        <div className="flex gap-2">
          <select
            className="select text-green-700 sm:min-w-55"
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
          >
            <option value="internal">Internal</option>
            <option value="external">External</option>
            <option value="internal-mini">Internal (Mini Repair)</option>
          </select>

          <button
            className="btn btn-info flex items-center gap-2 text-white"
            onClick={() => navigate("/tracking-history")}
          >
            <FolderClock className="size-4" />
            Tracking History
          </button>

          <button
            className="btn btn-success flex items-center gap-2 text-white"
            onClick={() => document.getElementById("trackingModal").showModal()}
          >
            <CirclePlus className="size-4" />
            Add Repair
          </button>
        </div>
      </div>

      {/* MODAL */}
      <dialog id="trackingModal" className="modal">
        <div className="modal-box rounded-xl p-8">
          <h1 className="mb-4 text-2xl font-bold tracking-wide uppercase">
            Add New Repair
          </h1>

          <button
            className="btn btn-circle btn-ghost absolute top-3 right-3"
            onClick={() => document.getElementById("trackingModal").close()}
          >
            ✕
          </button>

          <div className="space-y-5">
            <select
              className="select select-bordered w-full"
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
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
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select type</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
              <option value="internal-mini">Internal (Mini Repair)</option>
            </select>

            {type === "external" && (
              <input
                type="text"
                placeholder="Service Shop"
                className="input input-bordered w-full"
                value={serviceShop}
                onChange={(e) => setServiceShop(e.target.value)}
              />
            )}

            {type !== "external" && (
              <>
                <select
                  className="select select-bordered w-full"
                  value={maintenance1}
                  onChange={(e) => setMaintenance1(e.target.value)}
                >
                  <option value="">Select Maintenance 1</option>
                  <option value="Fernando L. Aquino">Fernando L. Aquino</option>
                  <option value="Joseph Neil S. Leonardo">
                    Joseph Neil S. Leonardo
                  </option>
                  <option value="Ruel V. Bebanco">Ruel V. Bebanco</option>
                  <option value="None">None</option>
                </select>

                <select
                  className="select select-bordered w-full"
                  value={maintenance2}
                  onChange={(e) => setMaintenance2(e.target.value)}
                >
                  <option value="">Select Maintenance 2</option>
                  <option value="Fernando L. Aquino">Fernando L. Aquino</option>
                  <option value="Joseph Neil S. Leonardo">
                    Joseph Neil S. Leonardo
                  </option>
                  <option value="Ruel V. Bebanco">Ruel V. Bebanco</option>
                  <option value="None">None</option>
                </select>
              </>
            )}

            <button
              className="btn btn-lg w-full rounded-lg bg-green-600 tracking-wider text-white uppercase hover:bg-green-500"
              onClick={createMaintenanceRecord}
            >
              Save
            </button>
          </div>
        </div>
      </dialog>

      {/* LIST */}
      <div className="space-y-4">
        {repairs
          .filter((repair) => repair.type === viewType)
          .map((repair) => {
            const steps = getSteps(repair.type);

            const personnel = [
              repair.assigned_personnel_1,
              repair.assigned_personnel_2,
            ].filter(Boolean);

            return (
              <div
                key={repair.id}
                className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-green-600"
              >
                <div className="mb-5 flex items-center gap-2">
                  <h2 className="text-lg font-semibold">
                    {repair.vehicles?.name}
                  </h2>

                  <div className="badge badge-primary badge-dash">
                    {repair.vehicles?.plate_number}
                  </div>
                </div>

                {/* TIMELINE */}
                <div className="relative flex justify-between">
                  <ul className="steps w-full">
                    {steps.map((label, index) => {
                      const isActive = index <= repair.step;
                      const isCurrent = index === repair.step;

                      return (
                        <li
                          key={index}
                          className={`step ${isActive ? "step-success" : ""}`}
                        >
                          <div className="flex flex-col items-center">
                            <span>{label}</span>

                            {isCurrent && (
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
                </div>

                {/* DETAILS */}
                <div className="mt-15 text-sm">
                  {repair.type === "external" ? (
                    <>
                      <p className="font-semibold">Service Shop:</p>
                      <p className="text-gray-600">
                        {repair.service_shop || "N/A"}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold">Personnel:</p>

                      <ul className="mt-1 list-disc pl-5">
                        {personnel.length > 0 ? (
                          personnel.map((p, i) => <li key={i}>{p}</li>)
                        ) : (
                          <li className="text-gray-400">
                            No personnel assigned
                          </li>
                        )}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
}
