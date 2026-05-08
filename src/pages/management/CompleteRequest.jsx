import { format, parse } from "date-fns";
import { supabase } from "../../supabaseClient";
import useDriverStore from "../../stores/driverStore";
import { exportCompletedRequests } from "../../utils/exportCompletedRequests";
import {
  ArrowLeft,
  CheckCircle,
  FileArchive,
  Info,
  Search,
  XCircle,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/themes/light.css";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import clsx from "clsx";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import VehicleRequestsTable from "../../components/VehicleRequestsTable";

export default function CompleteRequest() {
  const { getDrivers, fetchDrivers } = useDriverStore();
  const [vehicles, setVehicles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDriver, setFilterDriver] = useState("");
  const [filterVehicle, setFilterVehicle] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [exporting, setExporting] = useState(false);

  const PAGE_SIZE = 50;
  const drivers = getDrivers("service");

  async function fetchRequests(
    searchTerm = "",
    driverId = "",
    vehicleId = "",
    start = "",
    end = "",
    pageNum = 1,
  ) {
    const from = (pageNum - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("service_vehicle_requests")
      .select("*", { count: "exact" })
      .in("status", ["Completed", "Cancelled"])
      .order("departure_date", { ascending: false })
      .order("departure_time", { ascending: false })
      .range(from, to);

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

    // Filter by driver
    if (driverId) {
      query = query.eq("driver_id", parseInt(driverId));
    }

    // Filter by vehicle
    if (vehicleId) {
      query = query.eq("vehicle_id", parseInt(vehicleId));
    }

    // Filter by departure date range
    if (start) {
      query = query.gte("departure_date", start);
    }
    if (end) {
      query = query.lte("departure_date", end);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Requests error:", error);
      return { data: [], count: 0 };
    }

    return { data: data || [], count: count || 0 };
  }

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);

      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from("vehicles")
        .select("*")
        .neq("operational", false)
        .order("name", { ascending: true });

      if (vehiclesError) console.error("Vehicles error:", vehiclesError);
      if (vehiclesData) setVehicles(vehiclesData);

      // Fetch initial requests with pagination
      const { data: requestsData, count } = await fetchRequests(
        search,
        filterDriver,
        filterVehicle,
        filterFrom,
        filterTo,
        1,
      );
      if (requestsData) setRequests(requestsData);
      if (count) setTotalCount(count);

      setLoading(false);
    }

    fetchAllData();
  }, [drivers.length, fetchDrivers]);

  useEffect(() => {
    async function loadRequests() {
      setLoading(true);
      const { data, count } = await fetchRequests(
        search,
        filterDriver,
        filterVehicle,
        filterFrom,
        filterTo,
        page,
      );
      setRequests(data);
      setTotalCount(count);
      setLoading(false);
    }

    loadRequests();
  }, [page]);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (value, driverId, vehicleId, start, end) => {
        setPage(1);
        setLoading(true);
        const { data, count } = await fetchRequests(
          value,
          driverId,
          vehicleId,
          start,
          end,
          1,
        );
        setRequests(data);
        setTotalCount(count);
        setLoading(false);
      }, 400),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Handle filter changes
  useEffect(() => {
    async function applyFilters() {
      setPage(1);
      setLoading(true);
      const { data, count } = await fetchRequests(
        search,
        filterDriver,
        filterVehicle,
        filterFrom,
        filterTo,
        1,
      );
      setRequests(data);
      setTotalCount(count);
      setLoading(false);
    }

    applyFilters();
  }, [search, filterDriver, filterVehicle, filterFrom, filterTo]);

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

  const filteredRequests = requests.filter(
    (r) => r.status === "Completed" && r.is_surveyed === true,
  );

  const vehicleMap = useMemo(() => {
    const map = new Map();
    vehicles.forEach((v) => {
      map.set(v.id, v.name);
    });
    return map;
  }, [vehicles]);

  const clearFilters = () => {
    setSearch("");
    setFilterDriver("");
    setFilterVehicle("");
    setFilterFrom("");
    setFilterTo("");
    setPage(1);
    fetchRequests("", "", "", "", "", 1).then(({ data, count }) => {
      setRequests(data);
      setTotalCount(count);
    });
  };

  async function handleExport() {
    setExporting(true);

    await exportCompletedRequests({
      supabase,
      search,
      filterDriver,
      filterVehicle,
      filterFrom,
      filterTo,
      drivers,
      vehicles,
      toast,
    });

    setExporting(false);
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <main className="h-full px-5 py-4 pb-40">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div className="mb-6 flex items-center gap-5">
            <Link to={"/vehicle-requests"}>
              <button className="btn btn-square btn-neutral btn-dash h-12">
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

        <button
          className="btn btn-secondary"
          onClick={handleExport}
          disabled={exporting}
        >
          <FileArchive className="h-4 w-4" />
          {exporting ? "Exporting..." : "Generate Report"}
        </button>
      </div>

      {/* FILTERS SECTION */}
      <div className="mb-4 grid gap-3 md:grid-cols-5">
        {/* Search Input */}
        <label className="input input-neutral col-span-1">
          <Search className="h-4 w-6" />
          <input
            type="search"
            placeholder="Search completed requests"
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              debouncedSearch(
                value,
                filterDriver,
                filterVehicle,
                filterFrom,
                filterTo,
              );
            }}
          />
        </label>

        {/* Driver Filter */}
        <select
          className="select select-neutral w-full"
          value={filterDriver}
          onChange={(e) => {
            const value = e.target.value;
            setFilterDriver(value);
            setPage(1);
          }}
        >
          <option value="">All Drivers</option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.last_name}, {driver.first_name} {driver.middle_initial}
            </option>
          ))}
        </select>

        {/* Vehicle Filter */}
        <select
          className="select select-neutral w-full"
          value={filterVehicle}
          onChange={(e) => {
            const value = e.target.value;
            setFilterVehicle(value);
            setPage(1);
          }}
        >
          <option value="">All Vehicles</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.name} - {vehicle.plate_number}
            </option>
          ))}
        </select>

        {/* Date From */}
        <input
          type="date"
          className="input input-neutral w-full"
          placeholder="From Date"
          value={filterFrom}
          onChange={(e) => {
            const value = e.target.value;
            setFilterFrom(value);
            setPage(1);
          }}
        />

        {/* Date To */}
        <input
          type="date"
          className="input input-neutral w-full"
          placeholder="To Date"
          value={filterTo}
          onChange={(e) => {
            const value = e.target.value;
            setFilterTo(value);
            setPage(1);
          }}
        />
      </div>

      {/* CLEAR FILTERS BUTTON */}
      {(search || filterDriver || filterVehicle || filterFrom || filterTo) && (
        <div className="mb-4 flex justify-end">
          <button onClick={clearFilters} className="btn btn-error btn-sm">
            Clear All Filters
          </button>
        </div>
      )}

      {/* Add loading state for filters */}
      {loading ? (
        <div className="flex h-96 items-center justify-center">
          <span className="loading loading-infinity text-success loading-lg"></span>
        </div>
      ) : (
        <>
          <VehicleRequestsTable
            data={requests}
            loading={loading}
            search={search}
            drivers={drivers}
            vehicles={vehicles}
            updateAssignedDriver={updateAssignedDriver}
            updateAssignedVehicle={updateAssignedVehicle}
            updateStatus={updateStatus}
          />

          {/* PAGINATION */}
          {totalCount > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
                {Math.min(page * PAGE_SIZE, totalCount)} of {totalCount} records
              </div>
              <div className="join">
                <button
                  className="join-item btn btn-sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  «
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(Math.max(0, page - 3), page + 2)
                  .map((p) => (
                    <button
                      key={p}
                      className={`join-item btn btn-sm ${
                        p === page ? "btn-active" : ""
                      }`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}

                <button
                  className="join-item btn btn-sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
