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
  CircleStar,
  Scroll,
  ClockCheck,
  Users,
  CaptionsOff,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState, useMemo } from "react";
import debounce from "lodash.debounce";
import OurInput from "../../components/OurInput";
import { ReactImageMagnifier } from "react-image-magnify-lib";

// Driver schema for input validation
const driverSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  designation: z.string().min(2, "Designation must be at least 2 characters"),
  email: z.email("Invalid email address"),
  contact: z.string().min(7, "Contact number must be at least 7 digits"),
});

export default function MaintenancePage() {
  // Driver fetch states
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Driver fetch with searching
  const fetchDrivers = async (searchTerm = "") => {
    // Start loading
    setLoading(true);

    // Query supabase
    let query = supabase
      .from("drivers")
      .select("*")
      .order("first_name", { ascending: true });

    // If searching only fetch ones matching the search
    if (searchTerm) {
      query = query.or(
        `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`,
      );
    }

    // Get data and save it to state or error if there's error
    const { data, error } = await query;
    if (error) console.error(error);
    else setDrivers(data);

    // End loading
    setLoading(false);
  };

  // The fetching of data is delayed while user is still typing on search
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        if (!value) fetchDrivers("");
        else fetchDrivers(value);
      }, 400),
    [],
  );

  // Fetch the drivers at page load
  useEffect(() => {
    fetchDrivers();
  }, []);

  // Cleanup of debounce
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
          designation: data.designation,
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
          designation: data.designation,
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
    <main className="px-3 py-4 sm:px-5  h-full pb-25 space-y-7">
      <div>
        <h1 className="text-lg font-bold flex items-center gap-2">
          Staff
          <div className="badge badge-outline badge-info">{drivers.length}</div>
        </h1>
        <p className="text-gray-500 text-sm">All the staff are listed here</p>
      </div>

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

          {/* <div className="dropdown">
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
          </div> */}
        </div>

        <button
          className="btn  btn-info text-white font-bold"
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

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-2 w-full ">
        <div className="stat bg-base-100 shadow rounded-md">
          <div className="stat-figure">
            <CircleStar className="h-8 w-12 text-yellow-500" />
          </div>
          <div className="stat-title">Average Rating</div>
          <div className="stat-value text-yellow-500">1.6</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-md">
          <div className="stat-figure">
            <Scroll className="h-8 w-12 text-green-600" />
          </div>
          <div className="stat-title">Total Survey</div>
          <div className="stat-value text-green-600">10</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-md">
          <div className="stat-figure">
            <ClockCheck className="h-8 w-12 text-yellow-600" />
          </div>
          <div className="stat-title">On-Time Rate</div>
          <div className="stat-value text-yellow-600">94%</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-md">
          <div className="stat-figure">
            <Users className="h-8 w-12 text-green-600" />
          </div>
          <div className="stat-title">Active Drivers</div>
          <div className="stat-value text-green-600">11</div>
        </div>
      </div>

      <dialog id="driverModal" className="modal">
        <div className="modal-box">
          <h1 className="text-2xl font-bold">
            {isEditing ? "Update Driver" : "Add Staff"}
          </h1>
          <p className="text-gray-600 text-sm">
            {isEditing
              ? "Edit driver details below."
              : "Create your staff here!"}
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
            <div className="grid md:grid-cols-2 md:gap-4">
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
              label="Designation"
              name="designation"
              register={register}
              error={errors.designation}
            />

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

            <div className="space-y-4">
              <div className="form-control w-full ">
                <label className="label">
                  <span className="fieldset-legend text-sm">
                    Upload Staff Image
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full text-xs"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>

              <div className="form-control w-full ">
                <label className="label">
                  <span className="fieldset-legend text-sm">
                    Upload License Image
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full text-xs"
                  onChange={(e) => setLicenseFile(e.target.files[0])}
                />
              </div>

              <div className="form-control w-full ">
                <label className="label">
                  <span className="fieldset-legend text-sm">
                    Upload License Back Image
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full text-xs"
                  onChange={(e) => setLicenseBack(e.target.files[0])}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-lg w-full bg-green-600 text-white hover:bg-highlight mt-4 "
              disabled={isSubmitting || uploading}
            >
              <Truck className="size-5 mr-2" />
              {isSubmitting
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
          <div className="">
            <h2 className="text-lg font-bold">Drivers License</h2>
            <p className="text-gray-500 text-sm">
              Hover on the image to magnify
            </p>
          </div>
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => {
              document.getElementById("licenseModal").close();
              setDriverToView(null);
            }}
          >
            ✕
          </button>
          {driverToView?.license_url ? (
            <div className="space-y-2 overflow-hidden p-2">
              <ReactImageMagnifier
                smallImageSrc={driverToView.license_url}
                largeImageSrc={driverToView.license_url} // Use high-res if available
                magnifierHeight={200}
                magnifierWidth={200}
                zoomLevel={3}
                alt="Driver License"
              />

              <ReactImageMagnifier
                smallImageSrc={driverToView.license_back}
                largeImageSrc={driverToView.license_back} // Use high-res if available
                magnifierHeight={200}
                magnifierWidth={200}
                zoomLevel={3}
                alt="Driver Back"
              />
            </div>
          ) : (
            <div className="p-4  flex justify-center items-center flex-col">
              <CaptionsOff className="size-8 text-error" />
              <p className="text-center text-gray-500 text-sm">
                No license uploaded yet.
              </p>
            </div>
          )}
        </div>
      </dialog>

      <div className="border-0 ">
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
                <figure className="px-4 pt-5">
                  <div className="w-full h-38 bg-linear-to-r from-emerald-100 to-green-200 rounded-xl flex items-center justify-center overflow-hidden   aspect-auto">
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
                      <p className="capitalize">{driver.designation}</p>
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
                        designation: driver.designation,
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
