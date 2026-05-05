import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";
import OurInput from "../../components/OurInput";
import { voucherSchema } from "../../schemas/voucherSchema";
import { Info, Pencil, Trash2, Search, FileArchive } from "lucide-react";
import { format } from "date-fns";
import * as XLSX from "xlsx";

export default function PaymentEntryPage() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [deletingVoucher, setDeletingVoucher] = useState(null);
  const [exporting, setExporting] = useState(false);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const PAGE_SIZE = 50;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(voucherSchema),
  });

  const fetchVouchers = async (
    searchTerm = "",
    type = "",
    start = "",
    end = "",
    pageNum = 1,
  ) => {
    setLoading(true);

    const from = (pageNum - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("vouchers")
      .select("*", { count: "exact" })
      .order("control_no", { ascending: false })
      .range(from, to);

    // Search by control number OR payee name
    if (searchTerm) {
      query = query.or(
        `control_no.ilike.%${searchTerm}%,payee_name.ilike.%${searchTerm}%`,
      );
    }

    // Filter by transaction type
    if (type) {
      query = query.eq("transaction_type", type);
    }

    // Filter by date range
    if (start) {
      query = query.gte("date", start);
    }
    if (end) {
      query = query.lte("date", end);
    }

    const { data, error, count } = await query;

    if (error) {
      toast.error("Failed to load vouchers");
      console.error(error);
    } else {
      setVouchers(data || []);
      setTotalCount(count || 0);
    }

    setLoading(false);
  };

  // Transaction types for filter dropdown
  const transactionTypes = [
    "Fuel Service",
    "Insurance",
    "Registration",
    "Reimbursement",
    "Service Center",
  ];

  useEffect(() => {
    fetchVouchers(search, filterType, filterFrom, filterTo, page);
  }, [page]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value, type, start, end) => {
        setPage(1);
        fetchVouchers(value, type, start, end, 1);
      }, 400),
    [],
  );

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

      if (error) {
        if (error.code === "23505" && error.message.includes("control_no")) {
          toast.error("Control number already exists");
          return;
        }
        throw error;
      }

      toast.success("Voucher saved!");
      reset();
      fetchVouchers(search, filterType, filterFrom, filterTo, page);
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
      fetchVouchers(search, filterType, filterFrom, filterTo, page);
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
      fetchVouchers(search, filterType, filterFrom, filterTo, page);
      document.getElementById("delete_modal").close();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setFilterType("");
    setFilterFrom("");
    setFilterTo("");
    setPage(1);
    fetchVouchers("", "", "", "", 1);
  };

  const handleExport = async () => {
    setExporting(true);

    try {
      let query = supabase
        .from("vouchers")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply current filters to export
      if (search) {
        query = query.or(
          `control_no.ilike.%${search}%,payee_name.ilike.%${search}%`,
        );
      }

      if (filterType) {
        query = query.eq("transaction_type", filterType);
      }

      if (filterFrom) {
        query = query.gte("date", filterFrom);
      }
      if (filterTo) {
        query = query.lte("date", filterTo);
      }

      const { data, error } = await query;

      if (error) {
        console.error(error);
        toast.error("Failed to export data");
        return;
      }

      const exportData = data || [];

      if (exportData.length === 0) {
        toast.error("No data to export");
        return;
      }

      // Generate report title
      let reportTitle = "Payment Vouchers Report";

      if (filterFrom && filterTo) {
        const start = new Date(filterFrom);
        const end = new Date(filterTo);
        const sameDay = filterFrom === filterTo;

        if (sameDay) {
          reportTitle += ` for ${format(start, "MMMM d, yyyy")}`;
        } else {
          reportTitle += ` from ${format(start, "MMMM d")} to ${format(
            end,
            "MMMM d, yyyy",
          )}`;
        }
      } else if (filterFrom) {
        reportTitle += ` starting ${format(
          new Date(filterFrom),
          "MMMM d, yyyy",
        )}`;
      } else if (filterTo) {
        reportTitle += ` up to ${format(new Date(filterTo), "MMMM d, yyyy")}`;
      }

      if (filterType) {
        reportTitle += ` - Type: ${filterType}`;
      }

      if (search) {
        reportTitle += ` (Search: "${search}")`;
      }

      // Prepare data for Excel
      const sheetData = [
        [reportTitle],
        [],
        [
          "Control No.",
          "Payee Name",
          "Transaction Type",
          "Amount (PHP)",
          "Date",
          "Date Created",
        ],
        ...exportData.map((voucher) => [
          voucher.control_no,
          voucher.payee_name,
          voucher.transaction_type,
          voucher.amount
            ? Number(voucher.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : "0.00",
          voucher.date ? format(new Date(voucher.date), "MMM d, yyyy") : "-",
          voucher.created_at
            ? format(new Date(voucher.created_at), "MMM d, yyyy hh:mm a")
            : "-",
        ]),
      ];

      // Add summary at the bottom
      const totalAmount = exportData.reduce(
        (sum, v) => sum + (Number(v.amount) || 0),
        0,
      );

      sheetData.push([], ["Report Summary"]);
      sheetData.push(["Total Vouchers:", exportData.length]);
      sheetData.push([
        "Total Amount:",
        `PHP ${totalAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      ]);
      sheetData.push([
        "Generated On:",
        format(new Date(), "MMMM d, yyyy hh:mm a"),
      ]);

      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

      // Set column widths
      worksheet["!cols"] = [
        { wch: 20 }, // Control No.
        { wch: 35 }, // Payee Name
        { wch: 20 }, // Transaction Type
        { wch: 15 }, // Amount
        { wch: 15 }, // Date
        { wch: 25 }, // Date Created
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Payment Vouchers");

      const fileName = `payment_vouchers_${format(
        new Date(),
        "yyyyMMdd_HHmmss",
      )}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast.success(`Exported ${exportData.length} vouchers successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <main className="min-h-screen space-y-4 px-5 py-4 pb-25">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Payments</h1>
          <p className="text-sm text-gray-500">
            Input and manage payment vouchers
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={handleExport}
          disabled={exporting}
        >
          <FileArchive className="h-4 w-4" />
          {exporting ? "Exporting..." : "Generate Report"}
        </button>
      </div>

      <div className="flex flex-col gap-2 md:flex-row">
        {/* FORM */}
        <div className="card bg-base-100 h-full w-full border border-gray-200 p-6 shadow-xl md:w-1/3">
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
            className="mt-4 space-y-3"
          >
            <div className="flex flex-col gap-2 xl:flex-row">
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

            <div className="flex flex-col gap-2 xl:flex-row">
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
                  {transactionTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
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
                rows="3"
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
        <div className="card bg-base-100 h-screen w-full border border-gray-200 p-6 shadow-xl md:w-2/3">
          {/* FILTERS */}
          <div className="mb-4 grid gap-3 md:grid-cols-4">
            {/* Search Input */}
            <label className="input input-bordered flex w-full items-center gap-2">
              <Search className="h-4 w-4" />
              <input
                type="text"
                placeholder="Search Control No. or Payee..."
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  debouncedSearch(value, filterType, filterFrom, filterTo);
                }}
                className="grow"
              />
            </label>

            {/* Transaction Type Filter */}
            <select
              className="select select-bordered w-full"
              value={filterType}
              onChange={(e) => {
                const value = e.target.value;
                setFilterType(value);
                setPage(1);
                fetchVouchers(search, value, filterFrom, filterTo, 1);
              }}
            >
              <option value="">All Types</option>
              {transactionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* Date From */}
            <input
              type="date"
              className="input input-bordered w-full"
              placeholder="From Date"
              value={filterFrom}
              onChange={(e) => {
                const value = e.target.value;
                setFilterFrom(value);
                setPage(1);
                fetchVouchers(search, filterType, value, filterTo, 1);
              }}
            />

            {/* Date To */}
            <input
              type="date"
              className="input input-bordered w-full"
              placeholder="To Date"
              value={filterTo}
              onChange={(e) => {
                const value = e.target.value;
                setFilterTo(value);
                setPage(1);
                fetchVouchers(search, filterType, filterFrom, value, 1);
              }}
            />
          </div>

          {/* CLEAR FILTERS BUTTON */}
          {(search || filterType || filterFrom || filterTo) && (
            <div className="mb-4 flex justify-end">
              <button onClick={clearFilters} className="btn btn-error btn-sm">
                Clear All Filters
              </button>
            </div>
          )}

          {/* TABLE */}
          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <span className="loading loading-infinity text-success loading-lg"></span>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white">
              <table className="table-pin-rows table-sm xl:table-md table">
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
                  {vouchers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center">
                        No vouchers found
                      </td>
                    </tr>
                  ) : (
                    vouchers.map((v) => (
                      <tr key={v.id} className="hover:bg-green-50">
                        <td className="truncate text-xs">{v.control_no}</td>
                        <td className="font-bold">{v.payee_name}</td>
                        <td>
                          <div className="badge badge-xs xl:badge-sm badge-soft badge-neutral">
                            {v.transaction_type}
                          </div>
                        </td>
                        <td className="truncate">
                          {v.date
                            ? format(new Date(v.date), "MMM d, yyyy")
                            : "-"}
                        </td>
                        <td className="text-success font-semibold">
                          ₱
                          {Number(v.amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="space-x-1">
                          <div className="flex gap-2">
                            <div
                              className="tooltip tooltip-left"
                              data-tip={
                                v.particulars || "No particulars provided"
                              }
                            >
                              <button className="btn btn-xs xl:btn-sm btn-square">
                                <Info className="size-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => handleEdit(v)}
                              className="btn btn-xs xl:btn-sm btn-square text-info"
                            >
                              <Pencil className="size-4" />
                            </button>
                            <button
                              onClick={() => {
                                setDeletingVoucher(v);
                                document
                                  .getElementById("delete_modal")
                                  .showModal();
                              }}
                              className="btn btn-xs xl:btn-sm btn-square text-error"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

                <tfoot>
                  <tr>
                    <td colSpan="3" className="py-4">
                      Total Records: {totalCount}
                    </td>
                    <td colSpan="3" className="py-4 text-right">
                      <div className="join">
                        <button
                          className="join-item btn btn-sm"
                          disabled={page === 1}
                          onClick={() => setPage((p) => p - 1)}
                        >
                          «
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .slice(Math.max(0, page - 3), page + 2)
                          .map((p) => (
                            <button
                              key={p}
                              className={`join-item btn btn-sm ${
                                p === page ? "btn-active" : ""
                              }`}
                              onClick={() => setPage(p)}
                            >
                              {p}
                            </button>
                          ))}

                        <button
                          className="join-item btn btn-sm"
                          disabled={page >= totalPages}
                          onClick={() => setPage((p) => p + 1)}
                        >
                          »
                        </button>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
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
