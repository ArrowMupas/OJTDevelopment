import { useState, useEffect, useMemo } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";
import { format } from "date-fns";
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
      .in("designation", [
        "Driver Mechanic B",
        "Driver Mechanic A",
        "Sr. Auto Mechanic",
      ])
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
      .order("date_received", { ascending: false });

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

      if (error) {
        if (error.code === "23505" && error.message.includes("dtt_no")) {
          toast.error("DTT number already exists");
          return;
        }

        throw error;
      }

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
      <div>
        <h1 className="text-lg font-bold">Trip Ticket</h1>
        <p className="text-sm text-gray-500">Manage driver trip tickets</p>
      </div>

      <div className="flex w-full flex-col gap-2 md:flex-row">
        <div className="card bg-base-100 w-full border border-gray-200 p-6 shadow-xl md:w-2/7">
          <h2 className="text-lg font-semibold">Receive Trip Ticket</h2>
          <p className="text-sm text-gray-500">Receive and rate trip ticket</p>

          <form
            onSubmit={handleSubmit(createTicket)}
            className="mt-4 space-y-3"
          >
            <OurInput
              label="DTT No."
              name="dttNo"
              register={register}
              error={errors.dttNo}
            />

            {/* DRIVER SELECT */}
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
                <div className="rating">
                  <input
                    type="radio"
                    value="1"
                    className="mask mask-star-2 bg-green-500"
                    aria-label="1 star"
                    {...register("rating")}
                  />
                  <input
                    type="radio"
                    value="2"
                    className="mask mask-star-2 bg-green-500"
                    aria-label="2 star"
                    {...register("rating")}
                  />
                  <input
                    type="radio"
                    value="3"
                    className="mask mask-star-2 bg-green-500"
                    aria-label="3 star"
                    {...register("rating")}
                  />
                  <input
                    type="radio"
                    value="4"
                    className="mask mask-star-2 bg-green-500"
                    aria-label="4 star"
                    {...register("rating")}
                  />
                  <input
                    type="radio"
                    value="5"
                    className="mask mask-star-2 bg-green-500"
                    aria-label="5 star"
                    {...register("rating")}
                  />
                </div>
                {errors.rating && (
                  <span className="text-error text-xs">
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
              {isSubmitting ? "Saving..." : "Receive Ticket"}
            </button>
          </form>
        </div>

        <div className="card bg-base-100 w-full p-6 shadow-xl sm:w-5/7">
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

                      <td>
                        {format(new Date(item.date_received), "MMM dd, yyyy")}
                      </td>
                      <td>
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
