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

  // RHF + ZOD
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(entryLogSchema),
    defaultValues: {
      type: "government",
    },
  });

  const selectedType = watch("type");

  // FETCH DATA
  const fetchEntryLogs = async () => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

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
      .or(`time_out.is.null,time_out.gte.${oneDayAgo}`)
      .order("time_in", { ascending: false });

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

  const handleEntry = async (formData) => {
    setIsSubmitting(true);
    console.log("hello");

    try {
      if (!formData.guardId) {
        toast.error("Please select a guard");
        return;
      }

      let payload = {
        type: formData.type,
        guard_id: Number(formData.guardId),
        time_out: null,
      };

      if (formData.type === "private") {
        if (
          !formData.plateNumber ||
          !formData.vehicleName ||
          !formData.driverName
        ) {
          toast.error("Complete all private fields");
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

      toast.success("Entry recorded!");

      reset({
        type: formData.type,
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
        <span className="text-xs">{format(d, "hh:mm a")}</span>
      </>
    );
  };

  const handleTimeOut = async (entry) => {
    const { error } = await supabase
      .from("entry_log")
      .update({ time_out: new Date() })
      .eq("id", entry.id);

    if (error) {
      toast.error("Failed to time out");
      return;
    }

    toast.success("Time out recorded");
    await fetchEntryLogs();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-7xl py-20"
    >
      {/* HEADER */}
      <div className="text-center">
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

      <div className="mt-10 grid grid-cols-3 gap-2">
        <form
          onSubmit={handleSubmit(handleEntry)}
          className="card bg-base-100 h-fit border border-gray-300 p-6"
        >
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

          {/* TYPE */}
          <div className="tabs tabs-box mt-3 min-h-60">
            <input
              type="radio"
              value="government"
              {...register("type")}
              className="tab"
              aria-label="Government"
            />

            <div className="tab-content space-y-3 p-4">
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
              {...register("type")}
              className="tab"
              aria-label="Private"
            />

            <div className="tab-content space-y-3 p-4">
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

          <button
            disabled={isSubmitting}
            className="btn btn-success mt-4 w-full text-white"
          >
            {isSubmitting ? "Saving..." : "TIME IN"}
          </button>
        </form>

        {/* TABLE */}
        <div className="col-span-2 overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="uppercase">
                <th>Type</th>
                <th>Plate</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Time In</th>
                <th>Time Out</th>
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
                  <tr key={entry.id}>
                    <td>
                      <span
                        className={`badge ${
                          entry.type === "private"
                            ? "badge-success"
                            : "badge-error"
                        } badge-sm text-white capitalize`}
                      >
                        {entry.type}
                      </span>
                    </td>
                    <td>
                      <div className="badge badge-dash badge-primary badge-sm truncate">
                        {entry.plate_number}
                      </div>
                    </td>
                    <td>{entry.vehicle_name}</td>
                    <td>{entry.driver_name}</td>
                    <td className="truncate">{formatDate(entry.time_in)}</td>
                    <td className="truncate">
                      {entry.time_out ? (
                        formatDate(entry.time_out)
                      ) : (
                        <button
                          onClick={() => handleTimeOut(entry)}
                          className="btn btn-warning btn-sm text-white"
                        >
                          Time Out
                        </button>
                      )}
                    </td>
                    <td>
                      {entry.guard
                        ? `${entry.guard.first_name} ${entry.guard.last_name}`
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
