import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import {
  ArchiveRestore,
  FilterIcon,
  PenLine,
  Search,
  Truck,
  UserPlus,
  UserRoundX,
} from "lucide-react";

const driverSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.email({ message: "Please enter a valid email" }),
  phone: z.string().optional(),
});

export default function MaintenancePage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDrivers() {
      setLoading(true);
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setDrivers(data);
      }
      setLoading(false);
    }
    fetchDrivers();
  }, []);

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
        email: data.email,
        contact_number: data.phone,
      },
    ]);

    if (error) {
      toast.error("Failed to create driver");
    } else {
      toast.success("Driver created successfully!", {
        position: "top-center",
      });
      document.getElementById("driverModal")?.close();
      reset();
    }

    setIsSubmitting(false);
  };

  return (
    <main className="p-8 h-full">
      <h1 className="text-4xl font-bold ">Driver Maintenance</h1>
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
            className="btn  bg-green-600 text-white"
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
          onClick={() => document.getElementById("driverModal").showModal()}
        >
          <UserPlus className="h-4 w-6" />
          Add New Driver
        </button>
      </div>

      <dialog id="driverModal" className="modal">
        <div className="modal-box">
          <h1 className="text-2xl font-bold ">Add Driver</h1>
          <p className="text-gray-600 text-sm mb-7">Create your driver here!</p>
          <form onSubmit={handleSubmit(createDriver)} method="dialog">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById("driverModal").close()}
            >
              ✕
            </button>
            <div class="grid md:grid-cols-2 md:gap-6">
              <div class="relative z-0 w-full mb-4 group">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">First Name</legend>
                  <input
                    type="text"
                    className={`input ${errors.firstName ? "border-red-500" : ""}`}
                    placeholder="Type here"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </fieldset>
              </div>
              <div class="relative z-0 w-full mb-4 group">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Last Name</legend>
                  <input
                    type="text"
                    className={`input  ${errors.lastName ? "border-red-500" : ""}`}
                    placeholder="Type here"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1 ">
                      {errors.lastName.message}
                    </p>
                  )}{" "}
                </fieldset>
              </div>
            </div>
            <div class="relative z-0 w-116 mb-4 group">
              <fieldset className="fieldset">
                <legend className="fieldset-legendc">Contact Number</legend>
                <input
                  type="text"
                  className={`input w-full ${errors.phone ? "border-red-500" : ""}`}
                  placeholder="Type here"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}{" "}
              </fieldset>
            </div>
            <div class="relative z-0 w-116 mb-4 group">
              <fieldset className="fieldset">
                <legend className="fieldset-legendc">Email</legend>
                <input
                  type="text"
                  className={`input w-full ${errors.email ? "border-red-500" : ""}`}
                  placeholder="Type here"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}{" "}
              </fieldset>
            </div>
            {/* <div class="relative z-0 w-116 mb-4 group">
              <fieldset className="fieldset">
                <legend className="fieldset-legendc">Password</legend>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Type here"
                />
                <p className="label">Optional</p>
              </fieldset>
            </div> */}

            <button
              type="submit"
              className="btn btn-lg bg-green-600 text-white hover:bg-highlight hover:text-white transition w-full mt-4 "
              disabled={isSubmitting}
            >
              <Truck className="size-5 mr-2" />
              {isSubmitting && (
                <span className="loading loading-spinner"></span>
              )}
              {isSubmitting ? "Creating driver..." : "Create Driver"}
            </button>
          </form>
        </div>
      </dialog>

      <h2 className="text-2xl mt-7 font-bold mb-6">Drivers</h2>
      <div className="bg-base-100 mt-2 border-0">
        <div className="overflow-x-auto rounded-lg">
          <table className="table table-zebra ">
            <thead className="bg-green-600 text-white ">
              <tr>
                <th>Driver ID</th>
                <th>Image</th>
                <th>Fullname</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    <div className="flex flex-col justify-center items-center h-20 gap-5">
                      {loading && (
                        <span className="loading loading-spinner text-success"></span>
                      )}
                      {loading ? (
                        <p className="font-bold text-sm">Loading drivers...</p>
                      ) : (
                        <div className="flex flex-col justify-center items-center gap-2">
                          <UserRoundX className="size-12 text-red-300" />
                          <p className="font-bold text-sm text-red-300">
                            No drivers found
                          </p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                drivers.map((driver) => (
                  <tr key={driver.id}>
                    <th>{driver.id}</th>
                    <td>
                      <img
                        src={
                          driver.image_url ||
                          "https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/placeholder.png"
                        }
                        alt={`${driver.first_name} ${driver.last_name}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td>
                      {driver.first_name} {driver.last_name}
                    </td>
                    <td>{driver.email}</td>
                    <td>{driver.contact_number}</td>
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
          </table>
        </div>
      </div>
    </main>
  );
}
