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
    let reconnectTimeout;
    let isSubscribed = true;

    async function loadInitialData() {
      setLoading(true);
      const data = await fetchRequests();
      setRequests(data);
      setLoading(false);
    }

    function setupRealtimeSubscription() {
      if (!isSubscribed) return;

      channel = supabase
        .channel("service_vehicle_requests_realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "service_vehicle_requests",
          },
          async (payload) => {
            console.log("Realtime change:", payload);
            const updatedData = await fetchRequests();
            setRequests(updatedData);
          },
        )
        .subscribe((status) => {
          console.log("[Realtime Status]:", status);

          // Handle different statuses
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            console.log("Connection issue, attempting to reconnect...");
            // Clean up current channel
            if (channel) {
              supabase.removeChannel(channel);
            }
            // Attempt reconnection after delay
            clearTimeout(reconnectTimeout);
            reconnectTimeout = setTimeout(() => {
              if (isSubscribed) {
                setupRealtimeSubscription();
              }
            }, 3000); // Wait 5 seconds before reconnecting
          }
        });
    }

    loadInitialData();
    setupRealtimeSubscription();

    return () => {
      isSubscribed = false;
      clearTimeout(reconnectTimeout);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return (
    <main className="min-h-screen pb-40">
      <div className="">
        <div className="min-w-full overflow-x-auto">
          <table className="table-sm lg:table-lg md:table-md table">
            <thead className="bg-green-500 text-white">
              <tr className="uppercase">
                <th>Department</th>
                <th>Date & Time</th>
                <th className="">Destination</th>
                <th>Passenger Name</th>
                <th>Instructions</th>
                <th className="bg-blue-500">Assigned Driver</th>
                <th className="bg-violet-500">Assigned Vehicle</th>
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
                    <tr key={req.id}>
                      <th className="uppercase">{req.department}</th>

                      <td className="truncate">
                        <div className="flex h-full flex-col items-start justify-center">
                          <span>{format(parsedDateTime, "MMM. d, yyyy")}</span>
                          <span>{format(parsedDateTime, "hh:mm a")}</span>
                        </div>
                      </td>

                      <td className="font-bold text-green-700 capitalize">
                        {req.destination}
                      </td>

                      <td className="">
                        <div className="flex h-full flex-col items-start justify-center">
                          <span className="capitalize">{req.passengers}</span>
                          <span className="text-xs font-medium text-gray-500">
                            {req.email}
                          </span>
                        </div>
                      </td>

                      <td className="">{req.other_instructions}</td>

                      <td className="bg-blue-50">
                        {req.drivers
                          ? `${req.drivers.first_name} ${req.drivers.middle_initial}. ${req.drivers.last_name}`
                          : "Unassigned"}
                      </td>

                      <td className="bg-violet-50">
                        <div className="truncate">
                          {req.vehicles?.name || "Unassigned"}
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
            <tfoot></tfoot>
          </table>
        </div>
      </div>
    </main>
  );
}
