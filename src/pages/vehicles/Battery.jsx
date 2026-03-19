import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle, Van } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import HeaderMonitoring from "../../components/HeaderMonitoring";
import {
  getStatusByMonths,
  getNextDateByMonths,
} from "../../helpers/statusHelper";

const batterySchema = z.object({
  type_battery: z.string().min(1, "Battery type is required"),
  install_date_battery: z.string().min(1, "Installation date is required"),
});

export default function Battery() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async (searchTerm = "") => {
    setLoading(true);

    let query = supabase
      .from("vehicles")
      .select("*")
      .eq("operational", true)
      .order("install_date_battery", { ascending: true, nullsFirst: true });

    const alwaysFields = ["name", "plate_number"];
    const additionalFields = ["type_battery"];

    if (searchTerm) {
      let orQueryParts = alwaysFields.map(
        (field) => `${field}.ilike.%${searchTerm}%`,
      );

      const includeAdditionals = true;
      if (includeAdditionals) {
        orQueryParts = orQueryParts.concat(
          additionalFields.map((field) => `${field}.ilike.%${searchTerm}%`),
        );
      }

      query = query.or(orQueryParts.join(","));
    }

    const { data, error } = await query;

    if (error) console.error(error);
    else setVehicles(data);

    setLoading(false);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        if (!value) fetchVehicles("");
        else fetchVehicles(value);
      }, 400),
    [],
  );

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const batteryStats = vehicles.reduce(
    (acc, v) => {
      const status = getStatusByMonths(v.install_date_battery, 10, 11, 12);

      if (!v.install_date_battery) acc.notRecorded += 1;
      if (status === "warning") acc.warning += 1;
      if (status === "dueSoon") acc.dueSoon += 1;
      if (status === "overdue") acc.overdue += 1;

      return acc;
    },
    { notRecorded: 0, warning: 0, overdue: 0, dueSoon: 0 },
  );

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(batterySchema),
  });

  const openModal = (vehicle) => {
    setSelectedVehicle(vehicle);

    reset({
      type_battery: vehicle.type_battery || "",
      install_date_battery: vehicle.install_date_battery || "",
    });

    document.getElementById("battery_modal").showModal();
  };

  const onSubmit = async (data) => {
    const { error } = await supabase
      .from("vehicles")
      .update({
        type_battery: data.type_battery,
        install_date_battery: data.install_date_battery,
      })
      .eq("id", selectedVehicle.id);

    if (error) {
      console.error(error);
      toast.error("Failed to update battery info!");
      return;
    }

    document.getElementById("battery_modal").close();
    fetchVehicles();
    toast.success(`Battery info updated for ${selectedVehicle.name}`);
  };

  return (
    <main className="px-3 py-4 sm:px-5 h-full pb-25 space-y-5">
      <HeaderMonitoring
        title="Battery Monitoring"
        description="Battery is replaced every year"
        search={search}
        setSearch={setSearch}
        debouncedSearch={debouncedSearch}
        activeTab="battery"
        warning={batteryStats.warning}
        dueSoon={batteryStats.dueSoon}
        overdue={batteryStats.overdue}
      />

      {/* VEHICLE CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-2">
        {vehicles.map((v) => {
          const status = getStatusByMonths(v.install_date_battery, 10, 11, 12);
          const nextChange = getNextDateByMonths(v.install_date_battery, 12);

          const statusBadge = {
            text: !v.install_date_battery
              ? "NOT RECORDED"
              : status === "overdue"
                ? "REPLACEMENT NEEDED"
                : status === "dueSoon"
                  ? "NEAR EXPIRATION"
                  : status === "warning"
                    ? "WARNING"
                    : "BATTERY OK",

            color: !v.install_date_battery
              ? "badge-neutral"
              : status === "overdue"
                ? "badge-error font-bold"
                : status === "dueSoon"
                  ? "badge-secondary"
                  : status === "warning"
                    ? "badge-warning"
                    : "badge-success",
          };

          return (
            <div
              key={v.id}
              className="card bg-base-100 shadow-sm relative hover:ring-2 hover:ring-indigo-400 transition-all"
            >
              <div
                className={`absolute top-1 right-1 ${statusBadge.color} badge badge-sm`}
              >
                {statusBadge.text}
              </div>

              <div className="card-body p-4">
                <div className="w-full h-25 sm:h-32 bg-indigo-100 rounded-xl flex items-center justify-center overflow-hidden">
                  {v.image_url ? (
                    <img
                      src={v.image_url}
                      alt={v.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Van className="size-12 text-gray-300" />
                  )}
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-bold">{v.name}</p>
                    <div className="badge badge-primary badge-dash badge-sm">
                      {v.plate_number}
                    </div>
                  </div>

                  {!v.install_date_battery ? (
                    <AlertTriangle className="text-gray-400" />
                  ) : status === "overdue" ? (
                    <AlertTriangle className="text-error" />
                  ) : status === "dueSoon" ? (
                    <AlertTriangle className="text-secondary" />
                  ) : status === "warning" ? (
                    <AlertTriangle className="text-warning" />
                  ) : (
                    <CheckCircle className="text-success" />
                  )}
                </div>

                <div className="mt-2">
                  <p className="text-xs text-gray-500">Battery Type</p>
                  <p className="font-semibold">{v.type_battery || "N/A"}</p>
                </div>

                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    Latest Battery Installation Date
                  </p>
                  <p className="font-semibold">
                    {v.install_date_battery
                      ? format(new Date(v.install_date_battery), "MMM. d, yyyy")
                      : "N/A"}
                  </p>
                </div>

                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    Next Battery Replacement Schedule
                  </p>

                  {nextChange ? (
                    <p
                      className={`font-semibold ${
                        status === "overdue"
                          ? "text-error"
                          : status === "dueSoon"
                            ? "text-secondary"
                            : status === "warning"
                              ? "text-warning"
                              : "text-success"
                      }`}
                    >
                      {format(new Date(nextChange), "MMM. d, yyyy")}
                    </p>
                  ) : (
                    <p className="font-semibold">N/A</p>
                  )}
                </div>

                <div className="card-actions mt-2">
                  <button
                    className="btn btn-success w-full text-white"
                    onClick={() => openModal(v)}
                  >
                    Update Battery
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DAISYUI MODAL */}
      <dialog id="battery_modal" className="modal">
        <div className="modal-box">
          <div className="mb-4">
            <h3 className="font-bold text-lg">Update Battery Information</h3>
            <p className="text-gray-500 text-sm">
              Insert the updated battery information
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Battery Type</span>
              </label>
              <input
                {...register("type_battery")}
                className="input input-bordered w-full"
              />
              {errors.type_battery && (
                <p className="text-error text-sm mt-1">
                  {errors.type_battery.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text">Installation Date</span>
              </label>
              <input
                type="date"
                {...register("install_date_battery")}
                className="input input-bordered w-full"
              />
              {errors.install_date_battery && (
                <p className="text-error text-sm mt-1">
                  {errors.install_date_battery.message}
                </p>
              )}
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-success">
                Save
              </button>

              <form method="dialog">
                <button className="btn">Cancel</button>
              </form>
            </div>
          </form>
        </div>
      </dialog>
    </main>
  );
}
