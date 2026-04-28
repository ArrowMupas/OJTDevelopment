import { useState, useEffect, useMemo } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";

import OurInput from "../components/OurInput";
import { tripTicketSchema } from "../schemas/tripTicketSchema";

export default function TripTicketPage() {
  const [tickets, setTickets] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tripTicketSchema),
  });

  const fetchDrivers = async () => {
    const { data, error } = await supabase
      .from("drivers")
      .select("*")
      .eq("designation", "Driver Mechanic B")
      .order("last_name", { ascending: true });

    if (error) {
      toast.error("Failed to load drivers");
      console.error(error);
    } else {
      setDrivers(data);
    }
  };

  const fetchTickets = async (searchTerm = "") => {
    setLoading(true);

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
      )
      .order("created_at", { ascending: false });

    if (searchTerm) {
      query = query.ilike("dtt_no", `%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Failed to load tickets");
      console.error(error);
    } else {
      setTickets(data);
    }

    setLoading(false);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        fetchTickets(value);
      }, 400),
    [],
  );

  useEffect(() => {
    fetchDrivers();
    fetchTickets();

    return () => debouncedSearch.cancel();
  }, []);

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

      if (error) throw error;

      toast.success("Trip ticket created!");

      reset();
      fetchTickets(search);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTickets = tickets.filter((item) => {
    const itemDate = new Date(item.date_received);
    const fromDate = filterFrom ? new Date(filterFrom) : null;
    const toDate = filterTo ? new Date(filterTo) : null;

    return (
      (!fromDate || itemDate >= fromDate) && (!toDate || itemDate <= toDate)
    );
  });

  return (
    <main className="min-h-screen space-y-4 px-3 py-4 pb-25 sm:px-5">
      {/* HEADER */}
      <div>
        <h1 className="text-lg font-bold">Trip Ticket</h1>
        <p className="text-sm text-gray-500">Manage driver trip tickets</p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* =====================
            FORM (LIKE GUARDS)
        ===================== */}
        <div className="card bg-base-100 w-full space-y-4 p-6 shadow-xl md:w-1/3">
          <h2 className="text-center text-xl font-bold">Receive Trip Ticket</h2>

          <form onSubmit={handleSubmit(createTicket)} className="space-y-3">
            <OurInput
              label="DTT No."
              name="dttNo"
              register={register}
              error={errors.dttNo}
            />

            {/* DRIVER SELECT */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Driver</span>
              </label>

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
            </div>

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

            {/* RATING */}
            <div>
              <label className="label-text">Rating</label>
              <input
                type="number"
                min="1"
                max="5"
                className="input input-bordered w-full"
                {...register("rating", { valueAsNumber: true })}
              />
              {errors.rating && (
                <span className="text-error text-xs">
                  {errors.rating.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-success w-full text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Receive Ticket"}
            </button>
          </form>
        </div>

        {/* =====================
            TABLE (LIKE STAFF/GUARDS)
        ===================== */}
        <div className="card bg-base-100 w-full p-6 shadow-xl md:w-2/3">
          <h2 className="mb-4 text-xl font-bold">Trip History</h2>

          {/* SEARCH + FILTER */}
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <input
              type="text"
              placeholder="Search DTT..."
              className="input input-bordered w-full"
              onChange={(e) => {
                setSearch(e.target.value);
                debouncedSearch(e.target.value);
              }}
            />

            <input
              type="date"
              className="input input-bordered w-full"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
            />

            <input
              type="date"
              className="input input-bordered w-full"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
            />
          </div>

          {/* TABLE */}
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <span className="loading loading-infinity text-success"></span>
            </div>
          ) : filteredTickets.length === 0 ? (
            <p className="text-gray-500">No records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>DTT No</th>
                    <th>Driver</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Rating</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTickets.map((item) => (
                    <tr key={item.id}>
                      <td>{item.dtt_no}</td>

                      <td>
                        {item.drivers
                          ? `${item.drivers.last_name}, ${item.drivers.first_name}`
                          : "Unknown"}
                      </td>

                      <td>{item.date_received}</td>
                      <td>{item.time_received}</td>

                      <td>{"★".repeat(item.rating)}</td>
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
