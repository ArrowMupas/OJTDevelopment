import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, History, Search, Van } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const tireSchema = z.object({
  type_tire: z.string().min(1, "Tire type is required"),
  install_date_tire: z.string().min(1, "Installation date is required"),
});

export default function Tires() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);

  const fetchVehicles = async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("install_date_tire", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setVehicles(data);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Tire expiration logic
  const getTireStatus = (date) => {
    if (!date) return "overdue";

    const install = new Date(date);
    const now = new Date();

    const diffMonths =
      (now.getFullYear() - install.getFullYear()) * 12 +
      (now.getMonth() - install.getMonth());

    if (diffMonths >= 36) return "overdue";
    if (diffMonths >= 32) return "warning";

    return "ok";
  };

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
      return;
    }

    document.getElementById("tire_modal").close();

    fetchVehicles();
  };

  return (
    <main className="px-3 py-4 sm:px-5  h-full pb-25 ">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              Motorpool Compliance Monitoring
            </h1>
            <p className="text-gray-500 text-sm mb-6">Tire Monitoring</p>
          </div>

          <button
            onClick={() => navigate("/history")}
            className="btn btn-success gap-2"
          >
            <History size={18} /> View History
          </button>
        </div>

        <label className="input input-neutral mb-7">
          <Search className="h-4 w-6" />
          <input
            type="search"
            placeholder="Search by plate number..."
            // value={search}
            // onChange={(e) => {
            //   const value = e.target.value;
            //   setSearch(value);
            //   debouncedSearch(value);
            // }}
          />
        </label>

        {/* TABS */}
        <div role="tablist" className="tabs tabs-box mb-6">
          <Link to="/vehiclemonitoring" className="tab">
            PMS
          </Link>

          <Link to="/battery" className="tab">
            Battery
          </Link>

          <Link to="/tires" className="tab tab-active">
            Tires
          </Link>
        </div>

        {/* VEHICLE CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {vehicles.map((v) => {
            const status = getTireStatus(v.install_date_tire);

            return (
              <div
                key={v.id}
                className={`card shadow-sm border-2 ${
                  status === "overdue"
                    ? "border-error bg-error/10"
                    : status === "warning"
                      ? "border-warning bg-warning/10"
                      : "border-base-200"
                }`}
              >
                <div className="card-body">
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
                      <p className="text-base font-bold">{v.name}</p>
                      <div className="badge badge-primary badge-dash">
                        {v.plate_number}
                      </div>
                    </div>

                    {status === "overdue" ? (
                      <AlertTriangle className="text-error" />
                    ) : status === "warning" ? (
                      <AlertTriangle className="text-warning" />
                    ) : (
                      <CheckCircle className="text-success" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm">Latest Tire Installation Date</p>
                    <p className="font-semibold">
                      {v.install_date_tire || "Not recorded"}
                    </p>
                  </div>

                  <p
                    className={`font-bold ${
                      status === "overdue"
                        ? "text-error"
                        : status === "warning"
                          ? "text-warning"
                          : "text-success"
                    }`}
                  >
                    {status === "overdue"
                      ? "REPLACEMENT NEEDED"
                      : status === "warning"
                        ? "NEAR EXPIRATION"
                        : "TIRES OK"}
                  </p>

                  {(status === "warning" || status === "overdue") && (
                    <div className="card-actions">
                      <button
                        className="btn btn-success w-full"
                        onClick={() => openModal(v)}
                      >
                        Update Tires
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* DAISYUI MODAL */}
      <dialog id="tire_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Update Tire Information</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Tire Size</span>
              </label>

              <input
                {...register("type_tire")}
                className="input input-bordered w-full"
              />

              {errors.type_tire && (
                <p className="text-error text-sm mt-1">
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
                <p className="text-error text-sm mt-1">
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
