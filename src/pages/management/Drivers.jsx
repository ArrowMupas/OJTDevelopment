import {
  BeanOff,
  FilterIcon,
  Search,
  Trash2,
  Truck,
  UserPlus,
  UserXIcon,
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
    const { error } = await supabase.from("drivers").insert([
      {
        first_name: data.firstName,
        last_name: data.lastName,
      },
    ]);

    if (error) {
      toast.error("Failed to create driver");
    } else {
      toast.success("Driver created successfully!", { position: "top-center" });
      document.getElementById("driverModal")?.close();
      reset();
      fetchDrivers(search);
    }
    setIsSubmitting(false);
  };

  const [driverToDelete, setDriverToDelete] = useState(null);
  const deleteDriver = async (id) => {
    const { error } = await supabase.from("drivers").delete().eq("id", id);
    if (error) console.error(error);
    else {
      setDrivers((prev) => prev.filter((d) => d.id !== id));
      toast.success("Driver deleted successfully!");
    }
  };

  return (
    <main className="px-5 py-4 h-full pb-25 ">
      <h1 className="text-lg font-bold">Drivers</h1>
      <p className="text-gray-500 text-sm mb-6">List of drivers available</p>

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
          onClick={() => document.getElementById("driverModal").showModal()}
        >
          <UserPlus className="h-4 w-6" /> Add New Driver
        </button>
      </div>

      <dialog id="driverModal" className="modal">
        <div className="modal-box">
          <h1 className="text-2xl font-bold">Add Driver</h1>
          <p className="text-gray-600 text-sm mb-7">Create your driver here!</p>
          <form onSubmit={handleSubmit(createDriver)} method="dialog">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById("driverModal").close()}
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

            <div className="form-control w-full max-w-xs mt-4">
              <label className="label">
                <span className="label-text">Upload Vehicle Image</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <button
              type="submit"
              className="btn btn-lg w-full bg-green-600 text-white hover:bg-highlight mt-4"
              disabled={isSubmitting}
            >
              <Truck className="size-5 mr-2" />
              {isSubmitting ? "Creating driver..." : "Create Driver"}
            </button>
          </form>
        </div>
      </dialog>

      <div className=" border-0 mt-4">
        {drivers.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-40 gap-5">
            {loading ? (
              <>
                <span className="loading loading-spinner text-success"></span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {drivers.map((driver) => (
              <div
                key={driver.id}
                className="card bg-base-100 shadow border border-base-300"
              >
                <figure className="px-4 pt-4">
                  <div className="w-full h-32 bg-linear-to-r from-emerald-100 to-green-200 rounded-xl flex items-center justify-center">
                    <UserXIcon className="size-12 text-gray-300 rounded-full" />
                  </div>
                </figure>

                <div className="card-body p-5 pt-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="card-title text-lg font-bold">
                        {driver.first_name} {driver.last_name}
                      </h2>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setDriverToDelete(driver);
                          document
                            .getElementById("deleteDriverModal")
                            .showModal();
                        }}
                        className="btn btn-ghost btn-square btn-sm text-error"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
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
                if (driverToDelete) {
                  await deleteDriver(driverToDelete.id);
                }
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
