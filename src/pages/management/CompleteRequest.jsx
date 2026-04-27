import { format, parse } from "date-fns";
import { supabase } from "../../supabaseClient";
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
import VehicleRequestsTable from "../../components/VehicleRequestsTable";

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
      .in("status", ["Completed", "Cancelled"])
      .order("departure_date", { ascending: false })
      .order("departure_time", { ascending: false });

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
        supabase
          .from("drivers")
          .select("*")
          .in("designation", [
            "Driver Mechanic B",
            "Driver Mechanic A",
            "Sr. Auto Mechanic",
          ])
          .order("last_name", { ascending: true }),
        supabase
          .from("vehicles")
          .select("*")
          .neq("operational", false)
          .order("name", { ascending: true }),
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

  function handleExport() {
    if (!requests.length) return;

    const sheetData = [
      [
        "No.",
        "REQUESTING PERSONNEL/OFFICE",
        "DESTINATION",
        "DATE REQUESTED",
        "on: (DATE OF DEPARTURE)",
        "DISPATCHED VEHICLE",
        "RATING",
      ],
      ...filteredRequests.map((r, index) => [
        index + 1,
        r.department ?? "-",
        r.destination ?? "-",
        r.timestamp ? format(new Date(r.timestamp), "MMMM d, yyyy") : "-",
        r.departure_date
          ? format(new Date(r.departure_date), "MMMM d, yyyy")
          : "-",
        vehicleMap.get(r.vehicle_id) ?? "-",
        r.rating ?? "-",
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    worksheet["!cols"] = [
      { wch: 5 },
      { wch: 40 },
      { wch: 40 },
      { wch: 20 },
      { wch: 25 },
      { wch: 25 },
      { wch: 10 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicle Requests");

    XLSX.writeFile(workbook, "vehicle_request_report.xlsx");
  }

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

        <button className="btn btn-secondary" onClick={handleExport}>
          <FileArchive className="h-4 w-4" />
          Generate Report
        </button>
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
    </main>
  );
}
