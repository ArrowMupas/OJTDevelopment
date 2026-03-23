import { format, parse } from "date-fns";
import { supabase } from "../../supabaseClient";
import { ArrowLeft, Info, Search } from "lucide-react";
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
    <main className="px-5 py-4 pb-40 h-full ">
      <div className="flex gap-2">
        <div className="flex items-center gap-5 mb-6">
          <Link to={"/manage-requests"}>
            <button className="btn btn-square btn-warning btn-dash h-12">
              <ArrowLeft size={20} />
            </button>
          </Link>
        </div>
        <div>
          <h1 className="text-lg font-bold ">Completed Requests</h1>
          <p className="text-gray-500 mb-8 text-sm">
            View all completed vehicle request here.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-700">
          List of Completed Request
          <div className="badge badge-dash badge-primary badge-xs sm:badge-sm text-xs ml-2">
            Total: {requests.length}
          </div>
        </h2>

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

      <div className="bg-white mt-2">
        <div className="overflow-x-auto rounded-lg">
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
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-8">
                    <span className="loading loading-spinner loading-md"></span>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500">
                    No completed requests found
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
                      <th className="uppercase">{req.department}</th>

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
                              ? "text-green-500 select-success"
                              : req.status === "Cancelled" &&
                                "select-error text-error"
                          }`}
                          value={req.status || ""}
                          onChange={(e) => updateStatus(req.id, e.target.value)}
                        >
                          <option value="Pending" className="text-black">
                            Pending
                          </option>
                          <option value="Completed" className="text-green-500">
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
                            <div className="p-3 w-64">
                              <h3 className="font-bold">Instructions</h3>
                              <p>{req.other_instructions || "None"}</p>
                              <h3 className="font-bold mt-2">Items</h3>
                              <p>{req.items || "None"}</p>
                              <h3 className="font-bold mt-2">Has surveyed</h3>
                              <p>Not Yet</p>
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
          </table>
        </div>
      </div>
    </main>
  );
}
