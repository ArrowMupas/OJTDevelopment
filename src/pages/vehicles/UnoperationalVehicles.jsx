import {
  BeanOff,
  FilterIcon,
  Search,
  Trash2,
  Truck,
  Van,
  Pencil,
  ClipboardClock,
  ClipboardX,
  Activity,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import OurInput from "../../components/OurInput";
import { motion, AnimatePresence } from "framer-motion";
import { vehicleSchema } from "../../schemas/vehicleSchema";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function UnoperationalVehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchVehicles = async (searchTerm = "") => {
    setLoading(true);

    let query = supabase
      .from("vehicles")
      .select("*")
      .eq("operational", false)
      .order("period_to", { ascending: true });

    const searchColumns = [
      "name",
      "plate_number",
      "policy_number",
      "policy_id",
      "engine_number",
      "chassis_number",
      "file_number",
    ];

    if (searchTerm) {
      let orQueryParts = searchColumns.map(
        (field) => `${field}.ilike.%${searchTerm}%`,
      );

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

  const { stats, vehiclesWithStatus } = useMemo(() => {
    const today = new Date();

    let insuranceExpired = 0;
    let insuranceExpiring = 0;
    let registrationExpired = 0;
    let registrationExpiring = 0;

    const enrichedVehicles = (vehicles || []).map((v) => {
      const periodTo = v.period_to ? new Date(v.period_to) : null;
      const periodDurationTo = v.period_duration_to
        ? new Date(v.period_duration_to)
        : null;

      let status = "valid";
      if (periodTo) {
        const diff = Math.ceil((periodTo - today) / (1000 * 60 * 60 * 24));
        if (diff < 0) {
          status = "expired";
          insuranceExpired++;
        } else if (diff <= 90) {
          status = "warning";
          insuranceExpiring++;
        }
      }

      let status2 = "valid";
      if (periodDurationTo) {
        const diff = Math.ceil(
          (periodDurationTo - today) / (1000 * 60 * 60 * 24),
        );
        if (diff < 0) {
          status2 = "expired";
          registrationExpired++;
        } else if (diff <= 90) {
          status2 = "warning";
          registrationExpiring++;
        }
      }

      return { ...v, status, status2 };
    });

    return {
      stats: {
        insuranceExpired,
        insuranceExpiring,
        registrationExpired,
        registrationExpiring,
      },
      vehiclesWithStatus: enrichedVehicles,
    };
  }, [vehicles]);

  const uploadFile = async (file) => {
    try {
      if (!file) return null;

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `vehicle-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("NEAMotorpoolBucket")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from("NEAMotorpoolBucket")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload image");
      return null;
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);

  const updateVehicle = async (data) => {
    if (!vehicleToEdit) return;

    setIsSubmitting(true);
    setUploading(true);

    try {
      let imageUrl = vehicleToEdit.image_url;

      if (selectedFile) {
        imageUrl = await uploadFile(selectedFile);
      }

      const { error } = await supabase
        .from("vehicles")
        .update({
          name: data.vehicleName,
          plate_number: data.plateNumber,
          policy_number: data.policyNumber,
          policy_id: data.policyID,
          required_covered: data.requiredCovered,
          issue_date: data.issueDate,
          period_from: data.periodFrom,
          period_to: data.periodTo,
          image_url: imageUrl,
          engine_number: data.engineNumber,
          chassis_number: data.chassisNumber,
          file_number: data.fileNumber,
          year_model: data.yearModel,
          period_duration: data.periodDuration,
          period_duration_to: data.periodDurationTo,
        })
        .eq("id", vehicleToEdit.id);

      if (error) {
        toast.error("Failed to update vehicle");
      } else {
        toast.success("Vehicle updated successfully!");
        document.getElementById("vehicleModal")?.close();
        reset();
        setSelectedFile(null);
        setVehicleToEdit(null);
        setIsEditing(false);
        fetchVehicles(search);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating vehicle");
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };

  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  const deleteVehicle = async (id) => {
    const vehicle = vehicles.find((v) => v.id === id);
    if (vehicle?.image_url) {
      const filePath = vehicle.image_url.split("/").slice(-2).join("/");
      await supabase.storage.from("NEAMotorpoolBucket").remove([filePath]);
    }

    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) console.error(error);
    else {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      toast.success("Vehicle deleted successfully!");
    }
  };

  const [vehicleToToggle, setVehicleToToggle] = useState(null);
  const toggleOperational = async (vehicle) => {
    const { error } = await supabase
      .from("vehicles")
      .update({ operational: !vehicle.operational })
      .eq("id", vehicle.id);

    if (error) {
      toast.error("Failed to update operational status");
    } else {
      toast.success("Operational status updated");
      fetchVehicles(search);
    }
  };

  return (
    <main className="h-full space-y-7 px-3 py-4 pb-25 sm:px-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-square btn-warning btn-dash h-auto"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold">Unoperational Vehicles</h1>
            <p className="text-sm text-gray-500">
              View the unoperational vehicles available in the system
            </p>
          </div>
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          <label className="input input-neutral flex w-full items-center">
            <Search className="mr-1 h-4 w-6" />
            <input
              type="search"
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                debouncedSearch(value);
              }}
              className="w-full sm:w-auto"
            />
          </label>

          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn flex items-center gap-1 bg-green-600 text-white"
            >
              <FilterIcon className="h-4 w-6" /> Filter
            </div>
            <ul
              tabIndex="-1"
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li className="focus:bg-highlight rounded-sm">
                <a className="active:bg-highlight">Ascending</a>
              </li>
              <li>
                <a className="active:bg-highlight">Descending</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid w-full grid-cols-2 gap-1 sm:gap-2 md:grid-cols-2 lg:grid-cols-4">
        <div className="stat bg-base-100 rounded-md shadow">
          <div className="stat-figure">
            <ClipboardClock className="text-warning h-8 w-12" />
          </div>
          <div className="stat-title">Insurance Expiring</div>
          <div className="stat-value text-warning">
            {stats.insuranceExpiring}
          </div>
        </div>

        <div className="stat bg-base-100 rounded-md shadow">
          <div className="stat-figure">
            <ClipboardX className="text-error h-8 w-12" />
          </div>
          <div className="stat-title">Insurance Expired</div>
          <div className="stat-value text-error">{stats.insuranceExpired}</div>
        </div>

        <div className="stat bg-base-100 rounded-md shadow">
          <div className="stat-figure">
            <ClipboardClock className="text-warning h-8 w-12" />
          </div>
          <div className="stat-title">Registration Expiring</div>
          <div className="stat-value text-warning">
            {stats.registrationExpiring}
          </div>
        </div>

        <div className="stat bg-base-100 rounded-md shadow">
          <div className="stat-figure">
            <ClipboardX className="text-error h-8 w-12" />
          </div>
          <div className="stat-title">Registration Expired</div>
          <div className="stat-value text-error">
            {stats.registrationExpired}
          </div>
        </div>
      </div>

      <dialog id="vehicleModal" className="modal">
        <div className="modal-box max-w-3xl">
          <h1 className="text-2xl font-bold">Update Vehicle</h1>
          <p className="mb-7 text-sm text-gray-500">
            Edit vehicle details below.
          </p>
          <form onSubmit={handleSubmit(updateVehicle)}>
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
              onClick={() => {
                document.getElementById("vehicleModal").close();
                setSelectedFile(null);
                setIsEditing(false);
                setVehicleToEdit(null);
                reset();
              }}
            >
              ✕
            </button>

            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-500">
                Vehicle Information
              </h3>

              <div className="grid gap-5 md:grid-cols-2">
                <OurInput
                  label="Vehicle Name"
                  name="vehicleName"
                  register={register}
                  error={errors.vehicleName}
                />

                <OurInput
                  label="Plate Number"
                  name="plateNumber"
                  register={register}
                  error={errors.plateNumber}
                />
              </div>
            </div>

            <div className="divider my-2"></div>

            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-500">
                Insurance Details
              </h3>

              <div className="grid gap-5 md:grid-cols-2">
                <OurInput
                  label="Policy ID"
                  name="policyID"
                  register={register}
                  error={errors.policyID}
                />

                <OurInput
                  label="Policy Number"
                  name="policyNumber"
                  register={register}
                  error={errors.policyNumber}
                />
              </div>

              <div className="mt-4">
                <OurInput
                  label="Required Covered"
                  name="requiredCovered"
                  register={register}
                  error={errors.requiredCovered}
                />
              </div>
            </div>

            <div className="divider my-2"></div>

            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-500">
                Vehicle Registration
              </h3>

              <div className="grid gap-5 md:grid-cols-2">
                <OurInput
                  label="Engine Number"
                  name="engineNumber"
                  register={register}
                  error={errors.engineNumber}
                />

                <OurInput
                  label="Chassis Number"
                  name="chassisNumber"
                  register={register}
                  error={errors.chassisNumber}
                />
              </div>

              <div className="mt-4 grid gap-5 md:grid-cols-3">
                <OurInput
                  label="File Number"
                  name="fileNumber"
                  register={register}
                  error={errors.fileNumber}
                />

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Year Model</span>
                  </label>
                  <input
                    type="date"
                    className={`input input-bordered w-full ${errors.yearModel ? "input-error" : ""}`}
                    {...register("yearModel")}
                  />
                  {errors.yearModel && (
                    <p className="text-error mt-1 text-sm">
                      {errors.yearModel.message}
                    </p>
                  )}
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Period Duration</span>
                  </label>
                  <input
                    type="date"
                    className={`input input-bordered w-full ${errors.periodDuration ? "input-error" : ""}`}
                    {...register("periodDuration")}
                  />
                  {errors.periodDuration && (
                    <p className="text-error mt-1 text-sm">
                      {errors.periodDuration.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Period Duration To</span>
                  </label>
                  <input
                    type="date"
                    className={`input input-bordered w-full ${errors.periodDurationTo ? "input-error" : ""}`}
                    {...register("periodDurationTo")}
                  />
                  {errors.periodDurationTo && (
                    <p className="text-error mt-1 text-sm">
                      {errors.periodDurationTo.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="divider my-2"></div>

            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-500">
                Insurance Period
              </h3>

              <div className="grid gap-5 md:grid-cols-3">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Issue Date</span>
                  </label>
                  <input
                    type="date"
                    className={`input input-bordered w-full ${errors.issueDate ? "input-error" : ""}`}
                    {...register("issueDate")}
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Period From</span>
                  </label>
                  <input
                    type="date"
                    className={`input input-bordered w-full ${errors.periodFrom ? "input-error" : ""}`}
                    {...register("periodFrom")}
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Period To</span>
                  </label>
                  <input
                    type="date"
                    className={`input input-bordered w-full ${errors.periodTo ? "input-error" : ""}`}
                    {...register("periodTo")}
                  />
                </div>
              </div>
            </div>

            <div className="divider my-2"></div>

            {/* IMAGE */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-500">
                Vehicle Image
              </h3>

              <div className="form-control w-full">
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />

                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-lg hover:bg-highlight w-full bg-green-600 text-white"
              disabled={isSubmitting || uploading}
            >
              <Truck className="mr-2 size-5" />
              {isSubmitting ? "Updating vehicle..." : "Update Vehicle"}
            </button>
          </form>
        </div>
      </dialog>

      <div className="">
        {vehicles.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-5">
            {loading ? (
              <>
                <span className="loading loading-spinner text-success"></span>
                <p className="text-sm font-bold">Loading vehicles...</p>
              </>
            ) : (
              <>
                <BeanOff className="text-error size-12" />
                <p className="text-error text-sm font-bold">
                  No vehicles found
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-0.5 sm:gap-2 lg:grid-cols-3 xl:grid-cols-4">
            {vehiclesWithStatus.map((vehicle) => {
              return (
                <div
                  key={vehicle.id}
                  className="card bg-base-100 border-base-300 relative border shadow"
                >
                  <div className="absolute top-1 right-1 flex flex-col items-end gap-1">
                    {vehicle.status === "warning" && (
                      <div className="badge badge-sm badge-warning text-xs">
                        Insurance expiring
                      </div>
                    )}
                    {vehicle.status === "expired" && (
                      <div className="badge badge-sm badge-error text-xs">
                        Insurance expired
                      </div>
                    )}
                    {vehicle.status2 === "warning" && (
                      <div className="badge badge-sm badge-warning text-xs">
                        Registration expiring
                      </div>
                    )}
                    {vehicle.status2 === "expired" && (
                      <div className="badge badge-sm badge-error text-xs">
                        Registration expired
                      </div>
                    )}
                  </div>

                  <figure className="px-4 pt-4">
                    {vehicle.image_url ? (
                      <div className="h-24 w-full sm:h-42">
                        <img
                          src={vehicle.image_url}
                          alt={vehicle.name}
                          className="h-full w-full rounded-xl object-fill"
                        />
                      </div>
                    ) : (
                      <div className="flex h-24 w-full items-center justify-center overflow-hidden rounded-xl bg-indigo-100 sm:h-42">
                        <Van className="size-12 text-gray-300" />
                      </div>
                    )}
                  </figure>
                  <div className="card-body p-5 pt-2">
                    <div className="mt-0 flex flex-col items-start justify-between sm:mt-2 sm:flex-row">
                      <h2 className="text-sm font-bold sm:text-base">
                        {vehicle.name}
                      </h2>
                      <div className="badge badge-dash badge-primary badge-xs sm:badge-sm text-xs">
                        {vehicle.plate_number}
                      </div>
                    </div>

                    <div className="relative space-y-2">
                      <div className="space-y-1 sm:space-y-2">
                        <div>
                          <span className="text-xs text-gray-500">
                            Policy ID
                          </span>
                          <p className="text-xs sm:text-sm">
                            {vehicle.policy_id || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">
                            Policy No.
                          </span>
                          <p className="text-xs sm:text-sm">
                            {vehicle.policy_number || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">
                            Issue Date
                          </span>
                          <p className="text-sm">
                            {vehicle.issue_date
                              ? format(
                                  new Date(vehicle.issue_date),
                                  "MMM. d, yyyy",
                                )
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">
                            Required Covered
                          </span>
                          <p className="text-sm">{vehicle.required_covered}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">
                            Period Covered
                          </span>
                          <p
                            className={`text-sm ${
                              vehicle.status === "expired"
                                ? "text-error font-semibold"
                                : vehicle.status === "warning"
                                  ? "text-warning font-semibold"
                                  : ""
                            }`}
                          >
                            {vehicle.period_from && vehicle.period_to ? (
                              <div className="flex flex-col">
                                <div>
                                  {format(
                                    new Date(vehicle.period_from),
                                    "MMM. d, yyyy",
                                  )}
                                  {" - "}
                                  {format(
                                    new Date(vehicle.period_to),
                                    "MMM. d, yyyy",
                                  )}
                                </div>
                              </div>
                            ) : (
                              "N/A"
                            )}
                          </p>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs text-gray-500">
                          Engine No.
                        </span>
                        <p className="text-xs sm:text-sm">
                          {vehicle.engine_number || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-xs text-gray-500">
                          Chassis No.
                        </span>
                        <p className="text-xs sm:text-sm">
                          {vehicle.chassis_number || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-xs text-gray-500">File No.</span>
                        <p className="text-xs sm:text-sm">
                          {vehicle.file_number || "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-xs text-gray-500">
                          Year Model
                        </span>
                        <p className="text-sm">
                          {vehicle.year_model
                            ? format(new Date(vehicle.year_model), "yyyy")
                            : "N/A"}
                        </p>
                      </div>

                      <div>
                        <span className="text-xs text-gray-500">
                          Period Duration
                        </span>
                        <p
                          className={`text-sm ${
                            vehicle.status2 === "expired"
                              ? "text-error font-semibold"
                              : vehicle.status2 === "warning"
                                ? "text-warning font-semibold"
                                : ""
                          }`}
                        >
                          {format(
                            new Date(vehicle.period_duration),
                            "MMM. d, yyyy",
                          )}
                          {" - "}
                          {format(
                            new Date(vehicle.period_duration),
                            "MMM. d, yyyy",
                          )}
                        </p>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setVehicleToEdit(vehicle);
                            reset({
                              vehicleName: vehicle.name,
                              plateNumber: vehicle.plate_number,
                              policyID: vehicle.policy_id,
                              policyNumber: vehicle.policy_number,
                              requiredCovered: vehicle.required_covered,
                              issueDate: vehicle.issue_date,
                              periodFrom: vehicle.period_from,
                              periodTo: vehicle.period_to,
                              engineNumber: vehicle.engine_number,
                              chassisNumber: vehicle.chassis_number,
                              fileNumber: vehicle.file_number,
                              yearModel: vehicle.year_model,
                              periodDuration: vehicle.period_duration,
                              periodDurationTo: vehicle.period_duration_to,
                            });
                            setSelectedFile(null);
                            document.getElementById("vehicleModal").showModal();
                          }}
                          className="btn btn-ghost btn-square btn-sm text-blue-500"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => {
                            setVehicleToDelete(vehicle);
                            document
                              .getElementById("deleteVehicleModal")
                              .showModal();
                          }}
                          className="btn btn-ghost btn-square btn-sm text-error"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => {
                            setVehicleToToggle(vehicle);
                            document
                              .getElementById("toggleOperationalModal")
                              .showModal();
                          }}
                          className={`btn btn-ghost btn-square btn-sm ${
                            vehicle.operational
                              ? "text-warning"
                              : "text-gray-500"
                          }`}
                        >
                          <Activity className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <dialog id="toggleOperationalModal" className="modal">
        <div className="modal-box">
          <h2 className="text-center text-xl font-bold">
            {vehicleToToggle?.operational
              ? "Mark as Not Operational?"
              : "Mark as Operational?"}
          </h2>

          <p className="mt-3 text-center">
            Are you sure you want to
            {vehicleToToggle?.operational ? " deactivate " : " activate "}
            <span className="font-bold">{vehicleToToggle?.name}</span>{" "}
            <div className="badge badge-sm badge-dash badge-primary">
              {vehicleToToggle?.plate_number}
            </div>
            ?
          </p>

          <div className="modal-action mt-6 justify-center">
            <button
              className="btn btn-warning text-white"
              onClick={async () => {
                if (vehicleToToggle) {
                  await toggleOperational(vehicleToToggle);
                }
                document.getElementById("toggleOperationalModal").close();
                setVehicleToToggle(null);
              }}
            >
              Yes, Confirm
            </button>

            <button
              className="btn btn-ghost"
              onClick={() => {
                document.getElementById("toggleOperationalModal").close();
                setVehicleToToggle(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="deleteVehicleModal" className="modal">
        <div className="modal-box">
          <h2 className="text-center text-xl font-bold">Delete Vehicle</h2>

          <p className="mt-3 text-center">
            Are you sure you want to delete{" "}
            <span className="font-bold">
              {vehicleToDelete?.name} ({vehicleToDelete?.plate_number})
            </span>
            ?
          </p>

          <div className="modal-action mt-6 justify-center">
            <button
              className="btn btn-error text-white"
              onClick={async () => {
                if (vehicleToDelete) {
                  await deleteVehicle(vehicleToDelete.id);
                }
                document.getElementById("deleteVehicleModal").close();
                setVehicleToDelete(null);
              }}
            >
              Yes, Delete
            </button>

            <button
              className="btn btn-ghost"
              onClick={() => {
                document.getElementById("deleteVehicleModal").close();
                setVehicleToDelete(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </main>
  );
}
