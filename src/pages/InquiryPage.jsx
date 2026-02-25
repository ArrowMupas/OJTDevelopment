import { FilterIcon, Search } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function InquiryPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInquiries() {
      setLoading(true);
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setInquiries(data);
      }
      setLoading(false);
    }
    fetchInquiries();
  }, []);

  return (
    <main className="p-7 w-full h-full">
      <h1 className="text-3xl font-bold text-gray-800">Inquiry</h1>
      <p className="text-gray-500 mb-6">All inquiries can be viewed here.</p>
      <div className="space-x-2">
        <label className="input w-1/3 border-black">
          <Search className="h-4 w-6" />
          <input type="search" required placeholder="Search" />
        </label>
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn  bg-green-600 text-white"
          >
            <FilterIcon className="h-4 w-6" />
            Filter
          </div>
          <ul
            tabIndex="-1"
            className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li className="rounded-sm focus:bg-highlight">
              <a className="active:bg-highlight">Ascending</a>
            </li>
            <li>
              <a className="active:bg-highlight">Descending</a>
            </li>
            <li>
              <a className="active:bg-highlight">Date</a>
            </li>
            <li>
              <a className="active:bg-highlight">Time</a>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl mt-7 font-bold mb-6">Inquiries</h2>
      <div className="bg-base-100 mt-2 border-0">
        <div className="overflow-x-auto rounded-lg">
          <table className="table table-zebra ">
            <thead className="bg-green-600 text-white">
              <tr>
                <th>ID</th> {/*can be hidden */}
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
            <tfoot></tfoot>
          </table>
        </div>
      </div>
    </main>
  );
}
