import { format, parse } from "date-fns";
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
                <th>Department</th>
                <th>Passengers</th>
                <th>Destination</th>
                <th>Date and Time.</th>
                <th>Assigned Driver</th>
                <th>Assigned vehicle</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => {
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
                    <th>{req.department}</th>

                    <td className="">
                      <span className="font-bold capitalize">
                        {req.passengers}
                      </span>
                      <br />
                      <span className="text-xs text-gray-500 font-medium">
                        {req.email}
                      </span>
                      <br />
                      <span className="text-xs  font-medium">
                        {req.passenger_contact_number}
                      </span>
                    </td>

                    <td>{req.destination}</td>

                    <td className="">
                      <span className="text-sm">
                        {format(formattedDateTime, "MMM. d, yyyy")}
                      </span>
                      <br />
                      <span className="text-xs ">
                        {format(formattedDateTime, "hh:mm a")}
                      </span>
                    </td>

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
                      <div className="flex flex-col gap-2">
                        <select
                          className="select "
                          value={req.vehicle_id || ""}
                          onChange={(e) =>
                            updateAssignedVehicle(
                              req.id,
                              Number(e.target.value),
                            )
                          }
                        >
                          <option value="">Unassigned</option>
                          {vehicles.map((vehicle) => (
                            <option key={vehicle.id} value={vehicle.id}>
                              {vehicle.name}
                            </option>
                          ))}
                        </select>
                        <div className="badge badge-dash badge-primary">
                          {vehicles.find((v) => v.id === req.vehicle_id)
                            ?.plate_number ?? "N/A"}
                        </div>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td>
                      <select
                        className={`select  ${
                          req.status === "Completed"
                            ? " text-green-500 select-success"
                            : req.status === "Cancelled" &&
                              "select-error  text-red-500 "
                        }`}
                        value={req.status || ""}
                        onChange={(e) => updateStatus(req.id, e.target.value)}
                      >
                        <option value="" className="text-black">
                          Pending
                        </option>
                        <option value="Completed" className="text-green-500 ">
                          Completed
                        </option>
                        <option value="Cancelled" className="text-red-500">
                          Cancelled
                        </option>
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
                );
              })}
              )
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
      </div>
    </main>
  );
}
