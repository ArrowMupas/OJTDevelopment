import {
  ArchiveRestore,
  BeanOff,
  FilterIcon,
  PenLine,
  Search,
  Truck,
  Van,
} from "lucide-react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { format } from "date-fns";

const vehicleSchema = z
  .object({
    vehicleName: z
      .string()
      .min(2, "Vehicle name must be at least 2 characters"),
    plateNumber: z
      .string()
      .min(2, "Plate number must be at least 2 characters"),
    policyNumber: z
      .string()
      .min(2, "Policy number must be at least 2 characters"),
    policyID: z.string().min(2, "Policy ID must be at least 2 characters"),
    requiredCovered: z
      .string()
      .min(2, "Required covered must be at least 2 characters"),
    issueDate: z.string().min(1, "Issue date is required"),
    periodFrom: z.string().min(1, "Period from is required"),
    periodTo: z.string().min(1, "Period to is required"),
  })
  .refine((data) => new Date(data.periodTo) >= new Date(data.periodFrom), {
    message: "Period To must be after Period From",
    path: ["periodTo"],
  });

export default function MaintenancePage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicles() {
      setLoading(true);
      const { data, error } = await supabase.from("vehicles").select("*");
      // .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setVehicles(data);
      }
      setLoading(false);
    }
    fetchVehicles();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createVehicle = async (data) => {
    setIsSubmitting(true);
    const { error } = await supabase.from("vehicles").insert([
      {
        name: data.vehicleName,
        plate_number: data.plateNumber,
        policy_number: data.policyNumber,
        policy_id: data.policyID,
        required_covered: data.requiredCovered,
        issue_date: data.issueDate,
        period_from: data.periodFrom,
        period_to: data.periodTo,
      },
    ]);

    if (error) {
      toast.error("Failed to create vehicle: " + error.message, {
        position: "top-center",
      });
    } else {
      toast.success("Vehicle created successfully!", {
        position: "top-center",
      });
      document.getElementById("vehicleModal")?.close();
      reset();
    }

    setIsSubmitting(false);
  };

  return (
    <main className="p-8 h-full">
      <h1 className="text-4xl font-bold ">Vehicle Maintenance</h1>
      <p className="text-gray-500 mb-6">Vehicle and driver management</p>

      <div className="space-x-3">
        <label className="input w-1/3 input-neutral">
          <Search className="h-4 w-6" />
          <input type="search" required placeholder="Search" />
        </label>

        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn bg-green-600 text-white"
          >
            <FilterIcon className="h-4 w-6" />
            Filter
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
            <li>
              <a className="active:bg-highlight">Date</a>
            </li>
            <li>
              <a className="active:bg-highlight">Time</a>
            </li>
          </ul>
        </div>

        <button
          className="btn btn-outline btn-neutral"
          onClick={() => document.getElementById("vehicleModal").showModal()}
        >
          <Van className="h-4 w-6" />
          Add New Vehicle
        </button>
      </div>

      <dialog id="vehicleModal" className="modal">
        <div className="modal-box">
          <div className="mb-7">
            <h1 className="text-2xl font-bold ">Add Vehicle</h1>
            <p className="text-gray-600 text-sm ">Create your vehicle here!</p>
          </div>
          <form onSubmit={handleSubmit(createVehicle)} method="dialog">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById("vehicleModal").close()}
            >
              ✕
            </button>
            <div class="relative z-0  mb-3 group">
              <fieldset className="fieldset">
                <legend className="fieldset-legendc">Vehicle Name</legend>
                <input
                  type="text"
                  className={`input w-full ${errors.vehicleName ? "border-red-500" : ""}`}
                  placeholder="Type here"
                  {...register("vehicleName")}
                />
                {errors.vehicleName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.vehicleName.message}
                  </p>
                )}
              </fieldset>
            </div>
            <div class="grid md:grid-cols-2 md:gap-6">
              <div class="relative z-0 w-full mb-4 group">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Required Covered</legend>
                  <input
                    type="text"
                    className={`input ${errors.requiredCovered ? "border-red-500" : ""}`}
                    placeholder="Type here"
                    {...register("requiredCovered")}
                  />
                  {errors.requiredCovered && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.requiredCovered.message}
                    </p>
                  )}
                </fieldset>
              </div>
              <div class="relative z-0 w-full mb-4 group">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Plate Number</legend>
                  <input
                    type="text"
                    className={`input ${errors.plateNumber ? "border-red-500" : ""}`}
                    placeholder="Type here"
                    {...register("plateNumber")}
                  />
                  {errors.plateNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.plateNumber.message}
                    </p>
                  )}
                </fieldset>
              </div>
            </div>
            <div class="grid md:grid-cols-2 md:gap-6">
              <div class="relative z-0 w-full mb-5 group">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Policy ID</legend>
                  <input
                    type="text"
                    className={`input ${errors.policyID ? "border-red-500" : ""}`}
                    placeholder="Type here"
                    {...register("policyID")}
                  />
                  {errors.policyID && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.policyID.message}
                    </p>
                  )}
                </fieldset>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Policy Number</legend>
                  <input
                    type="text"
                    className={`input ${errors.policyNumber ? "border-red-500" : ""}`}
                    placeholder="Type here"
                    {...register("policyNumber")}
                  />
                  {errors.policyNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.policyNumber.message}
                    </p>
                  )}
                </fieldset>
              </div>
            </div>

            <div class="grid md:grid-cols-2 md:gap-6">
              <div class="relative z-0 w-full mb-5 group">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Issue Date</legend>
                  <input
                    type="date"
                    className={`input ${errors.issueDate ? "border-red-500" : ""}`}
                    placeholder="Type here"
                    {...register("issueDate")}
                  />
                  {errors.issueDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.issueDate.message}
                    </p>
                  )}
                </fieldset>
              </div>
              {/* Period Covered From */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  Period Covered (From)
                </legend>
                <input
                  type="date"
                  className={`input ${errors.periodFrom ? "border-red-500" : ""}`}
                  {...register("periodFrom")}
                />
                {errors.periodFrom && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.periodFrom.message}
                  </p>
                )}
              </fieldset>

              {/* Period Covered To */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Period Covered (To)</legend>
                <input
                  type="date"
                  className={`input ${errors.periodTo ? "border-red-500" : ""}`}
                  {...register("periodTo")}
                />
                {errors.periodTo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.periodTo.message}
                  </p>
                )}
              </fieldset>
            </div>

            <div className="flex justify-center mt-3">
              <button
                type="submit"
                className="btn btn-lg w-full bg-green-600 text-white hover:bg-highlight"
                disabled={isSubmitting}
              >
                <Truck className="size-5 mr-2" />
                {isSubmitting && (
                  <span className="loading loading-spinner"></span>
                )}
                {isSubmitting ? "Creating vehicle..." : "Create Vehicle"}
              </button>
            </div>
          </form>
        </div>
      </dialog>

      <h2 className="text-2xl mt-7 font-bold mb-6">Vehicles</h2>
      <div className="bg-base-100 mt-2 border-0 ">
        <div className="overflow-x-auto rounded-lg">
          <table className="table table-zebra">
            <thead className="bg-green-600 text-white">
              <tr>
                <th>Policy ID</th>
                <th>Policy No.</th>
                <th>Vehicle</th>
                <th>Plate No.</th>
                <th>Issue Date</th>
                <th>Period Covered</th>
                <th>Required Covered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    <div className="flex flex-col justify-center items-center h-20 gap-5">
                      {loading && (
                        <span className="loading loading-spinner text-success"></span>
                      )}
                      {loading ? (
                        <p className="font-bold text-sm">Loading vehicles...</p>
                      ) : (
                        <div className="flex flex-col justify-center items-center gap-2">
                          <BeanOff className="size-12 text-red-300" />
                          <p className="font-bold text-sm text-red-300">
                            No vehicles found
                          </p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <th>{vehicle.policy_id}</th>
                    <td>{vehicle.policy_number}</td>
                    <td>{vehicle.name}</td>
                    <td>{vehicle.plate_number}</td>
                    <td>
                      {vehicle.issue_date
                        ? `${format(new Date(vehicle.issue_date), "MMM. d, yyyy")}`
                        : "N/A"}
                    </td>
                    <td>
                      {vehicle.period_from && vehicle.period_to
                        ? `${format(new Date(vehicle.period_from), "MMM. d, yyyy")} to ${format(new Date(vehicle.period_to), "MMM. d, yyyy")}`
                        : "N/A"}
                    </td>
                    <td>{vehicle.required_covered}</td>
                    <td>
                      <ul>
                        <li className="flex gap-2">
                          <button className="btn btn-square">
                            <PenLine className="h-4 w-6" />
                          </button>
                          <button className="btn btn-square">
                            <ArchiveRestore className="h-4 w-6" />
                          </button>
                        </li>
                      </ul>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
      </div>
    </main>
  );
}
