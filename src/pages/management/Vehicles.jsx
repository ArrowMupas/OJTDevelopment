import { BeanOff, FilterIcon, Search, Trash2, Truck, Van } from "lucide-react";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import debounce from "lodash.debounce";

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
  const [search, setSearch] = useState("");

  const fetchVehicles = async (searchTerm = "") => {
    setLoading(true);

    let query = supabase
      .from("vehicles")
      .select("*")
      .order("name", { ascending: true });

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
    () => debounce((value) => fetchVehicles(value), 400),
    [],
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  // React Hook Form setup
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

    if (error)
      toast.error("Failed to create vehicle: " + error.message, {
        position: "top-center",
      });
    else {
      toast.success("Vehicle created successfully!", {
        position: "top-center",
      });
      document.getElementById("vehicleModal")?.close();
      reset();
      fetchVehicles(search);
    }

    setIsSubmitting(false);
  };

  const deleteVehicle = async (id) => {
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) console.error(error);
    else {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      toast.success("Vehicle deleted successfully!");
    }
  };

  return (
    <main className="px-5 py-4 h-full pb-25">
      <h1 className="text-lg font-bold ">Vehicles</h1>
      <p className="text-gray-500 text-sm mb-6">List of Vehicles available</p>

      <div className="gap-3 flex justify-between">
        <div className="flex gap-2">
          {/* Search Input */}
          <label className="input input-neutral">
            <Search className="h-4 w-6" />
            <input
              type="search"
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);

                if (!value) fetchVehicles("");
                else debouncedSearch(value);
              }}
            />
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
            <div className="relative z-0  mb-3 group">
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
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-4 group">
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
              <div className="relative z-0 w-full mb-4 group">
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
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
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
              <div className="relative z-0 w-full mb-5 group">
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

            <div className="grid md:grid-cols-2 md:gap-6">
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

              <div className="relative z-0 w-full mb-5 group">
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

      <div className="bg-base-100 border-0 mt-4">
        {vehicles.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-40 gap-5">
            {loading && (
              <>
                <span className="loading loading-spinner text-success"></span>
                <p className="font-bold text-sm">Loading vehicles...</p>
              </>
            )}
            {!loading && (
              <>
                <BeanOff className="size-12 text-red-300" />
                <p className="font-bold text-sm text-red-300">
                  No vehicles found
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="card bg-base-100 shadow border border-base-300"
              >
                <figure className="px-4 pt-4">
                  <div className="w-full h-32 bg-linear-to-r from-emerald-100 to-green-200 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                      <p className="text-sm text-violet-600 font-medium mt-1">
                        Vehicle Image
                      </p>
                    </div>
                  </div>
                </figure>

                <div className="card-body p-5 pt-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="card-title text-lg font-bold">
                        {vehicle.name}
                      </h2>
                      <span className="text-gray-500 text-xs mr-2">
                        Plate Number
                      </span>
                      <div className="badge badge-dash badge-primary text-sm ">
                        {vehicle.plate_number}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {/* <button className="btn btn-ghost btn-square btn-sm">
                  <PenLine className="h-4 w-4" />
                </button> */}
                      <button
                        onClick={() => deleteVehicle(vehicle.id)}
                        className="btn btn-ghost btn-square btn-sm text-error"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500 text-xs">Policy ID</span>
                    <p className="font-medium">{vehicle.policy_id || "N/A"}</p>
                  </div>

                  <div>
                    <span className="text-gray-500 text-xs">Policy No.</span>
                    <p className="font-medium">
                      {vehicle.policy_number || "N/A"}
                    </p>
                  </div>

                  <div className="mt-2">
                    <span className="text-gray-500 text-xs">Issue Date</span>
                    <p className="text-sm">
                      {vehicle.issue_date
                        ? format(new Date(vehicle.issue_date), "MMM. d, yyyy")
                        : "N/A"}
                    </p>
                  </div>

                  <div className="mt-2">
                    <span className="text-gray-500 text-xs">
                      Period Covered
                    </span>
                    <p className="text-sm">
                      {vehicle.period_from && vehicle.period_to ? (
                        <>
                          {format(
                            new Date(vehicle.period_from),
                            "MMM. d, yyyy",
                          )}
                          {" - "}
                          {format(new Date(vehicle.period_to), "MMM. d, yyyy")}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>

                  <div className="mt-2">
                    <span className="text-gray-500 text-xs">
                      Required Covered
                    </span>
                    <p className="text-sm font-medium">
                      {vehicle.required_covered}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
