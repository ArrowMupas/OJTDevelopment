import {
  BeanOff,
  FilterIcon,
  Search,
  Trash2,
  Truck,
  UserPlus,
  UserXIcon,
  Pencil,
  Mail,
  Phone,
  IdCard,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState, useMemo } from "react";
import debounce from "lodash.debounce";
import OurInput from "../../components/OurInput";

const driverSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  contact: z.string().min(7, "Contact number must be at least 7 digits"),
});

export default function MaintenancePage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchDrivers = async (searchTerm = "") => {
    setLoading(true);

    let query = supabase
      .from("drivers")
      .select("*")
      .order("first_name", { ascending: true });

    if (searchTerm) {
      query = query.or(
        `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`,
      );
    }

    const { data, error } = await query;

    if (error) console.error(error);
    else setDrivers(data);

    setLoading(false);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        if (!value) fetchDrivers("");
        else fetchDrivers(value);
      }, 400),
    [],
  );

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [licenseFile, setLicenseFile] = useState(null);
  const [licenseBack, setLicenseBack] = useState(null);

  const uploadFile = async (file) => {
    try {
      if (!file) return null;

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `driver-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("NEAMotorpoolBucket")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("NEAMotorpoolBucket")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
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
    resolver: zodResolver(driverSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createDriver = async (data) => {
    setIsSubmitting(true);
    setUploading(true);

    try {
      const imageUrl = selectedFile ? await uploadFile(selectedFile) : null;
      const licenseUrl = licenseFile ? await uploadFile(licenseFile) : null;
      const licenseBackUrl = licenseBack ? await uploadFile(licenseBack) : null;

      const { error } = await supabase.from("drivers").insert([
        {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          contact_number: data.contact,
          image_url: imageUrl,
          license_url: licenseUrl,
          license_back: licenseBackUrl,
        },
      ]);

      if (error) toast.error("Failed to create driver");
      else {
        toast.success("Driver created successfully!", {
          position: "top-center",
        });
        document.getElementById("driverModal")?.close();
        reset();
        setSelectedFile(null);
        setLicenseFile(null);
        setLicenseBack(null);
        fetchDrivers(search);
      }
    } catch (error) {
      toast.error("An error occurred while creating driver");
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [driverToEdit, setDriverToEdit] = useState(null);

  const updateDriver = async (data) => {
    if (!driverToEdit) return;

    setIsSubmitting(true);
    setUploading(true);

    try {
      const imageUrl = selectedFile
        ? await uploadFile(selectedFile)
        : driverToEdit.image_url;
      const licenseUrl = licenseFile
        ? await uploadFile(licenseFile)
        : driverToEdit.license_url;
      const licenseBackUrl = licenseBack
        ? await uploadFile(licenseBack)
        : driverToEdit.license_back;

      const { error } = await supabase
        .from("drivers")
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          contact_number: data.contact,
          image_url: imageUrl,
          license_url: licenseUrl,
          license_back: licenseBackUrl,
        })
        .eq("id", driverToEdit.id);

      if (error) toast.error("Failed to update driver");
      else {
        toast.success("Driver updated successfully!");
        document.getElementById("driverModal")?.close();
        reset();
        setSelectedFile(null);
        setLicenseFile(null);
        setLicenseBack(null);
        setDriverToEdit(null);
        setIsEditing(false);
        fetchDrivers(search);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating driver");
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };

  const [driverToDelete, setDriverToDelete] = useState(null);
  const deleteDriver = async (id) => {
    const driver = drivers.find((d) => d.id === id);
    if (driver?.image_url) {
      const filePath = driver.image_url.split("/").slice(-2).join("/");
      await supabase.storage.from("NEAMotorpoolBucket").remove([filePath]);
    }
    if (driver?.license_url) {
      const filePath = driver.license_url.split("/").slice(-2).join("/");
      await supabase.storage.from("NEAMotorpoolBucket").remove([filePath]);
    }
    if (driver?.license_back) {
      const filePath = driver.license_back.split("/").slice(-2).join("/");
      await supabase.storage.from("NEAMotorpoolBucket").remove([filePath]);
    }

    const { error } = await supabase.from("drivers").delete().eq("id", id);
    if (error) console.error(error);
    else {
      setDrivers((prev) => prev.filter((d) => d.id !== id));
      toast.success("Driver deleted successfully!");
    }
  };

  const [driverToView, setDriverToView] = useState(null);

  return (
    <main className="px-3 py-4 sm:px-5  h-full pb-25 ">
      <h1 className="text-lg font-bold flex items-center gap-2">
        Drivers
        <div className="badge badge-outline badge-info">{drivers.length}</div>
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        All the staff are listed here
      </p>

      <div className="gap-3 flex justify-between">
        <div className="flex gap-2">
          <label className="input input-neutral">
            <Search className="h-4 w-6" />
            <input
              type="search"
              placeholder="Search drivers..."
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
              className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow-sm"
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
          className="btn btn-soft btn-info"
          onClick={() => {
            setIsEditing(false);
            setDriverToEdit(null);
            reset({ firstName: "", lastName: "", email: "", contact: "" });
            setSelectedFile(null);
            setLicenseFile(null);
            setLicenseBack(null);
            document.getElementById("driverModal").showModal();
          }}
        >
          <UserPlus className="h-4 w-6" /> Add New Staff
        </button>
      </div>

      <dialog id="driverModal" className="modal">
        <div className="modal-box">
          <h1 className="text-2xl font-bold">
            {isEditing ? "Update Driver" : "Add Driver"}
          </h1>
          <p className="text-gray-600 text-sm mb-7">
            {isEditing
              ? "Edit driver details below."
              : "Create your driver here!"}
          </p>
          <form
            onSubmit={handleSubmit(isEditing ? updateDriver : createDriver)}
          >
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => {
                document.getElementById("driverModal").close();
                setSelectedFile(null);
                setLicenseFile(null);
                setLicenseBack(null);
                setIsEditing(false);
                setDriverToEdit(null);
                reset();
              }}
            >
              ✕
            </button>
            <div className="grid md:grid-cols-2 md:gap-6">
              <OurInput
                label="First Name"
                name="firstName"
                register={register}
                error={errors.firstName}
              />
              <OurInput
                label="Last Name"
                name="lastName"
                register={register}
                error={errors.lastName}
              />
            </div>
            <OurInput
              label="Email"
              name="email"
              register={register}
              error={errors.email}
            />

            <OurInput
              label="Contact No."
              name="contact"
              register={register}
              error={errors.contact}
            />
            <div className="form-control w-full mt-3">
              <label className="label">
                <span className="fieldset-legend text-sm">
                  Upload Driver Image
                </span>
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

            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="fieldset-legend text-sm">
                  Upload License Image
                </span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setLicenseFile(e.target.files[0])}
              />
              {licenseFile && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {licenseFile.name}
                </p>
              )}
            </div>

            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="fieldset-legend text-sm">
                  Upload License Back Image
                </span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setLicenseBack(e.target.files[0])}
              />
              {licenseBack && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {licenseBack.name}
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
                ? "Uploading files..."
                : isSubmitting
                  ? isEditing
                    ? "Updating driver..."
                    : "Creating driver..."
                  : isEditing
                    ? "Update Driver"
                    : "Create Driver"}
            </button>
          </form>
        </div>
      </dialog>

      <dialog id="licenseModal" className="modal">
        <div className="modal-box">
          <h2 className="text-xl font-bold text-center mb-4">Driver License</h2>
          {driverToView?.license_url ? (
            <div>
              <img
                src={driverToView.license_url}
                alt={`${driverToView.first_name} License`}
                className="w-full max-h-125 object-contain"
              />
              <img
                src={driverToView.license_back}
                alt={`${driverToView.first_name} License`}
                className="w-full max-h-125 object-contain"
              />
            </div>
          ) : (
            <p className="text-center text-gray-500">No license uploaded.</p>
          )}
          <div className="modal-action justify-center">
            <button
              className="btn btn-ghost"
              onClick={() => {
                document.getElementById("licenseModal").close();
                setDriverToView(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>

      <div className="border-0 mt-4">
        {drivers.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-40 gap-5">
            {loading ? (
              <>
                <span className="loading loading-infinity text-success"></span>
                <p className="font-bold text-sm">Loading drivers...</p>
              </>
            ) : (
              <>
                <BeanOff className="size-12 text-red-300" />
                <p className="font-bold text-sm text-red-300">
                  No drivers found
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1 md:gap-2 ">
            {drivers.map((driver) => (
              <div key={driver.id} className="card bg-base-100 shadow ">
                <figure className="px-7 pt-5">
                  <div className="w-full h-38 bg-linear-to-r from-emerald-100 to-green-200 rounded-xl flex items-center justify-center overflow-hidden aspect-auto">
                    {driver.image_url ? (
                      <img
                        src={driver.image_url}
                        alt={`${driver.first_name} ${driver.last_name}`}
                        className="w-full h-full object-cover aspect-auto"
                      />
                    ) : (
                      <UserXIcon className="size-12 text-gray-300" />
                    )}
                  </div>
                </figure>

                <div className="card-body p-4 pt-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="card-title text-sm font-bold truncate">
                        {driver.first_name} {driver.last_name}
                      </h2>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Mail className="size-4 text-green-700" />
                    <p className="text-gray-500 text-xs ">{driver.email}</p>
                  </div>

                  <div className="flex gap-2">
                    <Phone className="size-4 text-green-700" />
                    <p className="text-gray-500 text-xs ">
                      {driver.contact_number || "no number yet."}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap ml-1 ">
                  <button
                    onClick={() => {
                      setDriverToView(driver);
                      document.getElementById("licenseModal").showModal();
                    }}
                    className="btn btn-ghost btn-square btn-sm text-yellow-500"
                  >
                    <IdCard className="h-4 w-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                      setDriverToEdit(driver);

                      reset({
                        firstName: driver.first_name,
                        lastName: driver.last_name,
                        email: driver.email || "",
                        contact: driver.contact_number || "",
                      });

                      setSelectedFile(null);
                      setLicenseFile(null);
                      document.getElementById("driverModal").showModal();
                    }}
                    className="btn btn-ghost btn-square btn-sm text-blue-500"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDriverToDelete(driver);
                      document.getElementById("deleteDriverModal").showModal();
                    }}
                    className="btn btn-ghost btn-square btn-sm text-error"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <dialog id="deleteDriverModal" className="modal">
        <div className="modal-box">
          <h2 className="text-xl font-bold text-center">Delete Driver</h2>

          <p className="text-center mt-3">
            Are you sure you want to delete{" "}
            <span className="font-bold">
              {driverToDelete?.first_name} {driverToDelete?.last_name}
            </span>
            ?
          </p>

          <div className="modal-action justify-center mt-6">
            <button
              className="btn btn-error text-white"
              onClick={async () => {
                if (driverToDelete) await deleteDriver(driverToDelete.id);
                document.getElementById("deleteDriverModal").close();
                setDriverToDelete(null);
              }}
            >
              Yes, Delete
            </button>

            <button
              className="btn btn-ghost"
              onClick={() => {
                document.getElementById("deleteDriverModal").close();
                setDriverToDelete(null);
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
