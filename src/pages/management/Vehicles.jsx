import {
  BeanOff,
  FilterIcon,
  Search,
  Trash2,
  Truck,
  Van,
  Pencil,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import OurInput from "../../components/OurInput";

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const createVehicle = async (data) => {
    setIsSubmitting(true);
    setUploading(true);

    try {
      let imageUrl = null;
      if (selectedFile) {
        imageUrl = await uploadFile(selectedFile);
        if (!imageUrl) {
          console.warn("Image upload failed, continuing without image");
        }
      }

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
          image_url: imageUrl,
        },
      ]);

      if (error) {
        toast.error("Failed to create vehicle: " + error.message);
      } else {
        toast.success("Vehicle created successfully!", {
          position: "top-center",
        });
        document.getElementById("vehicleModal")?.close();
        reset();
        setSelectedFile(null);
        fetchVehicles(search);
      }
    } catch (error) {
      console.error("Error creating vehicle:", error);
      toast.error("An error occurred while creating vehicle");
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };

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

  return (
    <main className="px-5 py-4 h-full pb-25">
      <h1 className="text-lg font-bold">Vehicles</h1>
      <p className="text-gray-500 text-sm mb-6">List of vehicles available</p>

      <div className="gap-3 flex justify-between">
        <div className="flex gap-2">
          <label className="input input-neutral">
            <Search className="h-4 w-6" />
            <input
              type="search"
              placeholder="Search vehicles..."
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

        <button
          className="btn btn-outline btn-neutral"
          onClick={() => {
            setIsEditing(false);
            setVehicleToEdit(null);
            reset({});
            setSelectedFile(null);
            document.getElementById("vehicleModal").showModal();
          }}
        >
          <Van className="h-4 w-6" /> Add New Vehicle
        </button>
      </div>

      <dialog id="vehicleModal" className="modal">
        <div className="modal-box max-w-3xl">
          <h1 className="text-2xl font-bold">
            {isEditing ? "Update Vehicle" : "Add Vehicle"}
          </h1>
          <p className="text-gray-600 text-sm mb-7">
            {isEditing
              ? "Edit vehicle details below."
              : "Create your vehicle here!"}
          </p>
          <form
            onSubmit={handleSubmit(isEditing ? updateVehicle : createVehicle)}
          >
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
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

            <div className="grid md:grid-cols-2 md:gap-6">
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

            <div className="grid md:grid-cols-2 md:gap-6 mt-4">
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

            <div className="grid md:grid-cols-3 md:gap-6 mt-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Issue Date</span>
                </label>
                <input
                  type="date"
                  className={`input input-bordered w-full ${errors.issueDate ? "input-error" : ""}`}
                  {...register("issueDate")}
                />
                {errors.issueDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.issueDate.message}
                  </p>
                )}
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
                {errors.periodFrom && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.periodFrom.message}
                  </p>
                )}
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
                {errors.periodTo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.periodTo.message}
                  </p>
                )}
              </div>
            </div>

            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text">Upload Vehicle Image</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-lg w-full bg-green-600 text-white hover:bg-highlight mt-4"
              disabled={isSubmitting || uploading}
            >
              <Truck className="size-5 mr-2" />
              {uploading
                ? "Uploading image..."
                : isSubmitting
                  ? isEditing
                    ? "Updating vehicle..."
                    : "Creating vehicle..."
                  : isEditing
                    ? "Update Vehicle"
                    : "Create Vehicle"}
            </button>
          </form>
        </div>
      </dialog>

      <div className="border-0 mt-4">
        {vehicles.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-40 gap-5">
            {loading ? (
              <>
                <span className="loading loading-spinner text-success"></span>
                <p className="font-bold text-sm">Loading vehicles...</p>
              </>
            ) : (
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
                  <div className="w-full h-32 bg-linear-to-r from-emerald-100 to-green-200 rounded-xl flex items-center justify-center overflow-hidden">
                    {vehicle.image_url ? (
                      <img
                        src={vehicle.image_url}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Van className="size-12 text-gray-300" />
                    )}
                  </div>
                </figure>

                <div className="card-body p-5 pt-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="card-title text-lg font-bold">
                        {vehicle.name}
                      </h2>
                      <div className="badge badge-dash badge-primary text-sm mt-1">
                        {vehicle.plate_number}
                      </div>
                    </div>
                    <div className="flex gap-1">
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
                    </div>
                  </div>

                  <div className="divider my-1"></div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-500 text-xs">Policy ID</span>
                      <p className="font-medium text-sm">
                        {vehicle.policy_id || "N/A"}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500 text-xs">Policy No.</span>
                      <p className="font-medium text-sm">
                        {vehicle.policy_number || "N/A"}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500 text-xs">Issue Date</span>
                      <p className="text-sm">
                        {vehicle.issue_date
                          ? format(new Date(vehicle.issue_date), "MMM. d, yyyy")
                          : "N/A"}
                      </p>
                    </div>

                    <div>
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
                            {format(
                              new Date(vehicle.period_to),
                              "MMM. d, yyyy",
                            )}
                          </>
                        ) : (
                          "N/A"
                        )}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500 text-xs">
                        Required Covered
                      </span>
                      <p className="text-sm font-medium">
                        {vehicle.required_covered}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <dialog id="deleteVehicleModal" className="modal">
        <div className="modal-box">
          <h2 className="text-xl font-bold text-center">Delete Vehicle</h2>

          <p className="text-center mt-3">
            Are you sure you want to delete{" "}
            <span className="font-bold">
              {vehicleToDelete?.name} ({vehicleToDelete?.plate_number})
            </span>
            ?
          </p>

          <div className="modal-action justify-center mt-6">
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
