import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Clipboard, ClipboardCheck, ClipboardClock } from "lucide-react";

export default function HomePage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch service vehicle requests
  async function fetchRequests() {
    const { data, error } = await supabase
      .from("service_vehicle_requests")
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
    <main className="p-8 h-full">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-gray-500 mb-6">
        Overview of requests and driver activity
      </p>

      <div className="grid grid-cols-3 md:flex-row gap-5">
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
      </div>

      <h2 className="text-2xl font-bold mt-12">Pending Service Monitor</h2>

      <div className="bg-base-100 mt-4">
        <div className="overflow-x-auto border border-green-600">
          <table className="table table-zebra">
            <thead className="bg-green-600 text-white">
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Requested by</th>
                <th>Purpose</th>
                <th>Destination</th>
                <th>Driver</th>
                <th>Time</th>
                <th>Date</th>
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
                requests.map((req, index) => (
                  <tr key={req.id}>
                    <th>{index + 1}</th>
                    <td>{req.email}</td>
                    <td>{req.requested_by}</td>
                    <td>{req.purpose}</td>
                    <td>{req.destination}</td>
                    <td>{req.driver_name || "Unassigned"}</td>
                    <td>{new Date(req.timestamp).toLocaleTimeString()}</td>
                    <td>{new Date(req.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
      </div>
    </main>
  );
}
