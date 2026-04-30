import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OurInput from "../components/OurInput";

import { voucherSchema } from "../schemas/voucherSchema";

export default function PaymentEntryPage() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <main className="min-h-screen space-y-4 px-5 py-4 pb-10">
      <div>
        <h1 className="text-lg font-bold">Payments</h1>
        <p className="text-sm text-gray-500">
          Input and manage payment vouchers
        </p>
      </div>

      <div className="flex flex-col gap-2 md:flex-row">
        <div className="card bg-base-100 w-full border border-gray-200 p-6 shadow-xl md:w-2/5">
          <h2 className="text-lg font-bold">Payment Entry Form</h2>
          <p className="text-sm text-gray-500">
            Fill in the details to create a new payment voucher
          </p>

          <form
            onSubmit={handleSubmit(createVoucher)}
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
              {/* Transaction Type */}
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend text-sm">
                  Transaction Type
                </legend>
                <select
                  className="select select-bordered w-full"
                  {...register("transactionType")}
                >
                  <option value="">Select</option>
                  <option>Reimbursement</option>
                  <option>Insurance</option>
                  <option>Fuel Service</option>
                  <option>Registration</option>
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
              placeholder="67.67"
              step="0.01"
              register={register}
              error={errors.amount}
            />

            {/* Particulars */}
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

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-success w-full text-white"
            >
              {isSubmitting ? "Saving..." : "Submit"}
            </button>
          </form>
        </div>

        <div className="card bg-base-100 w-full p-6 shadow-xl md:w-3/5">
          <h2 className="mb-4 text-xl font-bold">Voucher History</h2>

          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <span className="loading loading-infinity text-success"></span>
            </div>
          ) : vouchers.length === 0 ? (
            <p className="text-gray-500">No vouchers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Control No</th>
                    <th>Payee</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {vouchers.map((v) => (
                    <tr key={v.id}>
                      <td>{v.control_no}</td>
                      <td>{v.payee_name}</td>
                      <td>{v.transaction_type}</td>
                      <td>{v.date}</td>
                      <td>
                        {Number(v.amount).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
