import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideFileClock } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function EntryExitPage() {
  const [type, setType] = useState("private");

  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [entryLog, setEntryLog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const [
        { data: vehiclesData, error: vehiclesError },
        { data: driversData, error: driversError },
        { data: logsData, error: logsError },
      ] = await Promise.all([
        supabase
          .from("vehicles")
          .select("*")
          .order("name", { ascending: true }),
        supabase
          .from("drivers")
          .select("*")
          .order("last_name", { ascending: true }),
        supabase
          .from("entry_log")
          .select("*")
          .order("time_in", { ascending: false }),
      ]);

      if (vehiclesError) console.error("Vehicles error:", vehiclesError);
      if (driversError) console.error("Drivers error:", driversError);
      if (logsError) console.error("Logs error:", logsError);

      setVehicles(vehiclesData || []);
      setDrivers(driversData || []);
      setEntryLog(logsData || []);

      setLoading(false);
    }

    fetchData();
  }, []);

  const [form, setForm] = useState({
    plateNumber: "",
    driverName: "",
    vehicleName: "",
    vehicleId: "",
    driverId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEntry = async () => {
    setIsSubmitting(true);

    try {
      let payload = {
        type,
        time_out: null,
      };

      if (type === "private") {
        payload = {
          ...payload,
          plate_number: form.plateNumber,
          driver_name: form.driverName,
          vehicle_name: form.vehicleName,
        };
      } else {
        const selectedVehicle = vehicles.find((v) => v.id === form.vehicleId);
        const selectedDriver = drivers.find((d) => d.id === form.driverId);

        payload = {
          ...payload,
          plate_number: selectedVehicle?.plate_number || null,
          vehicle_name: selectedVehicle?.name || null,
          driver_name:
            `${selectedDriver?.first_name} ${selectedDriver?.last_name}` ||
            null,
        };
      }

      const { error } = await supabase.from("entry_log").insert([payload]);

      if (error) {
        console.error(error);
        return;
      }

      toast.success("Entry recorded successfully!");

      // reset form
      setForm({
        plateNumber: "",
        driverName: "",
        vehicleName: "",
        vehicleId: "",
        driverId: "",
      });

      // refresh logs
      const { data } = await supabase
        .from("entry_log")
        .select("*")
        .order("time_in", { ascending: false });

      setEntryLog(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return format(new Date(date), "MMM d, yyyy h:mm a");
  };
  const handleTimeOut = async (entry) => {
    const now = new Date();

    const { error } = await supabase
      .from("entry_log")
      .update({
        time_out: now,
      })
      .eq("id", entry.id);

    if (error) {
      console.error(error);
      toast.error("Failed to time out entry");
      return;
    }

    toast.success("Time out recorded");

    // refetch logs (same pattern you already use)
    const { data } = await supabase
      .from("entry_log")
      .select("*")
      .order("time_in", { ascending: false });

    setEntryLog(data || []);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-7xl py-20"
    >
      <div className="text-center">
        <h1 className="mt-7 text-5xl font-bold uppercase">
          Entry & Exit Monitoring
        </h1>
        <p className="mt-2 text-gray-600">Monitor vehicle entry and exit</p>
      </div>

      <div className="flex justify-end">
        <Link to="/entry-exit-history">
          <button className="btn btn-success flex gap-2 text-white">
            <LucideFileClock className="h-4 w-6" />
            Vehicle History
          </button>
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-3 items-start gap-4">
        <div className="card bg-base h-fit p-6 shadow">
          <h2 className="mt-2 mb-4 text-center text-3xl font-bold uppercase">
            Time In here
          </h2>
          <div className="mb-6 flex gap-4">
            <button
              className={`btn flex-1 ${type === "private" ? "bg-green-600 text-white" : ""}`}
              onClick={() => setType("private")}
            >
              Private
            </button>
            <button
              className={`btn flex-1 ${type === "government" ? "bg-green-600 text-white" : ""}`}
              onClick={() => setType("government")}
            >
              Government
            </button>
          </div>

          <div className="grid min-h-17.5 grid-cols-2 gap-4">
            {type === "private" ? (
              <>
                <input
                  name="plateNumber"
                  value={form.plateNumber}
                  onChange={handleChange}
                  type="text"
                  placeholder="Plate Number"
                  className="input input-bordered w-full"
                />

                <input
                  name="driverName"
                  value={form.driverName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Driver Name"
                  className="input input-bordered w-full"
                />

                <input
                  name="vehicleName"
                  value={form.vehicleName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Vehicle Name"
                  className="input input-bordered col-span-2 w-full"
                />
              </>
            ) : (
              <>
                <select
                  className="select select-bordered w-full"
                  value={form.vehicleId ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      vehicleId: e.target.value ? Number(e.target.value) : "",
                    }))
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
                  value={form.driverId ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      driverId: e.target.value ? Number(e.target.value) : "",
                    }))
                  }
                >
                  <option value="">Select Driver</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.first_name} {d.last_name}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          <button
            onClick={handleEntry}
            disabled={isSubmitting}
            className="btn mt-6 w-full bg-green-600 text-white"
          >
            {isSubmitting ? "Timing in..." : "TIME IN"}
          </button>
        </div>

        {/* RIGHT TABLE */}
        <div className="col-span-2 overflow-x-auto rounded-lg shadow-sm">
          <table className="table w-full rounded-2xl">
            <thead className="bg-green-600 text-white">
              <tr className="uppercase">
                <th>Type</th>
                <th>Plate</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Time In</th>
                <th>Time Out</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : entryLog.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center">
                    No records found
                  </td>
                </tr>
              ) : (
                entryLog.map((entry) => (
                  <tr key={entry.id} className="bg-green-50 capitalize">
                    <td>
                      <span
                        className={`badge ${
                          entry.type === "private"
                            ? "badge-secondary"
                            : "badge-success"
                        } badge-sm text-white capitalize`}
                      >
                        {entry.type}
                      </span>
                    </td>{" "}
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
                          className="btn btn-sm btn-warning btn-block text-white uppercase"
                        >
                          Time Out
                        </button>
                      )}
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
