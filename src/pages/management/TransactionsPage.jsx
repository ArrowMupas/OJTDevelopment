import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OurInput from "../../components/OurInput";
import { voucherSchema } from "../../schemas/voucherSchema";
import { Info, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function PaymentEntryPage() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [deletingVoucher, setDeletingVoucher] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(voucherSchema),
  });

  const fetchVouchers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("vouchers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load vouchers");
      console.error(error);
    } else {
      setVouchers(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const createVoucher = async (data) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("vouchers").insert([
        {
          control_no: data.controlNo,
          payee_name: data.payeeName,
          transaction_type: data.transactionType,
          particulars: data.particulars,
          amount: data.amount,
          date: data.date,
        },
      ]);

      if (error) throw error;

      toast.success("Voucher saved!");
      reset();
      fetchVouchers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save voucher");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateVoucher = async (data) => {
    if (!editingVoucher) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("vouchers")
        .update({
          control_no: data.controlNo,
          payee_name: data.payeeName,
          transaction_type: data.transactionType,
          particulars: data.particulars,
          amount: data.amount,
          date: data.date,
        })
        .eq("id", editingVoucher.id);

      if (error) throw error;

      toast.success("Voucher updated!");
      setEditingVoucher(null);
      reset();
      fetchVouchers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update voucher");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (voucher) => {
    setEditingVoucher(voucher);

    reset({
      controlNo: voucher.control_no,
      payeeName: voucher.payee_name,
      transactionType: voucher.transaction_type,
      particulars: voucher.particulars,
      amount: voucher.amount,
      date: voucher.date,
    });
  };

  const handleDelete = async () => {
    if (!deletingVoucher) return;

    try {
      const { error } = await supabase
        .from("vouchers")
        .delete()
        .eq("id", deletingVoucher.id);

      if (error) throw error;

      toast.success("Voucher deleted");
      setDeletingVoucher(null);
      fetchVouchers();
      document.getElementById("delete_modal").close();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  return (
    <main className="min-h-screen space-y-4 px-5 py-4 pb-10">
      <div>
        <h1 className="text-lg font-bold">Payments</h1>
        <p className="text-sm text-gray-500">
          Input and manage payment vouchers
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        {/* FORM */}
        <div className="card bg-base-100 h-full w-full border border-gray-200 p-6 shadow-sm md:w-1/3">
          <h2 className="text-lg font-bold">
            {editingVoucher ? "Edit Voucher" : "Payment Entry Form"}
          </h2>
          <p className="text-sm text-gray-500">
            {editingVoucher
              ? "Edit the details of the selected voucher"
              : "Enter the details of the new payment voucher"}
          </p>

          <form
            onSubmit={handleSubmit(
              editingVoucher ? updateVoucher : createVoucher,
            )}
            className="mt-4 space-y-2"
          >
            <div className="flex gap-2">
              <OurInput
                label="Control No."
                name="controlNo"
                register={register}
                error={errors.controlNo}
              />
              <OurInput
                label="Date"
                name="date"
                type="date"
                register={register}
                error={errors.date}
              />
            </div>

            <div className="flex gap-2">
              <OurInput
                label="Payee Name"
                name="payeeName"
                register={register}
                error={errors.payeeName}
              />

              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend text-sm">
                  Transaction Type
                </legend>
                <select
                  className="select select-bordered w-full"
                  {...register("transactionType")}
                >
                  <option value="">Select</option>
                  <option>Fuel Service</option>
                  <option>Insurance</option>
                  <option>Registration</option>
                  <option>Reimbursement</option>
                  <option>Service Center</option>
                </select>
                {errors.transactionType && (
                  <p className="text-error text-xs">
                    {errors.transactionType.message}
                  </p>
                )}
              </fieldset>
            </div>

            <OurInput
              label="Amount"
              name="amount"
              type="number"
              step="0.01"
              register={register}
              error={errors.amount}
            />

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-sm">Particulars</legend>
              <textarea
                className="textarea textarea-bordered w-full"
                {...register("particulars")}
              />
              {errors.particulars && (
                <p className="text-error text-xs">
                  {errors.particulars.message}
                </p>
              )}
            </fieldset>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn admin-btn mt-2 w-full text-white"
            >
              {isSubmitting
                ? "Saving..."
                : editingVoucher
                  ? "Update Payment"
                  : "Submit Payment"}
            </button>

            {/* CANCEL EDIT */}
            {editingVoucher && (
              <button
                type="button"
                onClick={() => {
                  setEditingVoucher(null);
                  reset({
                    controlNo: "",
                    payeeName: "",
                    transactionType: "",
                    particulars: "",
                    amount: "",
                    date: "",
                  });
                }}
                className="btn w-full"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* TABLE */}
        <div className="card bg-base-100 w-full border border-gray-200 p-4 shadow-sm md:w-2/3">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <span className="loading loading-infinity text-success"></span>
            </div>
          ) : vouchers.length === 0 ? (
            <p className="text-gray-500">No vouchers found.</p>
          ) : (
            <div className="h-screen overflow-x-auto bg-white">
              <table className="table-pin-rows table">
                <thead>
                  <tr>
                    <th>Control No</th>
                    <th>Payee</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {vouchers.map((v) => (
                    <tr key={v.id} className="hover:bg-green-50">
                      <td className="truncate text-xs">{v.control_no}</td>
                      <td className="font-bold">{v.payee_name}</td>
                      <td>
                        <div className="badge badge-sm badge-soft badge-neutral">
                          {v.transaction_type}
                        </div>
                      </td>
                      <td className="truncate">
                        {v.date ? format(new Date(v.date), "MMM d, yyyy") : "-"}
                      </td>
                      <td className="text-success">
                        {Number(v.amount).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="flex gap-1">
                        <div
                          className="tooltip tooltip-left tooltip-succes"
                          data-tip={v.particulars || "None"}
                        >
                          <button className="btn btn-sm btn-square">
                            <Info className="size-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleEdit(v)}
                          className="btn btn-square text-info btn-sm"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingVoucher(v);
                            document.getElementById("delete_modal").showModal();
                          }}
                          className="btn btn-square text-error btn-sm"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-error text-lg font-bold">Delete Voucher</h3>

          <p className="py-4">Are you sure you want to delete this voucher?</p>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={() => setDeletingVoucher(null)}>
                Cancel
              </button>
            </form>

            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-error text-white"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </dialog>
    </main>
  );
}
