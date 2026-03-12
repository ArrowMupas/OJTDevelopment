import { format, parse } from "date-fns";
import { supabase } from "../../supabaseClient";
import { Clipboard, ClipboardCheck, ClipboardClock, Info } from "lucide-react";
import { useEffect, useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/themes/light.css";

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
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: status } : req,
        ),
      );

      console.log("Status updated successfully for request", requestId);
    }
  }

  return (
    <main className="px-5 py-4 pb-40 h-full ">
      <h1 className="text-lg font-bold ">Manage Request</h1>
      <p className="text-gray-500 text-sm mb-6">
        View and manage all service requests here.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 w-full">
        <div className="stat bg-base-100 shadow rounded-md">
          <div className="stat-figure">
            <Clipboard className="h-8 w-12 text-[#d2dc15]" />
          </div>
          <div className="stat-title">Today's Request</div>
          <div className="stat-value text-[#d2dc15]">21</div>
          <div className="stat-desc">New requests for today</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-md">
          <div className="stat-figure">
            <ClipboardCheck className="h-8 w-12 text-highlight" />
          </div>
          <div className="stat-title">Completed Request</div>
          <div className="stat-value text-highlight">4</div>
          <div className="stat-desc">Requests completed</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-md">
          <div className="stat-figure">
            <ClipboardClock className="h-8 w-12 text-[#745fc9]" />
          </div>
          <div className="stat-title">Pending Request</div>
          <div className="stat-value text-[#745fc9]">19</div>
          <div className="stat-desc">Requests still pending</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-md">
          <div className="stat-figure">
            <ClipboardClock className="h-8 w-12 text-[#745fc9]" />
          </div>
          <div className="stat-title">Another Pending</div>
          <div className="stat-value text-[#745fc9]">19</div>
          <div className="stat-desc">Something else</div>
        </div>
      </div>

      <h2 className=" font-semibold mt-12 text-gray-700">List of Request</h2>

      <div className="bg-white mt-4">
        <div className="overflow-x-auto  rounded-lg">
          <table className="table ">
            <thead className="bg-green-500 text-white">
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
                  <tr key={req.id} className="hover:bg-green-50">
                    <th className="uppercase">{req.department}</th>

                    <td className="">
                      <span className="font-bold capitalize">
                        {req.passengers}
                      </span>
                      <br />
                      <span className="text-xs  font-medium">
                        {req.passenger_contact_number}
                      </span>
                    </td>

                    <td className="capitalize">{req.destination}</td>

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
                        className="select "
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
                        {/* <div className="badge badge-dash badge-primary">
                          {vehicles.find((v) => v.id === req.vehicle_id)
                            ?.plate_number ?? "N/A"}
                        </div> */}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td>
                      <select
                        className={`select  ${
                          req.status === "Completed"
                            ? " text-green-500 select-success"
                            : req.status === "Cancelled" &&
                              "select-error  text-error "
                        }`}
                        value={req.status || ""}
                        onChange={(e) => updateStatus(req.id, e.target.value)}
                      >
                        <option value="Pending" className="text-black">
                          Pending
                        </option>
                        <option value="Completed" className="text-green-500 ">
                          Completed
                        </option>
                        <option value="Cancelled" className="text-error">
                          Cancelled
                        </option>
                      </select>
                    </td>

                    <td>
                      <Tippy
                        interactive
                        placement="left"
                        theme="light"
                        content={
                          <div className="p-3 w-64 ">
                            <h3 className="font-bold">Instructions</h3>
                            <p>{req.other_instructions || "None"}</p>

                            <h3 className="font-bold mt-2">Items</h3>
                            <p>{req.items || "None"}</p>
                          </div>
                        }
                      >
                        <Info className="size-5" />
                      </Tippy>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
      </div>
    </main>
  );
}
