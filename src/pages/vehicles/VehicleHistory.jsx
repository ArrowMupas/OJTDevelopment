import { FilterIcon, Search, UserRoundX } from "lucide-react";
import { supabase } from "../../supabaseClient";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import debounce from "lodash.debounce";

export default function VehicleHistory() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function fetchInquiries(searchTerm = "") {
    setLoading(true);

    let query = supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (searchTerm) {
      query = query.or(
        `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`,
      );
    }

    const { data, error } = await query;

    if (error) console.error(error);
    else setInquiries(data);

    setLoading(false);
  }

  useEffect(() => {
    fetchInquiries();
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((value) => fetchInquiries(value), 400),
    [],
  );

  return (
    <main className="h-full w-full space-y-7 px-5 py-4 pb-25">
      <div>
        <h1 className="text-lg font-bold">
          Insurance and Registration History
        </h1>
        <p className="text-sm text-gray-500">
          Insurance and Registration History are stored here.
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
              <a>Time</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-0 bg-white">
        <div className="overflow-x-auto rounded-lg">
          <table className="table">
            <thead className="bg-green-600 text-white">
              <tr>
                <th>Vehicle Name</th>
                <th>Plate No.</th>
                <th>Policy ID</th>
                <th>Policy Number</th>
                <th>Issue Date</th>
                <th>Required Covered</th>
                <th>Period Covered</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center sm:py-40">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="loading loading-infinity loading-xl"></span>
                      <p className="text-gray-500">Loading inquiries...</p>
                    </div>
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center sm:py-40">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="size-8 text-gray-500" />
                      <p className="text-gray-500">No inquiries found</p>
                      <p className="text-xs text-gray-500">
                        {search
                          ? "Try a different search term"
                          : "No inquiries available right now"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => {
                  const date = new Date(inquiry.created_at);

                  return (
                    <tr key={inquiry.id} className="hover:bg-green-50">
                      <th>
                        {inquiry.first_name} {inquiry.last_name}
                      </th>

                      <td>{inquiry.email}</td>

                      <td>
                        {inquiry.phone_number || (
                          <span className="text-xs text-gray-500">
                            Did not give any
                          </span>
                        )}
                      </td>

                      <td>{inquiry.message}</td>

                      <td>{format(date, "hh:mm a")}</td>
                      <td>{format(date, "MMM. d, yyyy")}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot className="bg-green-400 font-medium">
              <tr>
                <td colSpan="8" className="py-5 text-center text-white">
                  Total Requests: {inquiries.length}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </main>
  );
}
