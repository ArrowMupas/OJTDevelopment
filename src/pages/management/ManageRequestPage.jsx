import { format, parse } from "date-fns";
import { supabase } from "../../supabaseClient";
import useDriverStore from "../../stores/driverStore";
import {
  Clipboard,
  ClipboardCheck,
  ClipboardClock,
  Info,
  Search,
  ArrowRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/themes/light.css";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import clsx from "clsx";
import toast from "react-hot-toast";
import VehicleRequestsTable from "../../components/VehicleRequestsTable";

export default function ManageRequestsPage() {
  const { getDrivers, fetchDrivers } = useDriverStore();
  const [vehicles, setVehicles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const drivers = getDrivers("service");

  async function fetchRequests(searchTerm = "") {
    let query = supabase
      .from("service_vehicle_requests")
      .select("*")
      .in("status", ["Pending", "On_Going"])
      .order("departure_date", { ascending: true })
      .order("departure_time", { ascending: true });

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

      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from("vehicles")
        .select("*")
        .neq("operational", false)
        .order("name", { ascending: true });

      if (vehiclesError) console.error("Vehicles error:", vehiclesError);
      if (vehiclesData) setVehicles(vehiclesData);

      const requestsData = await fetchRequests();
      setRequests(requestsData);

      setLoading(false);
    }

    const handleFocus = async () => {
      console.log("Tab focused → refetching data");
      const requestsData = await fetchRequests();
      setRequests(requestsData);
    };
    window.addEventListener("focus", handleFocus);
    fetchAllData();

    return () => window.removeEventListener("focus", handleFocus);
  }, [drivers.length, fetchDrivers]);

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

  const refetchRequests = async () => {
    const data = await fetchRequests(search);
    setRequests(data);
  };
  async function updateAssignedVehicle(requestId, vehicleId) {
    const { error } = await supabase
      .from("service_vehicle_requests")
      .update({ vehicle_id: vehicleId })
      .eq("id", requestId);

    if (error) {
      console.error("Error updating vehicle:", error);
      return;
    }

    console.log("Vehicle updated successfully for request", requestId);

    await refetchRequests();
  }
  async function updateAssignedDriver(requestId, driverId) {
    const { error } = await supabase
      .from("service_vehicle_requests")
      .update({ driver_id: driverId })
      .eq("id", requestId);

    if (error) {
      console.error("Error updating driver:", error);
      return;
    }

    console.log("Driver updated successfully for request", requestId);

    await refetchRequests();
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
    <main className="h-full space-y-4 px-3 py-4 pb-25 sm:space-y-7 sm:px-5">
      <div>
        <h1 className="text-lg font-bold">Manage Request</h1>
        <p className="text-sm text-gray-500">
          View and manage all service requests here.
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-1 sm:gap-2 md:grid-cols-4">
        <div className="stat bg-base-100 rounded-md shadow">
          <div className="stat-figure">
            <Clipboard className="text-secondary h-8 w-12" />
          </div>
          <div className="stat-title">Pending Requests</div>
          <div className="stat-value text-secondary">21</div>
        </div>

        <div className="stat bg-base-100 rounded-md shadow">
          <div className="stat-figure">
            <ClipboardCheck className="text-warning h-8 w-12" />
          </div>
          <div className="stat-title">
            On Going <span className="hidden sm:inline">Requests</span>
          </div>
          <div className="stat-value text-warning">4</div>
        </div>

        <div className="stat bg-base-100 rounded-md shadow">
          <div className="stat-figure">
            <ClipboardClock className="text-success h-8 w-12" />
          </div>
          <div className="stat-title">Completed Requests</div>
          <div className="stat-value text-success">19</div>
        </div>

        <div className="stat bg-base-100 rounded-md shadow">
          <div className="stat-figure">
            <ClipboardClock className="text-error h-8 w-12" />
          </div>
          <div className="stat-title">Cancelled Requests</div>
          <div className="stat-value text-error">19</div>
        </div>
      </div>

      <div className="flex justify-between">
        <label className="input input-neutral">
          <Search className="h-4 w-6" />
          <input
            type="search"
            placeholder="Search vehicle requests"
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
        <Link to={"/vehicle-requests/completed"}>
          <button className="btn btn-success text-white">
            <span className="hidden sm:inline">View </span>Completed
            <ArrowRight className="size-4" />
          </button>
        </Link>
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
