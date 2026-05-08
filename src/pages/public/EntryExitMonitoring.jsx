import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideFileClock, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import useDriverStore from "../../stores/driverStore";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { entryLogSchema } from "../../schemas/entryLogSchema";

export default function EntryExitPage() {
  const [vehicles, setVehicles] = useState([]);
  const { getDrivers, fetchDrivers } = useDriverStore();
  const [guards, setGuards] = useState([]);
  const [entryLog, setEntryLog] = useState([]);
  const [privateStaff, setPrivateStaff] = useState([]);
  const drivers = getDrivers("service");
  const [staffForm, setStaffForm] = useState({
    first_name: "",
    last_name: "",
  });

  const [addingStaff, setAddingStaff] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(entryLogSchema),
    defaultValues: {
      vehicleType: "government",
    },
  });

  const fetchEntryLogs = async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1); // yesterday
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from("entry_log")
      .select(
        `
      *,
      guard (
        id,
        first_name,
        last_name,
        role
      )
    `,
      )
      .gte("time", startDate.toISOString())
      .lte("time", endDate.toISOString())
      .order("time", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setEntryLog(data || []);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      await fetchEntryLogs();

      const [
        { data: vehiclesData },
        { data: guardsData },
        { data: privateStaffData },
      ] = await Promise.all([
        supabase
          .from("vehicles")
          .select("id, name, plate_number")
          .order("name", { ascending: true }),
        supabase
          .from("guard")
          .select("id, first_name, last_name, role")
          .order("last_name"),
        supabase
          .from("private_staff")
          .select("*")
          .order("last_name", { ascending: true }),
      ]);

      setVehicles(vehiclesData || []);
      setGuards(guardsData || []);
      setPrivateStaff(privateStaffData || []);

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (drivers.length === 0) {
      fetchDrivers();
    }
  }, [drivers.length, fetchDrivers]);

  const handleEntry = async (formData, logType) => {
    setIsSubmitting(true);

    try {
      if (!formData.guardId) {
        toast.error("Please select a guard");
        return;
      }

      const selectedVehicle = vehicles.find(
        (v) => String(v.id) === String(formData.vehicleId),
      );

      let selectedDriver = null;

      if (formData.driverId.startsWith("driver-")) {
        const id = formData.driverId.replace("driver-", "");

        selectedDriver = drivers.find((d) => String(d.id) === String(id));
      } else if (formData.driverId.startsWith("staff-")) {
        const id = formData.driverId.replace("staff-", "");

        selectedDriver = privateStaff.find((s) => String(s.id) === String(id));
      }

      if (!selectedVehicle || !selectedDriver) {
        toast.error("Select valid vehicle and driver");
        return;
      }

      const payload = {
        type: logType,
        vehicle_type: formData.vehicleType,
        guard_id: Number(formData.guardId),
        plate_number: selectedVehicle.plate_number,
        vehicle_name: selectedVehicle.name,
        driver_name: `${selectedDriver.first_name} ${selectedDriver.last_name}`,
      };

      const { error } = await supabase.from("entry_log").insert([payload]);

      if (error) {
        console.error(error);
        toast.error("Insert failed");
        return;
      }

      toast.success(
        logType === "time in" ? "Time In recorded!" : "Time Out recorded!",
      );

      reset({
        vehicleType: formData.vehicleType,
        guardId: Number(formData.guardId),
        vehicleId: "",
        driverId: "",
      });

      await fetchEntryLogs();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editForm, setEditForm] = useState({
    vehicleId: "",
    driverId: "",
    plate_number: "",
    vehicle_name: "",
    driver_name: "",
    type: "",
    time: "",
  });

  const openEditModal = (entry) => {
    const matchedVehicle = vehicles.find(
      (v) => v.plate_number === entry.plate_number,
    );

    let matchedDriver = null;
    let matchedDriverType = "";

    matchedDriver = drivers.find(
      (d) =>
        `${d.first_name} ${d.last_name}`.trim() ===
        (entry.driver_name || "").trim(),
    );

    if (matchedDriver) {
      matchedDriverType = "driver";
    } else {
      matchedDriver = privateStaff.find(
        (s) =>
          `${s.first_name} ${s.last_name}`.trim() ===
          (entry.driver_name || "").trim(),
      );

      if (matchedDriver) {
        matchedDriverType = "staff";
      }
    }

    setSelectedEntry(entry);

    setEditForm({
      vehicleId: matchedVehicle?.id || "",
      driverId: matchedDriver ? `${matchedDriverType}-${matchedDriver.id}` : "",
      plate_number: entry.plate_number || "",
      vehicle_name: entry.vehicle_name || "",
      driver_name: entry.driver_name || "",
      type: entry.type || "",
      time: entry.time
        ? format(new Date(entry.time), "yyyy-MM-dd'T'HH:mm")
        : "",
    });

    document.getElementById("edit_modal").showModal();
  };

  const handleUpdate = async () => {
    if (!selectedEntry) return;

    const selectedVehicle = vehicles.find(
      (v) => String(v.id) === String(editForm.vehicleId),
    );

    let selectedDriver = null;

    if (editForm.driverId.startsWith("driver-")) {
      const id = editForm.driverId.replace("driver-", "");
      selectedDriver = drivers.find((d) => String(d.id) === String(id));
    } else if (editForm.driverId.startsWith("staff-")) {
      const id = editForm.driverId.replace("staff-", "");
      selectedDriver = privateStaff.find((s) => String(s.id) === String(id));
    }

    if (!selectedVehicle || !selectedDriver) {
      toast.error("Please select valid vehicle and driver");
      return;
    }

    const payload = {
      vehicle_type: "government",
      type: editForm.type,
      plate_number: selectedVehicle.plate_number,
      vehicle_name: selectedVehicle.name,
      driver_name: `${selectedDriver.first_name} ${selectedDriver.last_name}`,
      time: new Date(editForm.time).toISOString(),
    };

    const { error } = await supabase
      .from("entry_log")
      .update(payload)
      .eq("id", selectedEntry.id);

    if (error) {
      console.error(error);
      toast.error("Update failed");
      return;
    }

    toast.success("Entry updated!");
    document.getElementById("edit_modal").close();
    await fetchEntryLogs();
  };

  const openDeleteModal = (entry) => {
    setSelectedEntry(entry);
    document.getElementById("delete_modal").showModal();
  };

  const handleDelete = async () => {
    if (!selectedEntry) return;

    const { error } = await supabase
      .from("entry_log")
      .delete()
      .eq("id", selectedEntry.id);

    if (error) {
      console.error(error);
      toast.error("Delete failed");
      return;
    }

    toast.success("Entry deleted!");
    document.getElementById("delete_modal").close();
    await fetchEntryLogs();
  };

  const handleAddPrivateStaff = async () => {
    if (!staffForm.first_name || !staffForm.last_name) {
      toast.error("First name and last name are required");
      return;
    }

    setAddingStaff(true);

    const payload = {
      first_name: staffForm.first_name,
      last_name: staffForm.last_name,
    };

    const { data, error } = await supabase
      .from("private_staff")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error(error);
      toast.error("Failed to add staff");
      setAddingStaff(false);
      return;
    }

    setPrivateStaff((prev) =>
      [...prev, data].sort((a, b) => a.last_name.localeCompare(b.last_name)),
    );

    toast.success("Private staff added!");

    setStaffForm({
      first_name: "",
      last_name: "",
    });

    document.getElementById("private_staff_modal").close();

    setAddingStaff(false);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    return (
      <>
        <span className="block text-xs">{format(d, "MMM d, yyyy")}</span>
        <span className="text-xs">{format(d, "hh:mm a")}</span>
      </>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-20 xl:px-0">
      {/* HEADER */}
      <div className="flex justify-between">
        <div className="">
          <h1 className="text-5xl font-bold uppercase">
            Entry & Exit Monitoring
          </h1>
          <p className="text-gray-600">
            Monitor of government vehicle entry and exit at Basement 1
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <Link to="/entry-exit-history">
            <button className="btn btn-info flex gap-2 text-white">
              <LucideFileClock className="h-4 w-6" />
              Vehicle History
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-4 md:w-auto">
        <form
          onSubmit={handleSubmit(handleEntry)}
          className="card bg-base-100 h-fit w-full max-w-1/4 border border-gray-300 p-5"
        >
          {/* GUARD */}
          <p className="mb-2 text-sm text-gray-500">Guard On Duty</p>

          <select
            className="select select-bordered w-full"
            {...register("guardId")}
          >
            <option value="">Select Guard</option>

            {guards.map((g) => (
              <option key={g.id} value={g.id}>
                {g.role} {g.last_name}, {g.first_name}
              </option>
            ))}
          </select>

          <p className="mt-4 font-bold"> Government Vehicle</p>

          {/* VEHICLE SELECTION */}
          <div className="mt-2 space-y-3">
            <select
              className="select select-bordered w-full"
              {...register("vehicleId")}
            >
              <option value="">Select Vehicle</option>

              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.plate_number})
                </option>
              ))}
            </select>
            <select
              className="select select-bordered w-full"
              {...register("driverId")}
              onChange={(e) => {
                if (e.target.value === "add-new-driver") {
                  e.target.value = "";
                  document.getElementById("private_staff_modal").showModal();
                }
              }}
            >
              <option value="">Select Driver</option>

              {/* GOVERNMENT DRIVERS */}
              {drivers.map((d) => (
                <option key={`driver-${d.id}`} value={`driver-${d.id}`}>
                  {d.last_name} {d.first_name}
                </option>
              ))}

              {/* PRIVATE STAFF */}
              {privateStaff.length > 0 && (
                <optgroup label="Private Staff">
                  {privateStaff.map((s) => (
                    <option key={`staff-${s.id}`} value={`staff-${s.id}`}>
                      {s.last_name}, {s.first_name}
                    </option>
                  ))}
                </optgroup>
              )}

              <option value="add-new-driver">+ Add New Driver</option>
            </select>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit((data) => handleEntry(data, "time in"))}
              className="btn btn-success text-white"
            >
              {isSubmitting ? "Saving..." : "TIME IN"}
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit((data) => handleEntry(data, "time out"))}
              className="btn btn-warning text-white"
            >
              {isSubmitting ? "Saving..." : "TIME OUT"}
            </button>
          </div>
        </form>

        {/* TABLE */}
        <div className="h-screen w-3/4 overflow-auto">
          <table className="md:table-sm lg:table-md table-zebra table-pin-rows table">
            <thead>
              <tr className="uppercase">
                <th>Plate</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Log Type</th>
                <th>Time</th>
                <th>Guard</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : (
                entryLog.map((entry) => (
                  <tr key={entry.id}>
                    {/* PLATE */}
                    <td>
                      <div className="badge badge-dash badge-primary badge-sm truncate">
                        {entry.plate_number}
                      </div>
                    </td>

                    {/* VEHICLE */}
                    <td>{entry.vehicle_name}</td>

                    {/* DRIVER */}
                    <td>{entry.driver_name}</td>

                    <td>
                      <span
                        className={`badge badge-sm truncate text-white capitalize ${
                          entry.type === "time in"
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {entry.type}
                      </span>
                    </td>

                    {/* TIME */}
                    <td className="truncate">{formatDate(entry.time)}</td>

                    {/* GUARD */}
                    <td>
                      {entry.guard
                        ? `${entry.guard.role} ${entry.guard.first_name} ${entry.guard.last_name}`
                        : "-"}
                    </td>

                    <td>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(entry)}
                          className="btn btn-xs btn-square text-info"
                        >
                          <Pencil className="size-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openDeleteModal(entry)}
                          className="btn btn-xs btn-square text-error"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <dialog id="edit_modal" className="modal">
        <div className="modal-box max-w-md">
          <h3 className="text-lg font-bold">Edit Entry Log</h3>
          <p className="text-sm text-gray-500">
            Edit the entry log information below.
          </p>

          <div className="mt-4 space-y-3">
            <select
              className="select select-bordered w-full"
              value={editForm.vehicleId}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  vehicleId: e.target.value,
                })
              }
            >
              <option value="">Select Vehicle</option>

              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.plate_number})
                </option>
              ))}
            </select>

            <select
              className="select select-bordered w-full"
              value={editForm.driverId}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "add-new-driver") {
                  setEditForm({
                    ...editForm,
                    driverId: "",
                  });

                  document.getElementById("private_staff_modal").showModal();
                  return;
                }

                setEditForm({
                  ...editForm,
                  driverId: value,
                });
              }}
            >
              <option value="">Select Driver</option>

              {drivers.map((d) => (
                <option key={`driver-${d.id}`} value={`driver-${d.id}`}>
                  {d.last_name} {d.first_name}
                </option>
              ))}

              {privateStaff.length > 0 && (
                <optgroup label="Private Staff">
                  {privateStaff.map((s) => (
                    <option key={`staff-${s.id}`} value={`staff-${s.id}`}>
                      {s.last_name} {s.first_name}
                    </option>
                  ))}
                </optgroup>
              )}

              <option value="add-new-driver">+ Add New Driver</option>
            </select>

            <select
              className="select select-bordered w-full"
              value={editForm.type}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  type: e.target.value,
                })
              }
            >
              <option value="time in">Time In</option>
              <option value="time out">Time Out</option>
            </select>

            <input
              type="datetime-local"
              className="input input-bordered w-full"
              value={editForm.time}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  time: e.target.value,
                })
              }
            />
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>

            <button
              type="button"
              onClick={handleUpdate}
              className="btn btn-success text-white"
            >
              Save Changes
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="private_staff_modal" className="modal">
        <div className="modal-box max-w-md">
          <h3 className="text-lg font-bold">Add Private Staff</h3>

          <p className="text-sm text-gray-500">
            Add a private staff driver to the system.
          </p>

          <div className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="First Name"
              className="input input-bordered w-full"
              value={staffForm.first_name}
              onChange={(e) =>
                setStaffForm({
                  ...staffForm,
                  first_name: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Last Name"
              className="input input-bordered w-full"
              value={staffForm.last_name}
              onChange={(e) =>
                setStaffForm({
                  ...staffForm,
                  last_name: e.target.value,
                })
              }
            />
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>

            <button
              type="button"
              onClick={handleAddPrivateStaff}
              disabled={addingStaff}
              className="btn btn-success text-white"
            >
              {addingStaff ? "Saving..." : "Add Staff"}
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-error text-lg font-bold">Delete Entry Log</h3>

          <p className="py-4">Are you sure you want to delete this record?</p>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>

            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-error text-white"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
