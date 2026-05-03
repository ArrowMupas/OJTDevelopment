import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { parse, format } from "date-fns";

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchRequests() {
    const { data, error } = await supabase
      .from("service_vehicle_requests")
      .select(
        `
        *,
        drivers (
          first_name,
          middle_initial,
          last_name
        ),
        vehicles (
          name,
          plate_number
        )
      `,
      )
      .in("status", ["Pending", "On_Going"])
      .order("departure_date", { ascending: true })
      .order("departure_time", { ascending: true });

    if (error) {
      console.error("Error fetching requests:", error);
      return [];
    }

    return data;
  }

  useEffect(() => {
    let channel;

    async function loadInitialData() {
      setLoading(true);
      const data = await fetchRequests();
      setRequests(data);
      setLoading(false);
    }

    loadInitialData();

    channel = supabase
      .channel("service_vehicle_requests_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "service_vehicle_requests" },
        async (payload) => {
          console.log("Realtime change:", payload);
          const updatedData = await fetchRequests();
          setRequests(updatedData);
        },
      )
      .subscribe((status) => {
        console.log(channel);
        console.log(status);
      });

    const handleFocus = async () => {
      console.log("Tab focused → refetching data");
      const data = await fetchRequests();
      setRequests(data);
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="w-full">
      <div className="">
        <div className="min-w-full overflow-x-auto">
          <table className="table-sm lg:table-lg md:table-md table">
            <thead className="">
              <tr className="uppercase">
                <th>Department</th>
                <th>Date & Time</th>
                <th className="">Destination</th>
                <th>Passenger Name</th>
                <th>Purpose</th>
                <th>Instructions</th>
                <th className="">Assigned Driver</th>
                <th className="">Assigned Vehicle</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center">
                    No requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const date = req.departure_date;
                  const time = req.departure_time;

                  const parsedDateTime = parse(
                    `${date} ${time}`,
                    "yyyy-MM-dd HH:mm:ss",
                    new Date(),
                  );

                  const formattedDateTime = format(
                    parsedDateTime,
                    "MMM. d, yyyy hh:mm a",
                  );

                  return (
                    <tr key={req.id} className="">
                      <td className="font-bold uppercase">{req.department}</td>

                      <td className="truncate">
                        <div className="flex h-full flex-col items-start justify-center text-base">
                          <span>{format(parsedDateTime, "MMM. d, yy")}</span>
                          <span>{format(parsedDateTime, "hh:mm a")}</span>
                        </div>
                      </td>

                      <td className="tracking-tight text-green-700 capitalize italic">
                        {req.destination}
                      </td>

                      <td className="">
                        <div className="flex h-full flex-col items-start justify-center">
                          <span className="line-clamp-3 max-w-55 text-sm capitalize">
                            {req.passengers}
                          </span>
                          <span className="text-xs font-medium text-gray-500">
                            {req.email}
                          </span>
                        </div>
                      </td>

                      <td className="text-xs sm:text-sm">{req.purpose}</td>
                      <td className="text-xs">
                        {req.other_instructions || (
                          <span className="text-gray-500">No Instructions</span>
                        )}
                      </td>

                      <td className="truncate bg-blue-50">
                        {req.drivers ? (
                          <p className="text-base font-bold">
                            {req.drivers.last_name}, {req.drivers.first_name}{" "}
                            {req.drivers.middle_initial}.
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">Unassigned</p>
                        )}
                      </td>

                      <td className="bg-violet-50">
                        <div className="truncate">
                          {req.vehicles ? (
                            <p className="text-base font-bold">
                              {req.vehicles.name}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500">Unassigned</p>
                          )}
                        </div>
                        {req.vehicles?.plate_number && (
                          <div className="badge badge-dash badge-primary">
                            {req.vehicles.plate_number}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            <tfoot className="bg-green-50">
              {requests.length < 4 && (
                <tr>
                  <td colSpan={8} className="py-35 text-center">
                    <p className="text-white">
                      Transport Operations Services Unit - National
                      Electrification Administration
                    </p>
                  </td>
                </tr>
              )}
            </tfoot>
          </table>
        </div>
      </div>
    </main>
  );
}
