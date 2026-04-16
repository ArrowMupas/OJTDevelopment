import { FilterIcon, Search } from "lucide-react";
import { supabase } from "../../supabaseClient";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import debounce from "lodash.debounce";

export default function SurveyPage() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function fetchSurveys(searchTerm = "") {
    setLoading(true);

    let query = supabase
      .from("passenger_survey")
      .select("*")
      .order("timestamp", { ascending: false });

    if (searchTerm) {
      query = query.or(
        `passenger_name.ilike.%${searchTerm}%,comments.ilike.%${searchTerm}%`,
      );
    }

    const { data, error } = await query;

    if (error) console.error(error);
    else setSurveys(data);

    setLoading(false);
  }

  useEffect(() => {
    fetchSurveys();
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((value) => fetchSurveys(value), 400),
    [],
  );

  return (
    <main className="h-full w-full space-y-7 px-5 py-4 pb-25">
      <div>
        <h1 className="text-lg font-bold">Passenger Survey</h1>
        <p className="text-sm text-gray-500">
          All passenger survey responses can be viewed here.
        </p>
      </div>

      <div className="space-x-2">
        <label className="input input-neutral">
          <Search className="h-4 w-6" />
          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              debouncedSearch(value);
            }}
          />
        </label>

        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn bg-green-600 text-white"
          >
            <FilterIcon className="h-4 w-6" />
            Filter
          </div>

          <ul
            tabIndex={-1}
            className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li>
              <a>Ascending</a>
            </li>
            <li>
              <a>Descending</a>
            </li>
            <li>
              <a>Date</a>
            </li>
            <li>
              <a>Rating</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-0 bg-white">
        <div className="overflow-x-auto rounded-lg">
          <table className="table min-h-50">
            <thead className="bg-green-600 text-white">
              <tr>
                <th>Name</th>
                <th>Travel Date</th>

                <th className="w-16 text-center" title="Appearance">
                  Appearance Rating
                </th>
                <th className="w-16 text-center" title="Behavior">
                  Behavior Rating
                </th>
                <th className="w-16 text-center" title="Safety">
                  Safety Rating
                </th>
                <th className="w-16 text-center" title="Vehicle">
                  Vehicle Rating
                </th>
                <th className="w-16 text-center" title="On-time">
                  On-time Rating
                </th>

                <th className="w-20 text-center">Avg</th>
                <th>Comments</th>
                <th className="w-40">Date & Time</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center sm:py-40">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="loading loading-infinity loading-xl"></span>
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
                      <th>{survey.passenger_name || "Anonymous"}</th>

                      <td>
                        {survey.travel_date
                          ? format(new Date(survey.travel_date), "MMM d, yyyy")
                          : "-"}
                      </td>

                      {/* Compact Ratings */}
                      <td className="w-16 px-1 text-center">
                        {survey.rating_appearance ?? "-"}
                      </td>
                      <td className="w-16 px-1 text-center">
                        {survey.rating_behavior ?? "-"}
                      </td>
                      <td className="w-16 px-1 text-center">
                        {survey.rating_safety ?? "-"}
                      </td>
                      <td className="w-16 px-1 text-center">
                        {survey.rating_vehicle ?? "-"}
                      </td>
                      <td className="w-16 px-1 text-center">
                        {survey.rating_ontime ?? "-"}
                      </td>

                      <td className="text-center font-semibold">
                        {survey.average_score?.toFixed(2) || "-"}
                      </td>

                      <td>{survey.comments || "-"}</td>

                      <td>{format(date, "MMM d, yyyy • hh:mm a")}</td>
                    </tr>
                  );
                })
              )}
            </tbody>

            <tfoot className="bg-green-400 font-medium">
              <tr>
                <td colSpan="10" className="py-5 text-center text-white">
                  Total Responses: {surveys.length}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </main>
  );
}
