import { supabase } from "../supabaseClient";
import {
  Clipboard,
  ClipboardCheck,
  ClipboardClock,
  Ellipsis,
  Info,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ManageRequestsPage() {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchRequests() {
    const { data, error } = await supabase
      .from("service_vehicle_requests")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Requests error:", error);
      return [];
    }

    return data;
  }

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);

      const [
        { data: driversData, error: driversError },
        { data: vehiclesData, error: vehiclesError },
        requestsData,
      ] = await Promise.all([
        supabase.from("drivers").select("*"),
        supabase.from("vehicles").select("*"),
        fetchRequests(),
      ]);

      if (driversError) console.error("Drivers error:", driversError);
      if (vehiclesError) console.error("Vehicles error:", vehiclesError);

      if (driversData) setDrivers(driversData);
      if (vehiclesData) setVehicles(vehiclesData);
      if (requestsData) setRequests(requestsData);

      setLoading(false);
    }

    fetchAllData();
  }, []);

  async function updateAssignedVehicle(requestId, vehicleId) {
    const { error } = await supabase
      .from("service_vehicle_requests")
      .update({ vehicle_id: vehicleId })
      .eq("id", requestId);

    if (error) {
      console.error("Error updating vehicle:", error);
    } else {
      // Optimistically update UI immediately
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, vehicle_id: vehicleId } : req,
        ),
      );

      console.log("Vehicle updated successfully for request", requestId);
    }
  }

  async function updateAssignedDriver(requestId, driverId) {
    const { error } = await supabase
      .from("service_vehicle_requests")
      .update({ driver_id: driverId })
      .eq("id", requestId);

    if (error) {
      console.error("Error updating driver:", error);
    } else {
      // Optimistically update UI immediately
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, driver_id: driverId } : req,
        ),
      );

      console.log("Driver updated successfully for request", requestId);
    }
  }

  async function updateStatus(requestId, status) {
    const { error } = await supabase
      .from("service_vehicle_requests")
      .update({ status: status })
      .eq("id", requestId);

    if (error) {
      console.error("Error updating status:", error);
    } else {
      // Optimistically update UI immediately
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: status } : req,
        ),
      );

      console.log("Status updated successfully for request", requestId);
    }
  }

  return (
    <main className="p-8 h-full">
      <h1 className="text-4xl font-bold ">Manage Request</h1>
      <p className="text-gray-500 mb-6">
        View and manage all service requests here.
      </p>

      <div className="grid grid-cols-3 md:flex-row gap-5">
        <div className="card bg-base-100 card-md shadow-sm">
          <div className="card-body flex-row justify-between border-[#d2dc15] border-b-2 rounded-sm">
            <div>
              <h2 className="card-title">21</h2>
              <p>Today's Request</p>
            </div>
            <Clipboard className="h-8 w-12 mr-2 text-[#d2dc15]" />
          </div>
        </div>

        <div className="card bg-base-100 card-md shadow-sm">
          <div className="card-body flex-row justify-between border-highlight border-b-2 rounded-sm">
            <div>
              <h2 className="card-title">4</h2>
              <p>Completed Request</p>
            </div>
            <ClipboardCheck className="h-8 w-12 mr-2 text-highlight" />
          </div>
        </div>

        <div className="card bg-base-100 card-md shadow-sm">
          <div className="card-body flex-row justify-between border-[#745fc9] border-b-2 rounded-sm">
            <div>
              <h2 className="card-title">19</h2>
              <p>Pending Request</p>
            </div>
            <ClipboardClock className="h-8 w-12 mr-2 text-[#745fc9]" />
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold mt-12    ">List of Request</h2>

      <div className="bg-base-100 mt-4">
        <div className="overflow-x-auto border border-green-600">
          <table className="table table-zebra">
            <thead className="bg-green-600 text-white">
              <tr>
                <th>Passengers</th>
                {/* <th>Request Number</th> */}
                {/* <th>Timestamp</th> */}
                {/* <th>Email Address</th> */}
                {/* <th>Service Vehicle</th> */}
                <th>Destination</th>
                {/* <th>Time of departure</th>
                <th>Date of departure</th>
                <th>Purpose of travel</th>
                <th>with:</th> */}
                {/* <th>Requested by</th> */}
                {/* <th>Duration of travel</th> */}
                {/* <th>Other instructions</th> */}
                <th>Contact No.</th>
                {/* <th>Remarks</th> */}
                <th>Assigned Driver</th>
                <th>Assigned vehicle</th>
                <th>Plate No.</th>
                <th>Status</th>
                <th>Action</th>

                {/* <th>Rating</th> */}
                {/* <th>Reason for not completing</th> */}
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <th className="flex flex-col">
                    <span>{req.passengers}</span>
                    <span className="text-xs text-gray-500 font-medium">
                      {req.email}
                    </span>
                  </th>
                  <td>{req.destination}</td>
                  <td>{req.passenger_contact_number}</td>

                  {/* DRIVER SELECT */}
                  <td>
                    <select
                      className="select select-ghost"
                      value={req.driver_id || ""}
                      onChange={(e) =>
                        updateAssignedDriver(req.id, Number(e.target.value))
                      }
                    >
                      <option value="">Unassigned</option>

                      {drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.first_name} {driver.last_name}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* VEHICLE SELECT */}
                  <td>
                    <select
                      className="select select-ghost"
                      value={req.vehicle_id || ""}
                      onChange={(e) =>
                        updateAssignedVehicle(req.id, Number(e.target.value))
                      }
                    >
                      <option value="">Unassigned</option>

                      {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <div className="badge badge-dash badge-primary">
                      {vehicles.find((v) => v.id === req.vehicle_id)
                        ?.plate_number ?? "N/A"}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td>
                    <select
                      className={`select select-ghost ${
                        req.status === "Completed"
                          ? "bg-green-200 text-green-800"
                          : req.status === "Cancelled"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                      value={req.status || ""}
                      onChange={(e) => updateStatus(req.id, e.target.value)}
                    >
                      <option value="">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* ACTION */}
                  <td>
                    <Link to="/moreinfo">
                      <button className="btn btn-square">
                        <Ellipsis className="h-4 w-6" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
      </div>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box w-11/12 max-w-2xl max-h-[90vh] border-3 border-doubled border-gray-200 rounded-lg">
          <h3 className="font-bold text-3xl flex items-center gap-2">
            <Info className="h-9 w-9" />
            Activity Information
          </h3>
          <div className="mt-6">
            <div className="md:gap-12 text-sm">
              <div className="border border-gray-300 rounded-lg p-4 relative z-0 w-full mb-4 group">
                <div className="md:gap-12 md:col-2">
                  <h2 className="text-2xl font-bold mb-2 border-b-2 border-black pb-2">
                    Request Identification
                  </h2>

                  <legend className="fieldset-legendc font-bold">
                    Request Number:
                  </legend>
                  <p className="mb-2">[Request Number here.]</p>
                  <legend className="fieldset-legendc font-bold">
                    Timestamp:
                  </legend>
                  <p className="mb-2">[Timestamp here.]</p>
                  <legend className="fieldset-legendc font-bold">
                    Requested by:
                  </legend>
                  <p className="mb-2">[Requested by here.]</p>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-4 relative z-0 w-full mb-4 group">
                <div className="md:gap-12 md:col-2">
                  <h2 className="text-2xl font-bold mb-2 border-b-2 border-black pb-2">
                    Travel Schedule
                  </h2>
                  <legend className="fieldset-legendc font-bold">
                    Date of Departure:
                  </legend>
                  <p className="mb-2">[Date of Departure here.]</p>
                  <legend className="fieldset-legendc font-bold">
                    Time of Departure:
                  </legend>
                  <p className="mb-2">[Time of Departure here.]</p>
                  <legend className="fieldset-legendc font-bold">
                    Duration of Travel:
                  </legend>
                  <p className="mb-2">[Duration of Travel here.]</p>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-4 relative z-0 w-full mb-4 group">
                <div className="md:gap-12 md:col-2">
                  <h2 className="text-2xl font-bold mb-2 border-b-2 border-black pb-2">
                    Vehicle Information
                  </h2>
                  <legend className="fieldset-legendc font-bold">
                    Service Vehicle:
                  </legend>
                  <p className="mb-2">[Service Vehicle here.]</p>
                  <legend className="fieldset-legendc font-bold">
                    Held Items:
                  </legend>
                  <p className="mb-2">[Held Items here.]</p>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-4 relative z-0 w-full mb-4 group">
                <div className="md:gap-12 md:col-2">
                  <h2 className="text-2xl font-bold mb-2 border-b-2 border-black pb-2">
                    Travel Information
                  </h2>
                  <legend className="fieldset-legendc font-bold">
                    Purpose of Travel:
                  </legend>
                  <p className="mb-2">[Purpose of Travel here.]</p>
                  <legend className="fieldset-legendc font-bold">
                    Other Instructions:
                  </legend>
                  <p className="mb-2">[Other Instructions here.]</p>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-4 relative z-0 w-full mb-4 group">
                <div className="md:gap-12 md:col-2">
                  <h2 className="text-2xl font-bold mb-2 border-b-2 border-black pb-2">
                    Feedback Details
                  </h2>
                  <legend className="fieldset-legendc font-bold">
                    Remarks:
                  </legend>
                  <p className="mb-2">[Remarks here.]</p>
                  <legend className="fieldset-legendc font-bold">
                    Ratings:
                  </legend>
                  <p className="mb-2">[Ratings here.]</p>
                  <legend className="fieldset-legendc font-bold">
                    Reason for not completing:
                  </legend>
                  <p className="mb-2">[Reason for not completing here.]</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </main>
  );
}
