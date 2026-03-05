import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { parse, format } from "date-fns";

export default function HomePage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch service vehicle requests
  async function fetchRequests() {
    const { data, error } = await supabase
      .from("request_dashboard_view")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Error fetching requests:", error);
      return [];
    }
    return data;
  }

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchRequests();
      setRequests(data);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <main className=" h-full pb-40">
      {/* <div className="grid grid-cols-3 md:flex-row gap-5">
        <div className="card bg-base-100 card-md shadow-sm">
          <div className="card-body flex-row justify-between border-[#d2dc15] border-b-2 rounded-sm">
            <div>
              <h2 className="card-title">{requests.length}</h2>
              <p>Today's Request</p>
            </div>
            <Clipboard className="h-8 w-12 mr-2 text-[#d2dc15]" />
          </div>
        </div>

        <div className="card bg-base-100 card-md shadow-sm">
          <div className="card-body flex-row justify-between border-highlight border-b-2 rounded-sm">
            <div>
              <h2 className="card-title">
                {requests.filter((r) => r.status === "Completed").length}
              </h2>
              <p>Completed Request</p>
            </div>
            <ClipboardCheck className="h-8 w-12 mr-2 text-highlight" />
          </div>
        </div>

        <div className="card bg-base-100 card-md shadow-sm">
          <div className="card-body flex-row justify-between border-[#745fc9] border-b-2 rounded-sm">
            <div>
              <h2 className="card-title">
                {requests.filter((r) => r.status !== "Completed").length}
              </h2>
              <p>Pending Request</p>
            </div>
            <ClipboardClock className="h-8 w-12 mr-2 text-[#745fc9]" />
          </div>
        </div>
      </div> */}

      <div className="">
        <div className="overflow-x-auto ">
          <table className="table table-sm lg:table-md xl:table-lg">
            <thead className="bg-green-500 text-white">
              <tr className="uppercase">
                <th>Department</th>
                <th>Date & Time</th>
                <th className="">Destination</th>
                <th>Name</th>
                <th>Instructions</th>
                <th className="bg-blue-500">Assigned Driver</th>
                <th className="bg-violet-500">Assigned Vehicle</th>
                <th className="bg-violet-500">Plate No.</th>
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

                      <td className="flex flex-col justify-center items-start">
                        <span className="">
                          {format(formattedDateTime, "MMM. d, yyyy")}
                        </span>
                        <span className="">
                          {format(formattedDateTime, "hh:mm a")}
                        </span>
                      </td>

                      <td className="text-green-700 font-bold capitalize">
                        {req.destination}
                      </td>

                      <td className="flex flex-col">
                        <span className="capitalize">{req.passengers}</span>
                        <span className="text-xs text-gray-500 font-medium">
                          {req.email}
                        </span>
                      </td>

                      <td className="text-sm">{req.other_instructions}</td>

                      <td className="bg-blue-50">
                        {req.driver_first_name} {req.driver_last_name}
                      </td>
                      <td className="bg-violet-50">{req.vehicle_name}</td>
                      <td className="bg-violet-50">
                        {req.plate_number && (
                          <div className="badge badge-dash badge-primary">
                            {req.plate_number}
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
