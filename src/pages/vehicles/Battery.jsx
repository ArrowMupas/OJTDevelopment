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
import clsx from "clsx";
import VehiclePMSCard from "../../components/VehiclePMSCard";

const batterySchema = z.object({
  type_battery: z.enum(["Excel", "Gold"], {
    required_error: "Battery type is required",
  }),
  battery_description: z.string().min(1, "Battery description is required"),
  install_date_battery: z.string().min(1, "Installation date is required"),
});

export default function Battery() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async (searchTerm = "") => {
    setLoading(true);

    let query = supabase.from("vehicles").select("*").eq("operational", true);

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

    const { data, error } = await query
      .order("last_digit", { ascending: true })
      .order("acquisition_date", { ascending: true });

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
      battery_description: vehicle.battery_description || "",
      install_date_battery: vehicle.install_date_battery || "",
    });

    document.getElementById("battery_modal").showModal();
  };

  const onSubmit = async (data) => {
    const { error } = await supabase
      .from("vehicles")
      .update({
        type_battery: data.type_battery,
        battery_description: data.battery_description,
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
    <main className="h-full space-y-4 px-3 py-4 pb-25 sm:space-y-7 sm:px-5">
      <HeaderMonitoring
        title="Battery Monitoring"
        description="Battery is replaced 12/24 months"
        search={search}
        setSearch={setSearch}
        debouncedSearch={debouncedSearch}
        activeTab="battery"
        warning={batteryStats.warning}
        dueSoon={batteryStats.dueSoon}
        overdue={batteryStats.overdue}
      />

      {/* VEHICLE CARDS */}
      <div className="grid grid-cols-2 gap-1 sm:gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {vehicles.map((v) => {
          const batteryConfig =
            v.type_battery === "Excel"
              ? { warning: 22, dueSoon: 23, overdue: 24 }
              : { warning: 10, dueSoon: 11, overdue: 12 };

          const status = getStatusByMonths(
            v.install_date_battery,
            batteryConfig.warning,
            batteryConfig.dueSoon,
            batteryConfig.overdue,
          );

          const nextChange = getNextDateByMonths(
            v.install_date_battery,
            batteryConfig.overdue,
          );

          return (
            <VehiclePMSCard key={v.id} status={status} vehicle={v}>
              <div className="">
                <p className="text-xs text-gray-500">Battery Description</p>
                <p className="font-semibold">
                  {v.battery_description || "N/A"}
                </p>
              </div>

              <div className="">
                <p className="text-xs text-gray-500">Battery Type</p>
                <p className="font-semibold">{v.type_battery || "N/A"}</p>
              </div>

              <div className="">
                <p className="text-xs text-gray-500">
                  Latest Battery Installation Date
                </p>
                <p className="font-semibold">
                  {v.install_date_battery
                    ? format(new Date(v.install_date_battery), "MMM. d, yyyy")
                    : "N/A"}
                </p>
              </div>

              <div className="">
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

              <div className="card-actions">
                <button
                  className="btn btn-success w-full text-white"
                  onClick={() => openModal(v)}
                >
                  Update Battery
                </button>
              </div>
            </VehiclePMSCard>
          );
        })}
      </div>

      {/* DAISYUI MODAL */}
      <dialog id="battery_modal" className="modal">
        <div className="modal-box">
          <div className="mb-4">
            <h3 className="text-lg font-bold">Update Battery Information</h3>
            <p className="text-sm text-gray-500">
              Insert the updated battery information
            </p>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
            onClick={() => {
              document.getElementById("battery_modal")?.close();
            }}
          >
            ✕
          </button>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Battery Description</span>
              </label>

              <input
                {...register("battery_description")}
                className="input input-bordered w-full"
                placeholder="Enter battery description"
              />

              {errors.battery_description && (
                <p className="text-error mt-1 text-sm">
                  {errors.battery_description.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text">Battery Type</span>
              </label>
              <select
                {...register("type_battery")}
                className="select select-bordered w-full"
                defaultValue=""
              >
                <option value="">Select battery type</option>
                <option value="Excel">Excel</option>
                <option value="Gold">Gold</option>
              </select>

              {errors.type_battery && (
                <p className="text-error mt-1 text-sm">
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
                <p className="text-error mt-1 text-sm">
                  {errors.install_date_battery.message}
                </p>
              )}
            </div>

            <div className="modal-action">
              <button type="submit" className="btn admin-btn btn-block">
                Save battery Changes
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </main>
  );
}
