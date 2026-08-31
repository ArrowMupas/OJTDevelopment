import { FileArchive, Search } from "lucide-react";
import { supabase } from "../../supabaseClient";
import useDriverStore from "../../stores/driverStore";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import { exportSurveyReport } from "../../utils/exportSurveyReport";
import * as XLSX from "xlsx";

export default function SurveyPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { getDrivers, fetchDrivers } = useDriverStore();
  const [selectedDriver, setSelectedDriver] = useState("");

  const drivers = getDrivers("service");

  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // PAGINATION
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const PAGE_SIZE = 50;

  async function fetchSurveys(
    searchTerm = "",
    driverId = "",
    start = "",
    end = "",
    pageNum = 1,
  ) {
    setLoading(true);

    const from = (pageNum - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("passenger_survey")
      .select(
        `
      *,
      drivers!inner (
        id,
        first_name,
        middle_initial,
        last_name
      )
    `,
        { count: "exact" },
      )
      .order("travel_date", { ascending: false })
      .range(from, to);

    // Search
    if (searchTerm) {
      query = query.or(
        `passenger_name.ilike.%${searchTerm}%,comments.ilike.%${searchTerm}%`,
      );
    }

    // Driver filter
    if (driverId) {
      query = query.eq("driver_id", driverId);
    }

    // Date range filter
    if (start) {
      query = query.gte("travel_date", start);
    }

    if (end) {
      query = query.lte("travel_date", end);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error(error);
    } else {
      setSurveys(data || []);
      setTotalCount(count || 0);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchSurveys(search, selectedDriver, startDate, endDate, page);
  }, [page]);

  useEffect(() => {
    if (drivers.length === 0) {
      fetchDrivers();
    }
  }, [drivers.length, fetchDrivers]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value, driverId, start, end) => {
        setPage(1);
        fetchSurveys(value, driverId, start, end, 1);
      }, 400),
    [],
  );

  const overallAverage = useMemo(() => {
    if (!selectedDriver || surveys.length === 0) return null;

    const valid = surveys.filter(
      (s) => s.average_score !== null && s.average_score !== undefined,
    );

    if (valid.length === 0) return null;

    const total = valid.reduce((sum, s) => sum + s.average_score, 0);

    return total / valid.length;
  }, [surveys, selectedDriver]);

  async function handleExport() {
    await exportSurveyReport({
      search,
      selectedDriver,
      startDate,
      endDate,
    });
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const finalAverage =
    surveys.length > 0
      ? surveys.reduce((sum, survey) => sum + (survey.average_score || 0), 0) /
        surveys.length
      : null;

  return (
    <main className="h-full w-full space-y-7 px-5 py-4 pb-25">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Passenger Survey</h1>
          <p className="text-sm text-gray-500">
            All passenger survey responses can be viewed here.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={handleExport}>
          <FileArchive className="h-4 w-4" />
          Generate Report
        </button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <label className="input input-neutral w-full">
          <Search className="h-4 w-6" />
          <input
            type="search"
            placeholder="Search by Passenger Name"
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              debouncedSearch(value, selectedDriver, startDate, endDate);
            }}
          />
        </label>

        <select
          className="select w-full"
          value={selectedDriver}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedDriver(value);
            setPage(1);
            fetchSurveys(search, value, startDate, endDate, 1);
          }}
        >
          <option value="">All Drivers</option>

          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.last_name}, {driver.first_name} {driver.middle_initial}.
            </option>
          ))}
        </select>

        <input
          type="date"
          className="input input-bordered w-full"
          value={startDate}
          onChange={(e) => {
            const value = e.target.value;
            setStartDate(value);
            setPage(1);
            fetchSurveys(search, selectedDriver, value, endDate, 1);
          }}
        />

        <input
          type="date"
          className="input input-bordered w-full"
          value={endDate}
          onChange={(e) => {
            const value = e.target.value;
            setEndDate(value);
            setPage(1);
            fetchSurveys(search, selectedDriver, startDate, value, 1);
          }}
        />

        <button
          className="btn btn-error btn-soft"
          onClick={() => {
            setSearch("");
            setSelectedDriver("");
            setStartDate("");
            setEndDate("");
            setPage(1);
            fetchSurveys("", "", "", "", 1);
          }}
        >
          Clear
        </button>
      </div>

      <div className="border-0 bg-white">
        <div className="h-screen overflow-x-auto rounded-lg">
          <table className="table-pin-rows table min-h-50">
            <thead className="">
              <tr>
                <th>Name</th>
                <th>Travel Date</th>

                <th className="text-center">Appearance</th>
                <th className="text-center">Behavior</th>
                <th className="text-center">Safety</th>
                <th className="text-center">Vehicle</th>
                <th className="text-center">On-time</th>

                <th className="w-20 text-center">Avg</th>
                <th>Comments</th>
                <th className="w-40">Driver Name</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center sm:py-40">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <progress className="progress progress-success w-56"></progress>
                      <p className="text-gray-500">Loading surveys...</p>
                    </div>
                  </td>
                </tr>
              ) : surveys.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center sm:py-40">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="size-8 text-gray-500" />
                      <p className="text-gray-500">No surveys found</p>
                      <p className="text-xs text-gray-500">
                        {search
                          ? "Try a different search term"
                          : "No survey data available"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                surveys.map((survey) => (
                  <tr key={survey.id} className="hover:bg-green-50">
                    <td className="font-semibold capitalize">
                      {survey.passenger_name || "Anonymous"}
                    </td>

                    <td className="truncate">
                      {survey.travel_date
                        ? format(new Date(survey.travel_date), "MMM d, yyyy")
                        : "-"}
                    </td>

                    <td className="text-center font-bold">
                      {survey.rating_appearance ?? "-"}
                    </td>

                    <td className="text-center font-bold">
                      {survey.rating_behavior ?? "-"}
                    </td>

                    <td className="text-center font-bold">
                      {survey.rating_safety ?? "-"}
                    </td>

                    <td className="text-center font-bold">
                      {survey.rating_vehicle ?? "-"}
                    </td>

                    <td className="text-center font-bold">
                      {survey.rating_ontime ?? "-"}
                    </td>

                    <td className="text-center font-semibold">
                      {survey.average_score?.toFixed(2) || "-"}
                    </td>

                    <td className="text-xs">{survey.comments || "-"}</td>

                    <td className="font-bold capitalize">
                      {survey.drivers.last_name}, {survey.drivers.first_name}{" "}
                      {survey.drivers.middle_initial}.
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={6}>
                  <div className="flex items-center justify-between pb-4">
                    <p className="text-sm text-gray-600">
                      Total Records: {totalCount}
                    </p>
                  </div>
                </td>
                <td colSpan={2}>
                  <div className="flex items-center justify-between px-2 pb-4">
                    <p className="text-sm text-gray-600">
                      Overall Average: {finalAverage?.toFixed(2) || "-"}
                    </p>
                  </div>
                </td>
                <td colSpan={2}>
                  <div className="join flex justify-end">
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
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </main>
  );
}
