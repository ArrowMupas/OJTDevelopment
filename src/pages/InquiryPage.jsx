import { FilterIcon, Search, UserRoundX } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import debounce from "lodash.debounce";

export default function InquiryPage() {
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
    <main className="p-7 w-full h-full">
      <h1 className="text-3xl font-bold text-gray-800">Inquiry</h1>
      <p className="text-gray-500 mb-6">All inquiries can be viewed here.</p>

      <div className="space-x-2">
        <label className="input w-1/3 input-neutral">
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

      <h2 className="text-2xl mt-7 font-bold mb-6">Inquiries</h2>

      <div className="bg-base-100 mt-2 border-0">
        <div className="overflow-x-auto rounded-lg">
          <table className="table table-zebra">
            <thead className="bg-green-600 text-white">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact No.</th>
                <th>Message</th>
                <th>Time Sent</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    <div className="flex flex-col justify-center items-center h-20 gap-5">
                      {loading && (
                        <span className="loading loading-spinner text-success"></span>
                      )}

                      {loading ? (
                        <p className="font-bold text-sm">
                          Loading inquiries...
                        </p>
                      ) : (
                        <div className="flex flex-col justify-center items-center gap-2">
                          <UserRoundX className="size-12 text-red-300" />
                          <p className="font-bold text-sm text-red-300">
                            No inquiries found
                          </p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => {
                  const date = new Date(inquiry.created_at);

                  return (
                    <tr key={inquiry.id}>
                      <th>{inquiry.id}</th>

                      <td>
                        {inquiry.first_name} {inquiry.last_name}
                      </td>

                      <td>{inquiry.email}</td>

                      <td>
                        {inquiry.phone_number || (
                          <span className="text-gray-500 text-xs">
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
          </table>
        </div>
      </div>
    </main>
  );
}
