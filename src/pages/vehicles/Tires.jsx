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

const tireSchema = z.object({
  type_tire: z.string().min(1, "Tire type is required"),
  install_date_tire: z.string().min(1, "Installation date is required"),
});

export default function Tires() {
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
      .order("install_date_tire", { ascending: true, nullsFirst: true });

    if (searchTerm) {
      query = query.or(
        `name.ilike.%${searchTerm}%,plate_number.ilike.%${searchTerm}%,policy_number.ilike.%${searchTerm}%`,
      );
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

  const tireStats = vehicles.reduce(
    (acc, v) => {
      const status = getStatusByMonths(v.install_date_tire, 34, 35, 36);

      if (!v.install_date_tire) acc.notRecorded += 1;
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
    resolver: zodResolver(tireSchema),
  });

  const openModal = (vehicle) => {
    setSelectedVehicle(vehicle);

    reset({
      type_tire: vehicle.type_tire || "",
      install_date_tire: vehicle.install_date_tire || "",
    });

    document.getElementById("tire_modal").showModal();
  };

  const onSubmit = async (data) => {
    const { error } = await supabase
      .from("vehicles")
      .update({
        type_tire: data.type_tire,
        install_date_tire: data.install_date_tire,
      })
      .eq("id", selectedVehicle.id);

    if (error) {
      console.error(error);
      toast.error("Failed to update tire info!");
      return;
    }

    document.getElementById("tire_modal").close();
    fetchVehicles();

    toast.success(`Tire info updated for ${selectedVehicle.name}`);
  };

  return (
    <main className="h-full space-y-5 px-3 py-4 pb-25 sm:px-5">
      <HeaderMonitoring
        title="Tire Monitoring"
        description="Tire is replaced every 3 years"
        search={search}
        setSearch={setSearch}
        debouncedSearch={debouncedSearch}
        activeTab="tires"
        warning={tireStats.warning}
        dueSoon={tireStats.dueSoon}
        overdue={tireStats.overdue}
      />

      {/* VEHICLE CARDS */}
      <div className="grid grid-cols-2 gap-1 sm:gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {vehicles.map((v) => {
          const status = getStatusByMonths(v.install_date_tire, 34, 35, 36);
          const nextChange = getNextDateByMonths(v.install_date_tire, 36);

          const statusBadge = {
            text: !v.install_date_tire
              ? "NOT RECORDED"
              : status === "overdue"
                ? "REPLACEMENT NEEDED"
                : status === "dueSoon"
                  ? "NEAR EXPIRATION"
                  : status === "warning"
                    ? "WARNING"
                    : "TIRES OK",

            color: !v.install_date_tire
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
              className="card bg-base-100 relative shadow-sm transition-all hover:ring-2 hover:ring-indigo-400"
            >
              <div
                className={`absolute top-1 right-1 ${statusBadge.color} badge badge-sm`}
              >
                {statusBadge.text}
              </div>

              <div className="card-body p-4">
                <div className="flex h-24 w-full items-center justify-center overflow-hidden rounded-xl bg-indigo-100 sm:h-42">
                  {v.image_url ? (
                    <img
                      src={v.image_url}
                      alt={v.name}
                      className="h-full w-full object-fill"
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

                  {!v.install_date_tire ? (
                    <AlertTriangle className="text-gray-500" /> // or badge-info color
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
                  <p className="text-xs text-gray-500">Tire Type</p>
                  <p className="font-semibold">{v.type_tire || "N/A"}</p>
                </div>

                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    Latest Tire Installation Date
                  </p>
                  <p className="font-semibold">
                    {v.install_date_tire
                      ? format(new Date(v.install_date_tire), "MMM. d, yyyy")
                      : "N/A"}
                  </p>
                </div>

                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    Next Tire Replacement Schedule
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
                    Update Tires
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* DAISYUI MODAL */}
      <dialog id="tire_modal" className="modal">
        <div className="modal-box">
          <div className="mb-4">
            <h3 className="text-lg font-bold">Update Tire Information</h3>
            <p className="text-sm text-gray-500">
              Insert the updated tire information
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Tire Type</span>
              </label>

              <input
                {...register("type_tire")}
                className="input input-bordered w-full"
              />

              {errors.type_tire && (
                <p className="text-error mt-1 text-sm">
                  {errors.type_tire.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text">Installation Date</span>
              </label>

              <input
                type="date"
                {...register("install_date_tire")}
                className="input input-bordered w-full"
              />

              {errors.install_date_tire && (
                <p className="text-error mt-1 text-sm">
                  {errors.install_date_tire.message}
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
