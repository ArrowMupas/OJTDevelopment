import { Search, UserPlus, Mail, Phone, Pencil, Trash2 } from "lucide-react";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useMemo } from "react";
import debounce from "lodash.debounce";
import OurInput from "../../components/OurInput";
import { guardSchema } from "../../schemas/guardSchema";

export default function Guards() {
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [guardToEdit, setGuardToEdit] = useState(null);
  const [guardToDelete, setGuardToDelete] = useState(null);

  const fetchGuards = async (searchTerm = "") => {
    setLoading(true);

    let query = supabase
      .from("guard")
      .select("*")
      .order("last_name", { ascending: true });

    if (searchTerm) {
      query = query.or(
        `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`,
      );
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Failed to load guards");
      console.error(error);
    } else {
      setGuards(data);
    }

    setLoading(false);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        fetchGuards(value);
      }, 400),
    [],
  );

  useEffect(() => {
    fetchGuards();
    return () => debouncedSearch.cancel();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(guardSchema),
  });

  const createGuard = async (data) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("guard").insert([
        {
          first_name: data.firstName,
          last_name: data.lastName,
          middle_initial: data.middleInitial,
          role: data.role,
          email: data.email,
          contact_number: data.contact,
        },
      ]);

      if (error) throw error;

      toast.success("Guard added successfully!");
      closeModal();
      fetchGuards(search);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add guard");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateGuard = async (data) => {
    if (!guardToEdit) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("guard")
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          middle_initial: data.middleInitial,
          role: data.role,
          email: data.email,
          contact_number: data.contact,
        })
        .eq("id", guardToEdit.id);

      if (error) throw error;

      toast.success("Guard updated successfully!");
      closeModal();
      fetchGuards(search);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteGuard = async (id) => {
    const { error } = await supabase.from("guard").delete().eq("id", id);

    if (error) {
      toast.error("Delete failed");
    } else {
      setGuards((prev) => prev.filter((g) => g.id !== id));
      toast.success("Guard deleted");
      setGuardToDelete(null);
    }
  };

  const handleEdit = (guard) => {
    setIsEditing(true);
    setGuardToEdit(guard);

    setValue("firstName", guard.first_name);
    setValue("lastName", guard.last_name);
    setValue("middleInitial", guard.middle_initial);
    setValue("email", guard.email);
    setValue("contact", guard.contact_number);
    setValue("role", guard.role);

    document.getElementById("guardModal").showModal();
  };

  const closeModal = () => {
    reset();
    setIsEditing(false);
    setGuardToEdit(null);
    document.getElementById("guardModal")?.close();
  };

  return (
    <main className="h-full space-y-4 px-3 py-4 pb-25 sm:px-5">
      {/* HEADER */}

      <div className="flex justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="flex items-center gap-2 text-lg font-bold">
            Guards
            <div className="badge badge-info badge-outline">
              {guards.length}
            </div>
          </h1>
          <p className="text-sm text-gray-500">Manage your guards here</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="input input-neutral flex items-center gap-2">
            <Search size={18} />
            <input
              value={search}
              placeholder="Search guards..."
              onChange={(e) => {
                setSearch(e.target.value);
                debouncedSearch(e.target.value);
              }}
            />
          </label>
          <button
            className="btn btn-primary text-white"
            onClick={() => {
              setIsEditing(false);
              reset();
              document.getElementById("guardModal").showModal();
            }}
          >
            <UserPlus size={18} /> Add Guard
          </button>
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <span className="loading loading-infinity text-success"></span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6">
          {guards.map((guard) => (
            <div
              key={guard.id}
              className="card border-base-200 bg-base-100 border shadow"
            >
              <div className="card-body p-3">
                <div className="flex items-center gap-2">
                  <div className="badge badge-soft badge-sm badge-neutral font-bold italic">
                    {guard.role}
                  </div>
                  <h2 className="text-sm font-bold">
                    {guard.last_name}, {guard.first_name}{" "}
                    {guard.middle_initial && `${guard.middle_initial}.`}
                  </h2>
                </div>

                <div className="space-y-1 text-xs opacity-70">
                  <div className="flex items-center gap-2">
                    <Mail size={14} />
                    {guard.email || "No email"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    {guard.contact_number || "No contact"}
                  </div>
                </div>

                <div className="card-actions mt-2 justify-end">
                  <button
                    className="btn btn-square btn-sm text-info"
                    onClick={() => handleEdit(guard)}
                  >
                    <Pencil className="size-4" />
                  </button>

                  <button
                    className="btn btn-square btn-sm text-error"
                    onClick={() => {
                      setGuardToDelete(guard);
                      document.getElementById("deleteModal").showModal();
                    }}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <dialog id="guardModal" className="modal">
        <div className="modal-box">
          <h1 className="text-xl font-bold">
            {isEditing ? "Update Guard" : "Add Guard"}
          </h1>
          <p className="text-sm text-gray-500">
            Insert the guard and their current role
          </p>

          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
            onClick={closeModal}
          >
            ✕
          </button>

          <form
            onSubmit={handleSubmit(isEditing ? updateGuard : createGuard)}
            className="mt-4 space-y-2"
          >
            <div className="flex gap-2">
              <OurInput
                label="First Name"
                name="firstName"
                register={register}
                error={errors.firstName}
              />
              <OurInput
                label="Middle Initial"
                name="middleInitial"
                register={register}
                error={errors.middleInitial}
              />
              <OurInput
                label="Last Name"
                name="lastName"
                register={register}
                error={errors.lastName}
              />
            </div>

            <OurInput
              label="Role"
              name="role"
              register={register}
              error={errors.role}
            />

            <OurInput
              label="Email"
              name="email"
              register={register}
              error={errors.email}
            />

            <OurInput
              label="Contact"
              name="contact"
              register={register}
              error={errors.contact}
            />

            <div className="modal-action">
              <button
                type="submit"
                className="btn admin-btn btn-block"
                disabled={isSubmitting}
              >
                {isEditing ? "Update Guard" : "Create Guard"}
              </button>
            </div>
          </form>
        </div>

        <div className="modal-backdrop" onClick={closeModal} />
      </dialog>

      {/* Delete Confirmation Modal */}
      <dialog id="deleteModal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Confirm Delete</h3>
          <p className="py-4">
            Are you sure you want to delete{" "}
            <span className="font-bold">
              {guardToDelete?.last_name}, {guardToDelete?.first_name}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => document.getElementById("deleteModal").close()}
            >
              Cancel
            </button>
            <button
              className="btn btn-error text-white"
              onClick={() => {
                if (guardToDelete) {
                  deleteGuard(guardToDelete.id);
                }
                document.getElementById("deleteModal").close();
              }}
            >
              Delete
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </main>
  );
}
