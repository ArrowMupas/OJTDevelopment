import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  ClipboardClock,
  ClipboardX,
  FilterIcon,
  History,
  Search,
  Van,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { format } from "date-fns";
import debounce from "lodash.debounce";

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

  const getPmsStatus = (date) => {
    if (!date) return "overdue";

    const install = new Date(date);
    const now = new Date();

    const diffMonths =
      (now.getFullYear() - install.getFullYear()) * 12 +
      (now.getMonth() - install.getMonth());

    if (diffMonths >= 12) return "overdue";
    if (diffMonths >= 11) return "warning";

    return "ok";
  };

  const pmsStats = vehicles.reduce(
    (acc, v) => {
      const status = getPmsStatus(v.pms_date);

      if (!v.pms_date) acc.notRecorded += 1;
      if (status === "warning") acc.warning += 1;
      if (status === "overdue") acc.overdue += 1;

      return acc;
    },
    { notRecorded: 0, warning: 0, overdue: 0 },
  );

  const getNextPmsDate = (date) => {
    if (!date) return null;

    const lastPms = new Date(date);
    lastPms.setFullYear(lastPms.getFullYear() + 1);

    return lastPms;
  };

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
    <main className="px-3 py-4 sm:px-5 h-full pb-25 space-y-7">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            PMS Monitoring
          </h1>
          <p className="text-gray-500 text-sm">PMS Monitoring</p>
        </div>

        <button
          onClick={() => navigate("/history")}
          className="btn btn-accent text-white gap-2"
        >
          <History size={18} /> View History
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between ">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <label className="input input-neutral w-full">
              <Search className="h-4 w-6" />
              <input
                type="search"
                placeholder="Search by plate number..."
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  debouncedSearch(value);
                }}
              />
            </label>
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn bg-green-600 text-white"
              >
                <FilterIcon className="h-4 w-6" /> Filter
              </div>
              <ul
                tabIndex="-1"
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                <li className="rounded-sm focus:bg-highlight">
                  <a className="active:bg-highlight">Ascending</a>
                </li>
                <li>
                  <a className="active:bg-highlight">Descending</a>
                </li>
              </ul>
            </div>
          </div>

          <div role="tablist" className="tabs tabs-box">
            <Link to="/vehiclemonitoring" className="tab tab-active">
              PMS
            </Link>
            <Link to="/battery" className="tab">
              Battery
            </Link>
            <Link to="/tires" className="tab">
              Tires
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="stat bg-base-100 shadow rounded-md">
            <div className="stat-figure">
              <ClipboardClock className="h-8 w-12 text-yellow-500" />
            </div>
            <div className="stat-title">PMS Due Soon</div>
            <div className="stat-value text-yellow-500">{pmsStats.warning}</div>
          </div>

          <div className="stat bg-base-100 shadow rounded-md">
            <div className="stat-figure">
              <ClipboardX className="h-8 w-12 text-red-500" />
            </div>
            <div className="stat-title">PMS Overdue</div>
            <div className="stat-value text-red-500">{pmsStats.overdue}</div>
          </div>
        </div>
      </div>

      {/* VEHICLE CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-2">
        {vehicles.map((v) => {
          const status = getPmsStatus(v.pms_date);
          const nextPms = getNextPmsDate(v.pms_date);

          const statusBadge = {
            text: !v.pms_date
              ? "NOT RECORDED"
              : status === "overdue"
                ? "PMS OVERDUE"
                : status === "warning"
                  ? "NEAR EXPIRATION"
                  : "PMS OK",
            color: !v.pms_date
              ? "badge-neutral"
              : status === "overdue"
                ? "badge-error"
                : status === "warning"
                  ? "badge-warning"
                  : "badge-success",
          };

          return (
            <div key={v.id} className="card bg-base-100 shadow-sm relative">
              <div
                className={`absolute top-1 right-1 ${statusBadge.color} badge badge-sm`}
              >
                {statusBadge.text}
              </div>

              <div className="card-body p-4">
                <div className="w-full h-25 sm:h-32 bg-linear-to-r from-emerald-100 to-green-200 rounded-xl flex items-center justify-center overflow-hidden">
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

                  {!v.pms_date ? (
                    <AlertTriangle className="text-gray-400" />
                  ) : status === "overdue" ? (
                    <AlertTriangle className="text-error" />
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
                    className="btn btn-success w-full"
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
          <h3 className="font-bold text-lg mb-4">Update PMS Information</h3>

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
