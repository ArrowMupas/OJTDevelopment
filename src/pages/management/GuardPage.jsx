import {
  BeanOff,
  Search,
  UserPlus,
  Mail,
  Phone,
  Pencil,
  Trash2,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useMemo } from "react";
import debounce from "lodash.debounce";
import { staffSchema } from "../../schemas/staffSchema";

export default function Staff() {
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const cleanFirstName = (name = "") => {
    return name.replace(/^(SG|LG|DC|SIC|SO)\s*/i, "").trim();
  };

  const fetchGuards = async (searchTerm = "") => {
    setLoading(true);
    let query = supabase
      .from("guard")
      .select("*")
      .order("last_name", { ascending: true });

    if (searchTerm) {
      query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;
    if (error) toast.error("Error loading guards");
    else setGuards(data);
    setLoading(false);
  };

  const debouncedSearch = useMemo(() => debounce((v) => fetchGuards(v), 400), []);

  useEffect(() => {
    fetchGuards();
  }, []);

  const uploadFile = async (file) => {
    if (!file) return null;
    const ext = file.name.split(".").pop();
    const filePath = `guard-images/${Math.random().toString(36).substring(2)}_${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("NEAMotorpoolBucket").upload(filePath, file);
    if (error) return null;
    const { data } = supabase.storage.from("NEAMotorpoolBucket").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const { register, handleSubmit, reset, setValue } = useForm({
    resolver: zodResolver(staffSchema),
  });

  // --- CRUD FUNCTIONS ---

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let imageUrl = data.image_url || null;
      if (selectedFile) {
        imageUrl = await uploadFile(selectedFile);
      }

      const payload = {
        first_name: data.firstName,
        last_name: data.lastName,
        middle_initial: data.middleInitial,
        email: data.email,
        contact_number: data.contact,
        image_url: imageUrl,
      };

      if (isEditing) {
        // UPDATE
        const { error } = await supabase
          .from("guard")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Guard updated!");
      } else {
        // CREATE
        const { error } = await supabase.from("guard").insert([payload]);
        if (error) throw error;
        toast.success("Guard added!");
      }

      closeModal();
      fetchGuards(search);
    } catch (err) {
      toast.error(isEditing ? "Update failed" : "Addition failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (guard) => {
    setIsEditing(true);
    setEditingId(guard.id);
    
    // Fill the form fields
    setValue("firstName", guard.first_name);
    setValue("lastName", guard.last_name);
    setValue("middleInitial", guard.middle_initial);
    setValue("email", guard.email);
    setValue("contact", guard.contact_number);
    
    document.getElementById("driverModal").showModal();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this guard?")) return;

    try {
      const { error } = await supabase.from("guard").delete().eq("id", id);
      if (error) throw error;
      toast.success("Guard removed");
      setGuards(guards.filter((g) => g.id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const closeModal = () => {
    reset();
    setIsEditing(false);
    setEditingId(null);
    setSelectedFile(null);
    document.getElementById("driverModal")?.close();
  };

  return (
    <main className="h-full space-y-4 px-3 py-4 pb-25 sm:px-5">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-lg font-bold">
          Guard On Duty
          <div className="badge badge-info badge-outline">{guards.length}</div>
        </h1>
      </div>

      <div className="flex flex-wrap justify-between gap-3">
        <label className="input input-neutral flex items-center gap-2 w-full sm:w-auto">
          <Search size={18} />
          <input
            type="text"
            className="grow"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debouncedSearch(e.target.value);
            }}
            placeholder="Search guards..."
          />
        </label>

        <button
          className="btn btn-primary text-white w-full sm:w-auto"
          onClick={() => {
            setIsEditing(false);
            reset();
            document.getElementById("driverModal").showModal();
          }}
        >
          <UserPlus size={18} /> Add Guard
        </button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <span className="loading loading-infinity loading-lg text-success"></span>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
          {guards.map((guard) => {
            const cleanFirst = cleanFirstName(guard.first_name);
            const mI = guard.middle_initial ? ` ${guard.middle_initial.replace(/\./g, "")}.` : "";
            const fullName = `${guard.last_name}, ${cleanFirst}${mI}`;

            return (
              <div key={guard.id} className="card bg-base-100 shadow-md border border-base-200 overflow-hidden">
                <figure className="px-4 pt-4">
                  <div className="aspect-square w-full rounded-2xl bg-success/20 flex items-center justify-center overflow-hidden">
                    {guard.image_url ? (
                      <img src={guard.image_url} alt={fullName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-success/40 text-6xl font-bold italic">{guard.last_name[0]}</div>
                    )}
                  </div>
                </figure>

                <div className="card-body p-4 gap-1">
                  <h2 className="card-title text-base leading-tight truncate">{fullName}</h2>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-xs opacity-70">
                      <Mail size={14} className="text-success flex-shrink-0" />
                      <span className="truncate">{guard.email || "No email"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-70">
                      <Phone size={14} className="text-success flex-shrink-0" />
                      <span>{guard.contact_number || "no number yet."}</span>
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-4 pt-2 border-t border-base-200">
                    <button onClick={() => handleEdit(guard)} className="btn btn-ghost btn-sm text-primary">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(guard.id)} className="btn btn-ghost btn-sm text-error">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      <dialog id="driverModal" className="modal">
        <div className="modal-box max-w-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="text-xl font-bold text-center">
              {isEditing ? "Edit Guard Details" : "Add New Guard"}
            </h2>
            <div className="grid grid-cols-3 gap-2">
              <input {...register("firstName")} placeholder="First Name" className="input input-bordered w-full" />
              <input {...register("middleInitial")} placeholder="M.I." className="input input-bordered w-full" maxLength={2} />
              <input {...register("lastName")} placeholder="Last Name" className="input input-bordered w-full" />
      
            </div>
            <input {...register("email")} placeholder="Email Address" className="input input-bordered w-full" />
            <input {...register("contact")} placeholder="Contact Number" className="input input-bordered w-full" />
            
            <div className="form-control">
              <label className="label-text mb-1 block font-medium">
                {isEditing ? "Change Image (Optional)" : "Upload Image"}
              </label>
              <input type="file" accept="image/*" className="file-input file-input-bordered w-full" onChange={(e) => setSelectedFile(e.target.files[0])} />
            </div>

            <div className="modal-action">
              <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn btn-primary text-white" disabled={isSubmitting}>
                {isSubmitting ? <span className="loading loading-spinner"></span> : (isEditing ? "Update Guard" : "Save Guard")}
              </button>
            </div>
          </form>
        </div>
        <div className="modal-backdrop" onClick={closeModal}><button>close</button></div>
      </dialog>
    </main>
  );
}