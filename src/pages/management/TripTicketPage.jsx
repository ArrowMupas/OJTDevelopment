import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../supabaseClient";
import useDriverStore from "../../stores/driverStore";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";
import { format } from "date-fns";
import OurInput from "../../components/OurInput";
import { tripTicketSchema } from "../../schemas/tripTicketSchema";
import { Pencil, Trash2, Search, FileArchive, Star } from "lucide-react";
import * as XLSX from "xlsx";
import { exportTripTickets } from "../../utils/exportTripTickets";

export default function TripTicketPage() {
  const [tickets, setTickets] = useState([]);
  const { getDrivers, fetchDrivers } = useDriverStore();
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterDriver, setFilterDriver] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [deletingTicket, setDeletingTicket] = useState(null);
  const [exporting, setExporting] = useState(false);

  const PAGE_SIZE = 50;
  const drivers = getDrivers("service");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tripTicketSchema),
  });

  const fetchTickets = async (
    searchTerm = "",
    driverId = "",
    start = "",
    end = "",
    pageNum = 1,
  ) => {
    setLoading(true);

    const from = (pageNum - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("trip_tickets")
      .select(
        `
        *,
        drivers (
          id,
          first_name,
          last_name,
          middle_initial
        )
      `,
        { count: "exact" },
      )
      .order("dtt_no", { ascending: false })
      .range(from, to);

    // Search by DTT number
    if (searchTerm) {
      query = query.ilike("dtt_no", `%${searchTerm}%`);
    }

    // Filter by driver
    if (driverId) {
      query = query.eq("driver_id", parseInt(driverId));
    }

    // Filter by date range
    if (start) {
      query = query.gte("date_received", start);
    }
    if (end) {
      query = query.lte("date_received", end);
    }

    const { data, error, count } = await query;

    if (error) {
      toast.error("Failed to load tickets");
      console.error(error);
    } else {
      setTickets(data || []);
      setTotalCount(count || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTickets(search, filterDriver, filterFrom, filterTo, page);
  }, [page]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value, driverId, start, end) => {
        setPage(1);
        fetchTickets(value, driverId, start, end, 1);
      }, 400),
    [],
  );

  const createTicket = async (data) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("trip_tickets").insert([
        {
          dtt_no: data.dttNo,
          driver_id: data.driverId,
          date_received: data.dateReceived,
          time_received: data.timeReceived,
          rating: data.rating,
        },
      ]);

      if (error) {
        if (error.code === "23505" && error.message.includes("dtt_no")) {
          toast.error("DTT number already exists");
          return;
        }
        throw error;
      }

      toast.success("Trip ticket created!");
      reset();
      fetchTickets(search, filterDriver, filterFrom, filterTo, page);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTicket = async (data) => {
    if (!editingTicket) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("trip_tickets")
        .update({
          dtt_no: data.dttNo,
          driver_id: data.driverId,
          date_received: data.dateReceived,
          time_received: data.timeReceived,
          rating: data.rating,
        })
        .eq("id", editingTicket.id);

      if (error) throw error;

      toast.success("Trip ticket updated!");
      setEditingTicket(null);
      reset();
      fetchTickets(search, filterDriver, filterFrom, filterTo, page);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingTicket(item);

    reset({
      dttNo: item.dtt_no,
      driverId: item.driver_id,
      dateReceived: item.date_received,
      timeReceived: item.time_received,
      rating: item.rating,
    });
  };

  const handleDelete = async () => {
    if (!deletingTicket) return;

    try {
      const { error } = await supabase
        .from("trip_tickets")
        .delete()
        .eq("id", deletingTicket.id);

      if (error) throw error;

      toast.success("Ticket deleted!");
      setDeletingTicket(null);
      fetchTickets(search, filterDriver, filterFrom, filterTo, page);
      document.getElementById("delete_modal").close();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete ticket");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setFilterDriver("");
    setFilterFrom("");
    setFilterTo("");
    setPage(1);
    fetchTickets("", "", "", "", 1);
  };

  const handleExport = () => {
    exportTripTickets({
      search,
      filterDriver,
      filterFrom,
      filterTo,
      drivers,
      setExporting,
      toast,
    });
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const averageRating =
    tickets.length > 0
      ? (
          tickets.reduce((sum, ticket) => {
            return sum + Number(ticket.rating || 0);
          }, 0) / tickets.length
        ).toFixed(2)
      : "0.00";

  return (
    <main className="min-h-screen space-y-4 px-3 py-4 pb-25 sm:px-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Trip Ticket</h1>
          <p className="text-sm text-gray-500">Manage driver trip tickets</p>
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

      <div className="flex w-full flex-col gap-2 md:flex-row">
        {/* FORM */}
        <div className="card bg-base-100 h-full w-full border border-gray-200 p-6 shadow-sm md:w-2/7">
          <h2 className="text-lg font-semibold">
            {editingTicket ? "Edit Trip Ticket" : "Receive Trip Ticket"}
          </h2>
          <p className="text-sm text-gray-500">
            {editingTicket
              ? "Edit the details of the selected trip ticket."
              : "Fill in the details to receive a new trip ticket."}
          </p>

          <form
            onSubmit={handleSubmit(editingTicket ? updateTicket : createTicket)}
            className="mt-4 space-y-3"
          >
            <OurInput
              label="DTT No."
              name="dttNo"
              register={register}
              error={errors.dttNo}
            />

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-sm">Driver</legend>

              <select
                className="select select-bordered w-full"
                {...register("driverId", { valueAsNumber: true })}
              >
                <option value="">Select Driver</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.last_name}, {d.first_name} {d.middle_initial}
                  </option>
                ))}
              </select>

              {errors.driverId && (
                <span className="text-error text-xs">
                  {errors.driverId.message}
                </span>
              )}
            </fieldset>

            <OurInput
              label="Date"
              name="dateReceived"
              type="date"
              register={register}
              error={errors.dateReceived}
            />

            <OurInput
              label="Time"
              name="timeReceived"
              type="time"
              register={register}
              error={errors.timeReceived}
            />

            <div className="flex items-center gap-2">
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-sm">Rating</legend>
                <div className="rating rating-lg">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <input
                      key={n}
                      type="radio"
                      value={n}
                      className="mask mask-star-2 bg-green-500"
                      {...register("rating", {
                        required: "Please select a rating",
                      })}
                    />
                  ))}
                </div>
                {errors.rating && (
                  <span className="text-error mt-1 text-xs">
                    {errors.rating.message}
                  </span>
                )}
              </fieldset>
            </div>

            <button
              type="submit"
              className="btn admin-btn w-full"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : editingTicket
                  ? "Update Ticket"
                  : "Receive Ticket"}
            </button>

            {editingTicket && (
              <button
                type="button"
                className="btn w-full"
                onClick={() => {
                  setEditingTicket(null);
                  reset({
                    dttNo: "",
                    driverId: "",
                    dateReceived: "",
                    timeReceived: "",
                    rating: "",
                  });
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* TABLE */}
        <div className="card bg-base-100 w-full border border-gray-200 p-6 shadow-sm sm:w-5/7">
          {/* FILTERS */}
          <div className="mb-4 grid gap-3 md:grid-cols-4">
            {/* Search Input */}
            <label className="input input-bordered flex w-full items-center gap-2">
              <Search className="h-4 w-4" />
              <input
                type="text"
                placeholder="Search DTT number..."
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  debouncedSearch(value, filterDriver, filterFrom, filterTo);
                }}
                className="grow"
              />
            </label>

            {/* Driver Filter */}
            <select
              className="select select-bordered w-full"
              value={filterDriver}
              onChange={(e) => {
                const value = e.target.value;
                setFilterDriver(value);
                setPage(1);
                fetchTickets(search, value, filterFrom, filterTo, 1);
              }}
            >
              <option value="">All Drivers</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.last_name}, {driver.first_name}{" "}
                  {driver.middle_initial}
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
                fetchTickets(search, filterDriver, value, filterTo, 1);
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
                fetchTickets(search, filterDriver, filterFrom, value, 1);
              }}
            />
          </div>

          {/* CLEAR FILTERS BUTTON */}
          {(search || filterDriver || filterFrom || filterTo) && (
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
            <div className="h-screen overflow-x-auto bg-white">
              <table className="table-pin-rows table-sm xl:table-md table">
                <thead>
                  <tr>
                    <th>DTT No</th>
                    <th>Driver</th>
                    <th>Date Received</th>
                    <th>Time</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center">
                        No tickets found
                      </td>
                    </tr>
                  ) : (
                    tickets.map((item) => (
                      <tr key={item.id}>
                        <td className="truncate text-xs">{item.dtt_no}</td>

                        <td className="font-bold">
                          {item.drivers
                            ? `${item.drivers.last_name}, ${item.drivers.first_name}`
                            : "Unknown"}
                        </td>

                        <td>
                          {format(new Date(item.date_received), "MMM dd, yyyy")}
                        </td>

                        <td className="truncate">
                          {format(
                            new Date(`1970-01-01T${item.time_received}`),
                            "hh:mm a",
                          )}
                        </td>

                        <td>
                          <div className="rating rating-sm pointer-events-none">
                            <input
                              type="radio"
                              name={`rating-${item.id}`}
                              className="mask mask-star-2 bg-green-500"
                              checked={Number(item.rating) === 1}
                              readOnly
                            />
                            <input
                              type="radio"
                              name={`rating-${item.id}`}
                              className="mask mask-star-2 bg-green-500"
                              checked={Number(item.rating) === 2}
                              readOnly
                            />
                            <input
                              type="radio"
                              name={`rating-${item.id}`}
                              className="mask mask-star-2 bg-green-500"
                              checked={Number(item.rating) === 3}
                              readOnly
                            />
                            <input
                              type="radio"
                              name={`rating-${item.id}`}
                              className="mask mask-star-2 bg-green-500"
                              checked={Number(item.rating) === 4}
                              readOnly
                            />
                            <input
                              type="radio"
                              name={`rating-${item.id}`}
                              className="mask mask-star-2 bg-green-500"
                              checked={Number(item.rating) === 5}
                              readOnly
                            />
                          </div>
                        </td>

                        <td className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="btn btn-sm btn-square text-info"
                          >
                            <Pencil className="size-4" />
                          </button>

                          <button
                            onClick={() => {
                              setDeletingTicket(item);
                              document
                                .getElementById("delete_modal")
                                .showModal();
                            }}
                            className="btn btn-sm btn-square text-error"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

                <tfoot>
                  <tr>
                    <td colSpan="3" className="py-4">
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
                    <td colSpan="1" className="py-4">
                      Average Rating:{" "}
                    </td>
                    <td colSpan="1" className="py-4">
                      <div className="flex items-center gap-2 text-lg font-bold text-green-600">
                        <Star className="size-5 fill-green-500 text-green-500" />
                        {averageRating}
                      </div>
                    </td>
                    <td colSpan="1" className="py-4 text-right">
                      Tickets: {totalCount}
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
          <h3 className="text-error text-lg font-bold">Delete Trip Ticket</h3>

          <p className="py-4">Are you sure you want to delete this ticket?</p>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={() => setDeletingTicket(null)}>
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
