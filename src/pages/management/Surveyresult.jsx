import { File, FileArchive, FilterIcon, Search } from "lucide-react";
import { supabase } from "../../supabaseClient";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import * as XLSX from "xlsx";

export default function SurveyPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");

  async function fetchDrivers() {
    const { data, error } = await supabase
      .from("drivers")
      .select("id, first_name, middle_initial, last_name")
      .in("designation", [
        "Driver Mechanic B",
        "Driver Mechanic A",
        "Sr. Auto Mechanic",
      ])
      .order("last_name", { ascending: true });

    if (error) console.error(error);
    else setDrivers(data);
  }

  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function fetchSurveys(
    searchTerm = "",
    driverId = "",
    start = "",
    end = "",
  ) {
    setLoading(true);

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
      )
      .order("timestamp", { ascending: false });

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

    const { data, error } = await query;

    if (error) console.error(error);
    else setSurveys(data);

    setLoading(false);
  }

  useEffect(() => {
    fetchSurveys();
    fetchDrivers();
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((value, driverId, start, end) => {
        fetchSurveys(value, driverId, start, end);
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

  function handleExport() {
    if (!surveys.length) return;

    const sheetData = [
      ["Passenger Survey Report"],
      [],
      ["Total Responses:", surveys.length],
      ...(selectedDriver && overallAverage !== null
        ? [["Overall Average:", overallAverage.toFixed(2)]]
        : []),
      [],
      [
        "Name",
        "Travel Date",
        "Appearance",
        "Behavior",
        "Safety",
        "Vehicle",
        "On-time",
        "Average",
        "Comments",
        "Driver Name",
      ],
      ...surveys.map((s) => [
        s.passenger_name || "Anonymous",
        s.travel_date ? format(new Date(s.travel_date), "MMMM d, yyyy") : "-",
        s.rating_appearance ?? "-",
        s.rating_behavior ?? "-",
        s.rating_safety ?? "-",
        s.rating_vehicle ?? "-",
        s.rating_ontime ?? "-",
        s.average_score ? s.average_score.toFixed(2) : "-",
        s.comments || "-",
        `${s.drivers.last_name}, ${s.drivers.first_name} ${s.drivers.middle_initial}.`,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }];

    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 25 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 30 },
      { wch: 25 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Surveys");

    XLSX.writeFile(workbook, "survey_report.xlsx");
  }

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
            fetchSurveys(search, value);
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
            z;
            setStartDate(value);
            fetchSurveys(search, selectedDriver, value, endDate);
          }}
        />

        <input
          type="date"
          className="input input-bordered w-full"
          value={endDate}
          onChange={(e) => {
            const value = e.target.value;
            setEndDate(value);
            fetchSurveys(search, selectedDriver, startDate, value);
          }}
        />

        <button
          className="btn btn-error btn-soft"
          onClick={() => {
            setSearch("");
            setSelectedDriver("");
            setStartDate("");
            setEndDate("");
            fetchSurveys();
          }}
        >
          Clear
        </button>
      </div>

      <div className="border-0 bg-white">
        <div className="overflow-x-auto rounded-lg">
          <table className="table min-h-50">
            <thead className="bg-green-600 text-white">
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
                surveys.map((survey) => {
                  const date = new Date(survey.timestamp);

                  return (
                    <tr key={survey.id} className="hover:bg-green-50">
                      <td className="font-semibold capitalize">
                        {survey.passenger_name || "Anonymous"}
                      </td>

                      <td className="truncate">
                        {survey.travel_date
                          ? format(new Date(survey.travel_date), "MMM d, yyyy")
                          : "-"}
                      </td>

                      {/* Compacts */}
                      <td className="text-center">
                        {survey.rating_appearance ?? "-"}
                      </td>
                      <td className="text-center">
                        {survey.rating_behavior ?? "-"}
                      </td>
                      <td className="text-center">
                        {survey.rating_safety ?? "-"}
                      </td>
                      <td className="text-center">
                        {survey.rating_vehicle ?? "-"}
                      </td>
                      <td className="text-center">
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
                  );
                })
              )}
            </tbody>

            <tfoot className="bg-green-50 font-medium">
              <tr>
                <td colSpan="6" className="py-5 text-left text-gray-700">
                  Total Responses: {surveys.length}
                </td>
                <td colSpan="1" className="py-5 text-left text-gray-700">
                  {selectedDriver && overallAverage !== null
                    ? "Overalll Average"
                    : ""}
                </td>
                <td className="text-center font-semibold text-gray-700">
                  {selectedDriver && overallAverage !== null
                    ? overallAverage.toFixed(2)
                    : ""}
                </td>
                <td colSpan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </main>
  );
}
