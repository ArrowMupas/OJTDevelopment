import {
  BeanOff,
  FilterIcon,
  Search,
  Trash2,
  Truck,
  Van,
  Pencil,
  Newspaper,
  NewspaperIcon,
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
import { Link } from "react-router-dom";

const vehicleSchema = z
  .object({
    vehicleName: z
      .string()
      .min(2, "Vehicle name must be at least 2 characters"),
    plateNumber: z
      .string()
      .min(2, "Plate number must be at least 2 characters"),
    engineNumber: z
      .string()
      .min(2, "Engine number must be at least 2 characters"),
    chassisNumber: z
      .string()
      .min(2, "Chassis number must be at least 2 characters"),
    fileNumber: z.string().min(2, "File number must be at least 2 characters"),
    yearModel: z.string().min(2, "Year model must be at least 2 characters"),
    paymentValidUntil: z.string().min(1, "Payment valid until required"),
    renewalFrom: z.string().min(1, "Renewal start required"),
    renewalTo: z.string().min(1, "Renewal end required"),
  })
  .refine((data) => new Date(data.renewalTo) >= new Date(data.renewalFrom), {
    message: "Renewal To must be after Renewal From",
    path: ["renewalTo"],
  });

export default function RegistrationPage() {
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
        `name.ilike.%${searchTerm}%,plate_number.ilike.%${searchTerm}%`,
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
      const fileName = `${Math.random()
        .toString(36)
        .substring(2, 15)}_${Date.now()}.${fileExt}`;

      const filePath = `vehicle-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("NEAMotorpoolBucket")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

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
      }

      const { error } = await supabase.from("vehicles").insert([
        {
          name: data.vehicleName,
          plate_number: data.plateNumber,
          engine_number: data.engineNumber,
          chassis_number: data.chassisNumber,
          file_number: data.fileNumber,
          year_model: data.yearModel,
          payment_valid_until: data.paymentValidUntil,
          renewal_from: data.renewalFrom,
          renewal_to: data.renewalTo,
          image_url: imageUrl,
        },
      ]);

      if (error) {
        toast.error("Failed to create registration: " + error.message);
      } else {
        toast.success("Vehicle registration created successfully!");
        document.getElementById("vehicleModal")?.close();
        reset();
        setSelectedFile(null);
        fetchVehicles(search);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating registration");
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
          engine_number: data.engineNumber,
          chassis_number: data.chassisNumber,
          file_number: data.fileNumber,
          year_model: data.yearModel,
          payment_valid_until: data.paymentValidUntil,
          renewal_from: data.renewalFrom,
          renewal_to: data.renewalTo,
          image_url: imageUrl,
        })
        .eq("id", vehicleToEdit.id);

      if (error) {
        toast.error("Failed to update registration");
      } else {
        toast.success("Vehicle registration updated!");
        document.getElementById("vehicleModal").close();
        reset();
        setSelectedFile(null);
        setVehicleToEdit(null);
        setIsEditing(false);
        fetchVehicles(search);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating registration");
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
      <p className="text-gray-500 text-sm mb-6">List of registered vehicles</p>

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
          </div>
        </div>

        <div>
          <Link to="/vehicles">
            <button className="btn btn-outline btn-neutral mr-3 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all">
              <NewspaperIcon className="h-4 w-6" /> View Insurance
            </button>
          </Link>

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
            <Van className="h-4 w-6" /> Add Registration
          </button>
        </div>
      </div>

      {/* MODAL FORM */}

      <dialog id="vehicleModal" className="modal">
        <div className="modal-box max-w-3xl">
          <h1 className="text-2xl font-bold">
            {isEditing
              ? "Update Vehicle Registration"
              : "Add Vehicle Registration"}
          </h1>

          <form
            onSubmit={handleSubmit(isEditing ? updateVehicle : createVehicle)}
          >
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

            <div className="grid md:grid-cols-2 md:gap-6 mt-4">
              <OurInput
                label="File Number"
                name="fileNumber"
                register={register}
                error={errors.fileNumber}
              />

              <OurInput
                label="Year Model"
                name="yearModel"
                register={register}
                error={errors.yearModel}
              />
            </div>

            <div className="grid md:grid-cols-3 md:gap-6 mt-4">
              <input
                type="month"
                className="input input-bordered"
                {...register("paymentValidUntil")}
              />

              <input
                type="date"
                className="input input-bordered"
                {...register("renewalFrom")}
              />

              <input
                type="date"
                className="input input-bordered"
                {...register("renewalTo")}
              />
            </div>

            <button
              type="submit"
              className="btn btn-lg w-full bg-green-600 text-white mt-4"
            >
              <Truck className="size-5 mr-2" />
              {isEditing ? "Update Registration" : "Create Registration"}
            </button>
          </form>
        </div>
      </dialog>

      {/* VEHICLE CARDS */}

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <h2 className="card-title text-lg font-bold">
                    {vehicle.name}
                  </h2>

                  <div className="space-y-2 mt-2">
                    <p>
                      <b>Plate No.</b> {vehicle.plate_number}
                    </p>
                    <p>
                      <b>Engine No.</b> {vehicle.engine_number}
                    </p>
                    <p>
                      <b>Chassis No.</b> {vehicle.chassis_number}
                    </p>
                    <p>
                      <b>File No.</b> {vehicle.file_number}
                    </p>
                    <p>
                      <b>Year Model</b> {vehicle.year_model}
                    </p>

                    <div className="divider"></div>

                    {/* <p>
                      <b>Payment Valid Until:</b>{" "}
                      {vehicle.payment_valid_until || "N/A"}
                    </p> */}

                    <p>
                      <b>Period Duration:</b>{" "}
                      {vehicle.renewal_from && vehicle.renewal_to
                        ? `${format(
                            new Date(vehicle.renewal_from),
                            "MMM d, yyyy",
                          )} - ${format(
                            new Date(vehicle.renewal_to),
                            "MMM d, yyyy",
                          )}`
                        : "N/A"}
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setVehicleToEdit(vehicle);

                        reset({
                          vehicleName: vehicle.name,
                          plateNumber: vehicle.plate_number,
                          engineNumber: vehicle.engine_number,
                          chassisNumber: vehicle.chassis_number,
                          fileNumber: vehicle.file_number,
                          yearModel: vehicle.year_model,
                          paymentValidUntil: vehicle.payment_valid_until,
                          renewalFrom: vehicle.renewal_from,
                          renewalTo: vehicle.renewal_to,
                        });

                        document.getElementById("vehicleModal").showModal();
                      }}
                      className="btn btn-ghost btn-square btn-sm text-blue-500"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => deleteVehicle(vehicle.id)}
                      className="btn btn-ghost btn-square btn-sm text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
