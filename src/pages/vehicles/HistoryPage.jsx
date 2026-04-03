import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Search, Info, FilterIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import debounce from "lodash.debounce";
import { format } from "date-fns";

export default function HistoryPage() {
  const navigate = useNavigate();
  const tableRef = useRef();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([
    "tire",
    "battery",
    "pms",
  ]);

  const fetchHistory = async (
    searchTerm = "",
    types = ["tire", "battery", "pms"],
  ) => {
    setLoading(true);

    let query = supabase
      .from("vehicle_history")
      .select(
        `
      *,
      vehicle:vehicle_id!inner (
        name,
        plate_number
      )
    `,
      )
      .order("changed_at", { ascending: false });

    if (types.length > 0) {
      query = query.in("change_type", types);
    }

    if (searchTerm) {
      query = query.or(
        `name.ilike.%${searchTerm}%,plate_number.ilike.%${searchTerm}%,plate_number.ilike.%${searchTerm}%`,
        { foreignTable: "vehicle" },
      );
    }

    const { data, error } = await query;
    if (error) console.error(error);
    else setHistory(data);

    setLoading(false);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((search, types) => {
        fetchHistory(search, types);
      }, 400),
    [],
  );

  useEffect(() => {
    fetchHistory("", selectedTypes);
  }, []);

  useEffect(() => {
    debouncedSearch(search, selectedTypes);
  }, [search, selectedTypes]);

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const formatValue = (value) => {
    if (value === null || value === undefined) return "-";

    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return format(date, "MMM. d, yyyy");
        }
      } catch {}
    }

    return value;
  };

  return (
    <main className="min-h-screen space-y-7 px-3 py-4 pb-25 sm:px-5">
      <div className="flex gap-2">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-square btn-warning btn-dash h-full"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        <div>
          <h1 className="text-lg font-bold">Maintenance History</h1>
          <p className="text-sm text-gray-500">
            Check the recent history of vehicle maintenance
          </p>
        </div>
      </div>

      {/* Search and Filter (UI only) */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
        <label className="input input-neutral w-auto">
          <Search className="h-4 w-6" />
          <input
            type="search"
            placeholder="Search by plate number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <form className="flex w-full flex-wrap gap-2 sm:w-fit">
          {["tire", "battery", "pms"].map((type) => (
            <input
              key={type}
              type="checkbox"
              className={`btn flex-1 ${
                selectedTypes.includes(type) ? "btn-success" : ""
              }`}
              aria-label={type.toUpperCase()}
              checked={selectedTypes.includes(type)}
              onChange={(e) => {
                let newSelection;
                if (e.target.checked) {
                  newSelection = [...selectedTypes, type];
                } else {
                  newSelection = selectedTypes.filter((t) => t !== type);
                }
                setSelectedTypes(newSelection);
              }}
            />
          ))}
          <input
            type="button"
            value="All"
            className="btn btn-outline flex-1"
            onClick={() => {
              const all = ["tire", "battery", "pms"];
              setSelectedTypes(all);
            }}
          />
        </form>
      </div>

      <div ref={tableRef} className="overflow-auto rounded-lg">
        <table className="table">
          <thead className="bg-green-500 text-white">
            <tr>
              <th>Date</th>
              <th>Time Updated</th>
              <th>Plate No.</th>
              <th>Activity</th>
              <th>Old Data</th>
              <th>New Data</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-4 text-center">
                  <span className="loading loading-spinner text-success"></span>{" "}
                  Loading history...
                </td>
              </tr>
            ) : history.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">
                  No history found
                </td>
              </tr>
            ) : (
              history.map((h) => {
                const changedAt = new Date(h.changed_at);
                const date = format(changedAt, "MMM dd yyyy");
                const time = format(changedAt, "hh:mm a");

                return (
                  <tr key={h.id} className="border-t hover:bg-gray-50">
                    <td>{date}</td>
                    <td>{time}</td>
                    <td>
                      {h.vehicle ? (
                        <div className="flex gap-2">
                          <p>{h.vehicle.name}</p>
                          <div className="badge badge-primary badge-dash badge-sm">
                            {h.vehicle.plate_number}
                          </div>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="uppercase">{h.change_type}</td>
                    <td className="text-sm">
                      {h.old_value &&
                        Object.entries(h.old_value).map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <p className="text-gray-500 capitalize">
                              {key.replace(/_/g, " ")}:
                            </p>{" "}
                            <p>{formatValue(value)}</p>
                          </div>
                        ))}
                    </td>

                    <td className="text-sm">
                      {h.new_value &&
                        Object.entries(h.new_value).map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <p className="text-gray-500 capitalize">
                              {key.replace(/_/g, " ")}:
                            </p>{" "}
                            <p>{formatValue(value)}</p>
                          </div>
                        ))}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
