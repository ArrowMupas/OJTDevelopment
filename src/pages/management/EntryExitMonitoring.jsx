import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideFileClock } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import { format } from "date-fns";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { entryLogSchema } from "../../schemas/entryLogSchema";

export default function EntryExitPage() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [guards, setGuards] = useState([]);
  const [entryLog, setEntryLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(entryLogSchema),
    defaultValues: {
      vehicleType: "government",
    },
  });

  const selectedVehicleType = watch("vehicleType");

  const fetchEntryLogs = async () => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from("entry_log")
      .select(
        `
      *,
      guard (
        id,
        first_name,
        last_name
      )
    `,
      )
      .gte("time", startOfToday.toISOString())
      .lte("time", endOfToday.toISOString())
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
        { data: driversData },
        { data: guardsData },
      ] = await Promise.all([
        supabase.from("vehicles").select("*").order("name"),
        supabase.from("drivers").select("*").order("last_name"),
        supabase.from("guard").select("*").order("last_name"),
      ]);

      setVehicles(vehiclesData || []);
      setDrivers(driversData || []);
      setGuards(guardsData || []);

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleEntry = async (formData, logType) => {
    setIsSubmitting(true);

    try {
      if (!formData.guardId) {
        toast.error("Please select a guard");
        return;
      }

      let payload = {
        type: logType,
        vehicle_type: formData.vehicleType,
        guard_id: Number(formData.guardId),
      };

      if (formData.vehicleType === "private") {
        if (
          !formData.plateNumber ||
          !formData.vehicleName ||
          !formData.driverName
        ) {
          toast.error("Complete all private vehicle fields");
          return;
        }

        payload = {
          ...payload,
          plate_number: formData.plateNumber,
          vehicle_name: formData.vehicleName,
          driver_name: formData.driverName,
        };
      } else {
        const selectedVehicle = vehicles.find(
          (v) => String(v.id) === String(formData.vehicleId),
        );

        const selectedDriver = drivers.find(
          (d) => String(d.id) === String(formData.driverId),
        );

        if (!selectedVehicle || !selectedDriver) {
          toast.error("Select valid vehicle and driver");
          return;
        }

        payload = {
          ...payload,
          plate_number: selectedVehicle.plate_number,
          vehicle_name: selectedVehicle.name,
          driver_name: `${selectedDriver.first_name} ${selectedDriver.last_name}`,
        };
      }

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

        plateNumber: "",
        vehicleName: "",
        driverName: "",
      });

      await fetchEntryLogs();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    return (
      <>
        <span className="block text-sm">{format(d, "MMM d, yyyy")}</span>
        <span className="text-sm">{format(d, "hh:mm a")}</span>
      </>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-8 py-20">
      {/* HEADER */}
      <div className="flex justify-between">
        <div className="">
          <h1 className="text-5xl font-bold uppercase">
            Entry & Exit Monitoring
          </h1>
          <p className="text-gray-600">Monitor vehicle entry and exit</p>
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
          className="card bg-base-100 h-fit max-w-1/4 border border-gray-300 p-5"
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
                {g.last_name}, {g.first_name}
              </option>
            ))}
          </select>

          {/* VEHICLE TYPE */}
          <div className="tabs tabs-box mt-5 min-h-55">
            <input
              type="radio"
              value="government"
              {...register("vehicleType")}
              className="tab"
              aria-label="Government"
            />

            <div className="tab-content space-y-3 p-2">
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
              >
                <option value="">Select Driver</option>

                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.first_name} {d.last_name}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="radio"
              value="private"
              {...register("vehicleType")}
              className="tab"
              aria-label="Private"
            />

            <div className="tab-content space-y-3 p-2">
              <label className="floating-label">
                <span>Plate Number</span>
                <input
                  className="input input-bordered w-full"
                  placeholder="Plate Number"
                  {...register("plateNumber")}
                />
              </label>

              <label className="floating-label">
                <span>Vehicle Name</span>
                <input
                  className="input input-bordered w-full"
                  placeholder="Vehicle Name"
                  {...register("vehicleName")}
                />
              </label>

              <label className="floating-label">
                <span>Driver Name</span>
                <input
                  className="input input-bordered w-full"
                  placeholder="Driver Name"
                  {...register("driverName")}
                />
              </label>
            </div>
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
        <div className="h-screen overflow-auto">
          <table className="md:table-sm lg:table-md table-zebra table-pin-rows table">
            <thead>
              <tr className="uppercase">
                <th>Vehicle Type</th>
                <th>Plate</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Log Type</th>
                <th>Time</th>
                <th>Guard</th>
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
                  <>
                    <tr key={entry.id}>
                      {/* VEHICLE TYPE */}
                      <td>
                        <span
                          className={`badge badge-sm text-white capitalize ${
                            entry.vehicle_type === "private"
                              ? "badge-info"
                              : "badge-error"
                          }`}
                        >
                          {entry.vehicle_type}
                        </span>
                      </td>

                      {/* PLATE */}
                      <td>
                        <div className="badge badge-dash badge-primary badge-sm">
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
                          ? `${entry.guard.first_name} ${entry.guard.last_name}`
                          : "-"}
                      </td>
                    </tr>
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
