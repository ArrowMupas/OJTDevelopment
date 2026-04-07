import { format, parse } from "date-fns";
import { supabase } from "../../supabaseClient";
import { ArrowLeft, CheckCircle, Info, Search, XCircle } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/themes/light.css";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";

export default function CompleteRequest() {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function fetchRequests(searchTerm = "") {
    let query = supabase
      .from("service_vehicle_requests")
      .select("*")
      .neq("status", "Pending")
      .order("timestamp", { ascending: false });

    const searchColumns = [
      "department",
      "email",
      "destination",
      "purpose",
      "items",
      "passengers",
      "other_instructions",
      "passenger_contact_number",
      "requested_by",
    ];

    if (searchTerm) {
      let orQueryParts = searchColumns.map(
        (field) => `${field}.ilike.%${searchTerm}%`,
      );

      query = query.or(orQueryParts.join(","));
    }

    const { data, error } = await query;

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

  const debouncedSearch = useMemo(
    () =>
      debounce(async (value) => {
        const data = await fetchRequests(value);
        setRequests(data);
      }, 400),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

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
    <main className="h-full px-5 py-4 pb-40">
      <div className="flex gap-2">
        <div className="mb-6 flex items-center gap-5">
          <Link to={"/vehicle-requests"}>
            <button className="btn btn-square btn-warning btn-dash h-12">
              <ArrowLeft size={20} />
            </button>
          </Link>
        </div>
        <div>
          <h1 className="text-lg font-bold">Completed Requests</h1>
          <p className="mb-8 text-sm text-gray-500">
            View all completed vehicle request here.
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <label className="input input-neutral">
          <Search className="h-4 w-6" />
          <input
            type="search"
            placeholder="Search completed requests"
            value={search}
            list="departments"
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              debouncedSearch(value);
            }}
          />
          <datalist id="departments">
            <option value="TOSU"></option>
            <option value="DOH"></option>
            <option value="HRAD"></option>
            <option value="ACCOUNTING"></option>
            <option value="NEA"></option>
          </datalist>
        </label>
      </div>

      <div className="mt-2 bg-white">
        <div className="overflow-x-auto rounded-lg">
          <table className="table">
            <thead className="bg-green-500 text-white">
              <tr>
                <th>Department</th>
                <th>Passengers</th>
                <th>Destination</th>
                <th>Date and Time.</th>
                <th>Assigned Driver</th>
                <th>Assigned vehicle</th>
                <th>Status</th>
                <th>Has Surveyed</th>
                <th>More</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center sm:py-40">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="loading loading-infinity loading-xl"></span>
                      <p className="text-gray-500">
                        Loading completed requests...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center sm:py-35">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="size-8 text-gray-500" />
                      <p className="text-gray-500">
                        No completed requests found
                      </p>
                      <p className="text-xs text-gray-500">
                        {search
                          ? "Try a different search term"
                          : "No completed requests available right now"}
                      </p>
                    </div>
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

                  return (
                    <tr key={req.id} className="hover:bg-green-50">
                      <th className="text-xs uppercase">{req.department}</th>

                      <td className="">
                        <span className="font-bold capitalize">
                          {req.passengers}
                        </span>
                        <br />
                        <span className="text-xs font-medium">
                          {req.passenger_contact_number}
                        </span>
                      </td>

                      <td className="capitalize">{req.destination}</td>

                      <td className="">
                        <span className="text-sm">
                          {format(parsedDateTime, "MMM. d, yyyy")}
                        </span>
                        <br />
                        <span className="text-xs">
                          {format(parsedDateTime, "hh:mm a")}
                        </span>
                      </td>

                      {/* DRIVER SELECT */}
                      <td>
                        <select
                          className="select"
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
                            className="select"
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
                        </div>
                      </td>

                      {/* STATUS */}
                      <td>
                        <select
                          className={`select ${
                            req.status === "Completed"
                              ? "select-success text-success"
                              : req.status === "Cancelled" &&
                                "select-error text-error"
                          }`}
                          value={req.status || ""}
                          onChange={(e) => updateStatus(req.id, e.target.value)}
                        >
                          <option value="Pending" className="text-black">
                            Pending
                          </option>
                          <option value="Completed" className="text-success">
                            Completed
                          </option>
                          <option value="Cancelled" className="text-error">
                            Cancelled
                          </option>
                        </select>
                      </td>

                      <td className="">
                        <p>
                          {req.is_surveyed ? (
                            <div className="badge badge-success badge-soft">
                              <CheckCircle className="size-3" />
                              <p className="text-xs">Done</p>
                            </div>
                          ) : (
                            <div className="badge badge-error badge-soft">
                              <XCircle className="size-3" />
                              <p className="truncate text-xs">Undone</p>
                            </div>
                          )}
                        </p>
                      </td>

                      <td>
                        <Tippy
                          interactive
                          placement="left"
                          theme="light"
                          content={
                            <div className="w-64 p-3">
                              <h3 className="font-bold">Instructions</h3>
                              <p>{req.other_instructions || "None"}</p>
                              <h3 className="mt-2 font-bold">Items</h3>
                              <p>{req.items || "None"}</p>
                            </div>
                          }
                        >
                          <Info className="size-5" />
                        </Tippy>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot className="bg-green-400 font-medium">
              <tr>
                <td colSpan="9" className="py-5 text-center text-white">
                  Total Requests: {requests.length}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </main>
  );
}
