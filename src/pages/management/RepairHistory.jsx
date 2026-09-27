import {
  ArrowLeft,
  ClockCheck,
  FileArchive,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";
import { exportRepairHistory } from "../../utils/exportRepairHistory";

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
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [mechanics, setMechanics] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    startDate: "",
    endDate: "",
    mechanic: "",
    vehicle: "",
  });

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editCompletedDateModalOpen, setEditCompletedDateModalOpen] =
    useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [selectedStep, setSelectedStep] = useState(0);

  // PAGINATION
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 10;
  const navigate = useNavigate();
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    setPage(1);
  };

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
        `${mechanic.first_name} ${mechanic.middle_initial ? mechanic.middle_initial + ". " : ""}${mechanic.last_name}`.trim(),
    }));

    setMechanics(formattedMechanics || []);
  }

  async function fetchVehicles() {
    const { data, error } = await supabase
      .from("vehicles")
      .select("id, name, plate_number")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching vehicles:", error);
      return;
    }

    setVehicles(data || []);
  }

  async function updateRepairStep(id, newStepIndex) {
    const target = repairs.find((r) => r.id === id);
    if (!target) return;

    const steps = getSteps(target.type);

    // Validate step index
    if (newStepIndex < 0 || newStepIndex >= steps.length) {
      toast.error("Invalid step");
      return;
    }

    // If moving to last step (accomplished), set completed_at
    const isAccomplished = newStepIndex === steps.length - 1;
    const updateData = { current_step: newStepIndex };

    if (isAccomplished && !target.completed_at) {
      updateData.completed_at = new Date().toISOString();
    } else if (!isAccomplished && target.completed_at) {
      // If moving back from accomplished, remove completed_at
      updateData.completed_at = null;
    }

    const { error } = await supabase
      .from("maintenance_records")
      .update(updateData)
      .eq("id", id);

    if (error) {
      toast.error("Failed to update step");
      return;
    }

    await fetchRecords(
      filters.search,
      filters.type,
      filters.startDate,
      filters.endDate,
      page,
      filters.mechanic,
      filters.vehicle,
    );

    toast.success(
      `${target.vehicles?.name} (${target.vehicles?.plate_number}) - Step updated`,
    );

    setEditModalOpen(false);
    setSelectedRepair(null);
    setSelectedStep(0);
  }

  async function updateCompletedAt(id, completedAt) {
    const { error } = await supabase
      .from("maintenance_records")
      .update({ completed_at: completedAt })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update completed date");
      return;
    }

    // update local state
    setRepairs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed_at: completedAt } : r)),
    );

    toast.success("Completed date updated successfully");

    setEditCompletedDateModalOpen(false);
    setSelectedRepair(null);
  }

  // Delete repair record
  async function deleteRepair(id) {
    const { error } = await supabase
      .from("maintenance_records")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete record");
      return;
    }

    // Remove from local state
    setRepairs((prev) => prev.filter((r) => r.id !== id));
    toast.success("Record deleted successfully");
    setDeleteModalOpen(false);
    setSelectedRepair(null);
  }

  async function fetchRecords({
    searchTerm = "",
    type = "all",
    start = "",
    end = "",
    pageNum = 1,
    mechanicId = "",
    vehicleId = "",
  }) {
    setLoading(true);

    const from = (pageNum - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("maintenance_records")
      .select(
        `
      *,
      vehicles (
        name,
        plate_number
      )
    `,
        { count: "exact" },
      )
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false });

    // TYPE FILTER
    if (type !== "all") {
      query = query.eq("type", type);
    }

    // SEARCH
    if (searchTerm) {
      query = query.or(`service_shop.ilike.%${searchTerm}%`);
    }

    // MECHANIC FILTER
    if (mechanicId) {
      const selectedMechanicData = mechanics.find(
        (m) => m.id.toString() === mechanicId,
      );

      if (selectedMechanicData) {
        const mechanicFullName = selectedMechanicData.full_name;

        query = query.or(
          `assigned_personnel_1.eq.${mechanicFullName},assigned_personnel_2.eq.${mechanicFullName}`,
        );
      }
    }

    if (vehicleId) {
      query = query.eq("vehicle_id", vehicleId);
    }

    // DATE FILTER
    if (start) {
      query = query.gte("completed_at", start);
    }

    if (end) {
      query = query.lte("completed_at", end);
    }

    // PAGINATION
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    let normalized = (data || []).map((item) => ({
      ...item,
      step: item.current_step ?? 0,
    }));

    setRepairs(normalized);
    setTotalCount(count || 0);
    setLoading(false);
  }

  useEffect(() => {
    fetchMechanics();
    fetchVehicles();
  }, []);

  useEffect(() => {
    fetchRecords({
      searchTerm: filters.search,
      type: filters.type,
      start: filters.startDate,
      end: filters.endDate,
      pageNum: page,
      mechanicId: filters.mechanic,
      vehicleId: filters.vehicle,
    });
  }, [filters, page]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value, type, start, end, mechanic) => {
        setPage(1);
        fetchRecords(value, type, start, end, 1, mechanic);
      }, 400),
    [],
  );

  async function handleExport() {
    setExporting(true);

    try {
      await exportRepairHistory({
        supabase,
        search: filters.search,
        filterType: filters.type,
        startDate: filters.startDate,
        endDate: filters.endDate,
        selectedMechanic: filters.mechanic,
        mechanics,
        selectedVehicle: filters.vehicle,
        vehicles,
        toast,
      });
    } finally {
      setExporting(false);
    }
  }

  const handleClearFilters = () => {
    setFilters({
      search: "",
      type: "all",
      startDate: "",
      endDate: "",
      mechanic: "",
      vehicle: "",
    });

    setPage(1);
  };

  const openEditModal = (repair) => {
    setSelectedRepair(repair);
    setSelectedStep(repair.step);
    setEditModalOpen(true);
  };

  const openCompletedDateModal = (repair) => {
    setEditCompletedDateModalOpen(true);
    setSelectedRepair(repair);
  };

  const openDeleteModal = (repair) => {
    setSelectedRepair(repair);
    setDeleteModalOpen(true);
  };

  return (
    <main className="min-h-screen space-y-7 px-3 py-4 pb-25 sm:px-5">
      {/* HEADER */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
              View completed repair records
            </p>
          </div>
        </div>

        <button
          className="btn btn-secondary"
          onClick={handleExport}
          disabled={exporting}
        >
          <FileArchive className="h-4 w-4" />
          {exporting ? "Exporting..." : "Generate Report"}
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 lg:flex-row">
          {/* SEARCH */}
          <label className="input input-bordered min-w-60">
            <Search className="size-4 opacity-60" />
            <input
              type="search"
              placeholder="Search by service shop"
              value={filters.search}
              onChange={(e) => {
                const value = e.target.value;

                setFilters((prev) => ({
                  ...prev,
                  search: value,
                }));

                setPage(1);
                debouncedSearch(
                  value,
                  filters.type,
                  filters.startDate,
                  filters.endDate,
                  filters.mechanic,
                  filters.vehicle,
                );
              }}
            />
          </label>

          {/* TYPE */}
          <select
            className="select select-bordered"
            value={filters.type}
            onChange={(e) => updateFilter("type", e.target.value)}
          >
            <option value="all">All</option>
            <option value="internal">Internal</option>
            <option value="external">External</option>
            <option value="internal-mini">Internal (Mini Repair)</option>
          </select>

          {/* MECHANIC FILTER */}
          <select
            className="select select-bordered min-w-full sm:min-w-60"
            value={filters.mechanic}
            onChange={(e) => updateFilter("mechanic", e.target.value)}
          >
            <option value="">All Mechanics</option>

            {mechanics.map((mechanic) => (
              <option key={mechanic.id} value={mechanic.id}>
                {mechanic.full_name}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered"
            value={filters.vehicle}
            onChange={(e) => updateFilter("vehicle", e.target.value)}
          >
            <option value="">All Vehicles</option>

            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name}{" "}
                {vehicle.plate_number && `- ${vehicle.plate_number}`}
              </option>
            ))}
          </select>

          {/* DATE FROM */}
          <input
            type="date"
            className="input input-bordered"
            value={filters.startDate}
            onChange={(e) => updateFilter("startDate", e.target.value)}
          />

          {/* DATE TO */}
          <input
            type="date"
            className="input input-bordered"
            value={filters.endDate}
            onChange={(e) => updateFilter("endDate", e.target.value)}
          />

          {/* CLEAR */}
          <button
            className="btn btn-error btn-soft"
            onClick={handleClearFilters}
          >
            Clear
          </button>
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : repairs.length === 0 ? (
        <div className="card bg-base-100 border shadow-sm">
          <div className="card-body items-center py-12 text-center">
            <ClockCheck className="size-14 text-gray-400" />
            <h2 className="text-lg font-semibold">
              No completed repairs found
            </h2>
            <p className="text-sm text-gray-500">
              Completed maintenance records will appear here
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:gap-3">
            {repairs.map((repair) => {
              const steps = getSteps(repair.type);

              return (
                <div
                  key={repair.id}
                  className="card bg-base-100 hover:ring-success rounded-xl border border-gray-300 shadow-sm hover:bg-green-50 hover:ring-1"
                >
                  <div className="card-body p-4 sm:p-5">
                    {/* HEADER */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-base font-semibold sm:text-lg">
                          {repair.vehicles?.name}
                        </h2>

                        <div className="badge badge-primary badge-dash truncate">
                          {repair.vehicles?.plate_number}
                        </div>

                        <div
                          className={`badge badge-soft uppercase ${
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

                      <div className="flex gap-1">
                        <button
                          className="btn btn-info btn-square btn-outline"
                          onClick={() => openEditModal(repair)}
                          title="Edit step"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-error btn-square btn-outline"
                          onClick={() => openDeleteModal(repair)}
                          title="Delete record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* REMARKS */}
                    <div>
                      <div className="text-xs text-gray-500">Remarks</div>
                      <p className="text-xs">{repair?.remarks || "—"}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div>
                        <div className="text-xs text-gray-500">
                          Completed Date
                        </div>
                        <p className="text-xs">
                          {repair?.completed_at
                            ? format(
                                new Date(repair.completed_at),
                                "MMM dd, yyyy",
                              )
                            : "—"}
                        </p>
                      </div>

                      <button
                        className="btn btn-sm btn-square btn-info btn-outline"
                        onClick={() => openCompletedDateModal(repair)}
                        title="Edit Completed Date"
                      >
                        <Edit size={14} />
                      </button>
                    </div>

                    {/* TIMELINE */}
                    <div className="mt-5 hidden sm:block">
                      <ul className="steps steps-vertical sm:steps-horizontal w-full overflow-x-clip">
                        {steps.map((label, i) => (
                          <li
                            key={i}
                            className={`step text-xs font-bold ${
                              repair.type === "external"
                                ? "step-warning"
                                : repair.type === "internal-mini"
                                  ? "step-info"
                                  : "step-primary"
                            }`}
                          >
                            {label}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* DETAILS */}
                    <div className="text-base-content space-y-2 text-xs sm:text-sm">
                      {repair.type !== "external" ? (
                        <div className="space-y-2">
                          <div>
                            <div className="truncate text-xs text-gray-500">
                              Personnel 1
                            </div>
                            <div className="truncate text-xs font-bold sm:text-sm">
                              {repair.assigned_personnel_1 || "—"}
                            </div>
                          </div>

                          <div>
                            <div className="truncate text-xs text-gray-500">
                              Personnel 2
                            </div>
                            <div className="truncate text-xs font-bold sm:text-sm">
                              {repair.assigned_personnel_2 || "—"}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-xs text-gray-500">
                            Service Shop
                          </div>
                          <div className="truncate text-sm font-medium">
                            {repair.service_shop || "—"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAGINATION */}
          <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-gray-500">Total Records: {totalCount}</p>

            <div className="join">
              <button
                className="join-item btn btn-sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                «
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, page - 3), page + 2)
                .map((p) => (
                  <button
                    key={p}
                    className={`join-item btn btn-sm ${
                      p === page ? "btn-active" : ""
                    }`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}

              <button
                className="join-item btn btn-sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                »
              </button>
            </div>
          </div>
        </>
      )}

      {editModalOpen && selectedRepair && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Update Repair Step</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedRepair.vehicles?.name} (
              {selectedRepair.vehicles?.plate_number})
            </p>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Select Step</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedStep}
                onChange={(e) => setSelectedStep(parseInt(e.target.value))}
              >
                {getSteps(selectedRepair.type).map((step, index) => (
                  <option key={index} value={index}>
                    {index + 1}. {step}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedRepair(null);
                  setSelectedStep(0);
                }}
              >
                Cancel
              </button>
              <button
                className="btn admin-btn"
                onClick={() =>
                  updateRepairStep(selectedRepair.id, selectedStep)
                }
              >
                Update Step
              </button>
            </div>
          </div>
        </dialog>
      )}

      {editCompletedDateModalOpen && selectedRepair && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Update Completed Date</h3>
            <p className="mt-1 text-sm text-gray-500">
              Set the completed date for this repair record.
            </p>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Select Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={selectedRepair?.completed_at?.split("T")[0] || ""}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setSelectedRepair((prev) => ({
                    ...prev,
                    completed_at: newDate
                      ? new Date(newDate).toISOString()
                      : null,
                  }));
                }}
              />
            </div>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => {
                  setEditCompletedDateModalOpen(false);
                  setSelectedRepair(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn admin-btn"
                onClick={() =>
                  updateCompletedAt(
                    selectedRepair.id,
                    selectedRepair.completed_at,
                  )
                }
              >
                Update Completed Date
              </button>
            </div>
          </div>
        </dialog>
      )}

      {deleteModalOpen && selectedRepair && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Confirm Deletion</h3>
            <p className="py-4">
              Are you sure you want to delete the repair record for{" "}
              <span className="font-bold">{selectedRepair.vehicles?.name}</span>
              ?
              <br />
              This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setSelectedRepair(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-error text-white"
                onClick={() => deleteRepair(selectedRepair.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </dialog>
      )}
    </main>
  );
}
