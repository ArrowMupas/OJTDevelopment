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

const pmsSchema = z.object({
  pms_date: z.string().min(1, "Date is required"),
});

export default function VehicleMonitoringPage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch vehicles from Supabase
  const fetchVehicles = async (searchTerm = "") => {
    setLoading(true);

    let query = supabase
      .from("vehicles")
      .select("*")
      .eq("operational", true)
      .order("pms_date", { ascending: true, nullsFirst: true });

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

  const pmsStats = vehicles.reduce(
    (acc, v) => {
      const status = getStatusByMonths(v.pms_date, 4, 5, 6);

      if (!v.pms_date) acc.notRecorded += 1;
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
    resolver: zodResolver(pmsSchema),
  });

  const openModal = (vehicle) => {
    setSelectedVehicle(vehicle);

    reset({
      pms_date: vehicle.pms_date || "",
    });

    document.getElementById("pms_modal").showModal();
  };

  const onSubmit = async (data) => {
    const { error } = await supabase
      .from("vehicles")
      .update({
        pms_date: data.pms_date,
      })
      .eq("id", selectedVehicle.id);

    if (error) {
      console.error(error);
      toast.error("Failed to update PMS info!");
      return;
    }

    document.getElementById("pms_modal").close();
    fetchVehicles();
    toast.success(`PMS info updated for ${selectedVehicle.name}`);
  };

  return (
    <main className="px-3 py-4 sm:px-5 h-full pb-25 space-y-5">
      <HeaderMonitoring
        title="PMS Monitoring"
        description="PMS is updated every 6 months"
        search={search}
        setSearch={setSearch}
        debouncedSearch={debouncedSearch}
        activeTab="pms"
        warning={pmsStats.warning}
        dueSoon={pmsStats.dueSoon}
        overdue={pmsStats.overdue}
      />

      {/* VEHICLE CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-2">
        {vehicles.map((v) => {
          const status = getStatusByMonths(v.pms_date, 4, 5, 6);
          const nextPms = getNextDateByMonths(v.pms_date, 6);

          const statusBadge = {
            text: !v.pms_date
              ? "NOT RECORDED"
              : status === "overdue"
                ? "REPLACEMENT NEEDED"
                : status === "dueSoon"
                  ? "NEAR EXPIRATION"
                  : status === "warning"
                    ? "WARNING"
                    : "PMS OK",
            color: !v.pms_date
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
                <div className="w-full h-24 sm:h-42 bg-indigo-100 rounded-xl overflow-hidden flex items-center justify-center">
                  {v.image_url ? (
                    <img
                      src={v.image_url}
                      alt={v.name}
                      className="w-full h-full object-fill"
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

                  {!v.pms_date ? (
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
                  <p className="text-xs text-gray-500">Latest PMS Date</p>
                  <p className="font-semibold">
                    {v.pms_date
                      ? format(new Date(v.pms_date), "MMM. d, yyyy")
                      : "N/A"}
                  </p>
                </div>

                <div className="mt-2">
                  <p className="text-xs text-gray-500">Next PMS Schedule</p>

                  {nextPms ? (
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
                      {format(new Date(nextPms), "MMM. d, yyyy")}
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
                    Update PMS
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DAISYUI MODAL */}
      <dialog id="pms_modal" className="modal">
        <div className="modal-box">
          <div className="mb-4">
            <h3 className="font-bold text-lg">Update PMS Information</h3>
            <p className="text-gray-500 text-sm">
              Insert the updated PMS information
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Date</span>
              </label>
              <input
                type="date"
                {...register("pms_date")}
                className="input input-border input-neutral w-full"
              />
              {errors.pms_date && (
                <p className="text-error text-sm mt-1">
                  {errors.pms_date.message}
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
