import { ArrowLeft, FilterIcon, Search } from "lucide-react";
import { supabase } from "../../supabaseClient";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";

export default function VehicleHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function fetchHistory(searchTerm = "") {
    setLoading(true);

    let query = supabase
      .from("vehicle_update_history")
      .select(
        `
        id,
        changes,
        changed_at,
        vehicles (
          name,
          plate_number
        )
      `,
      )
      .order("changed_at", { ascending: false });

    if (searchTerm) {
      query = query
        .ilike("vehicles.name", `%${searchTerm}%`)
        .or(`vehicles.plate_number.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) console.error(error);
    else setHistory(data || []);

    setLoading(false);
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((value) => fetchHistory(value), 400),
    [],
  );

  return (
    <main className="h-full w-full space-y-7 px-5 py-4 pb-25">
      <div className="flex gap-2">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-square btn-neutral btn-dash h-full"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        <div>
          <h1 className="text-lg font-bold">Vehicle Update History</h1>
          <p className="text-sm text-gray-500">All vehicle updates</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <label className="input input-neutral flex items-center">
          <Search className="mr-2 h-4 w-6" />
          <input
            type="search"
            placeholder="Search by name or plate"
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
            <FilterIcon className="mr-1 h-4 w-6" />
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
          </ul>
        </div>
      </div>

      <div className="border-0 bg-white">
        <div className="overflow-x-auto rounded-lg">
          <table className="table">
            <thead className="bg-green-600 text-white">
              <tr>
                <th>Vehicle</th>
                <th>Plate No.</th>
                <th>Changes</th>
                <th>Changed At</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="loading loading-infinity loading-xl"></span>
                      <p className="text-gray-500">
                        Loading vehicle history...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center">
                    <p className="text-gray-500">No vehicle updates found</p>
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-green-50">
                    <th>{item.vehicles?.name || "Unknown"}</th>
                    <td>{item.vehicles?.plate_number || "Unknown"}</td>
                    <td>
                      {Object.entries(item.changes).map(([field, value]) => (
                        <div key={field}>
                          <strong>{field}:</strong> {value.old ?? "—"} →{" "}
                          {value.new ?? "—"}
                        </div>
                      ))}
                    </td>
                    <td>
                      {format(new Date(item.changed_at), "MMM d, yyyy hh:mm a")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            <tfoot className="bg-green-400 font-medium">
              <tr>
                <td colSpan="4" className="py-5 text-center text-white">
                  Total Updates: {history.length}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </main>
  );
}
