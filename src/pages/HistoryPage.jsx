import React, { useRef } from "react";
import { ArrowLeft, Search, Info, FilterIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
  const navigate = useNavigate();
  const tableRef = useRef();

  // Placeholder function, does nothing
  const handlePrint = () => {
    console.log("Print button clicked");
  };

  return (
    <main className="px-3 py-4 sm:px-5 h-screen pb-25 ">
      <div className="flex gap-2">
        <div className="flex items-center gap-5 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-square btn-warning btn-dash h-full  "
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        <div>
          <h1 className="text-lg font-bold ">Maintenance History</h1>
          <p className="text-gray-500 mb-8 text-sm">
            Check the recent history of vehicle maintenance
          </p>
        </div>
      </div>

      {/* Search and Filter (UI only) */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-15">
        <label className="input input-neutral">
          <Search className="h-4 w-6" />
          <input
            type="search"
            placeholder="Search by plate number..."
            // value={search}
            // onChange={(e) => {
            //   const value = e.target.value;
            //   setSearch(value);
            //   debouncedSearch(value);
            // }}
          />
        </label>

        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn bg-green-600 text-white"
          >
            <FilterIcon className="h-4 w-6" /> Filter
          </div>
          <ul
            tabIndex="-1"
            className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow-sm"
          >
            <li className="rounded-sm focus:bg-highlight">
              <a className="active:bg-highlight">Ascending</a>
            </li>
            <li>
              <a className="active:bg-highlight">Descending</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Print Button
      <button
        onClick={handlePrint}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Print Report
      </button> */}

      {/* Static Table */}
      <div ref={tableRef} className="overflow-x-auto rounded-lg">
        <table className="table ">
          <thead className="bg-green-500 ">
            <tr>
              <th>Date</th>
              <th>Time Updated</th>
              <th>Plate No.</th>
              <th>Activity</th>
              <th>More Info.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2026-03-01</td>
              <td>12:33 PM</td>
              <td>SND 1339</td>
              <td>Battery has been changed.</td>
              <td>
                <div
                  className="tooltip"
                  data-tip="Battery Type: 3SMF Battery Excel"
                >
                  <button className="btn h-2 p-4">
                    <Info
                      className="absolute h-6 w-auto text-black opacity-80"
                      size={30}
                    />
                  </button>
                </div>
              </td>
            </tr>

            <tr className="border-t hover:bg-gray-50">
              <td>2026-02-15</td>
              <td>5:40 PM</td>
              <td>SJX 840</td>
              <td>PMS has been updated.</td>
              <td>
                <div
                  className="tooltip"
                  data-tip="PMS: 40,000km | Actual PMS: 41,342km"
                >
                  <button className="btn h-2 p-4">
                    <Info
                      className="absolute h-6 w-auto text-black opacity-80"
                      size={30}
                    />
                  </button>
                </div>
              </td>
            </tr>

            <tr className="border-t hover:bg-gray-50">
              <td>2026-01-10</td>
              <td>9:04 AM</td>
              <td>SND 1339</td>
              <td>Tire has been changed.</td>
              <td>
                <div className="tooltip" data-tip="Tire Type: 245/70R16">
                  <button className="btn h-2 p-4">
                    <Info
                      className="absolute h-6 w-auto text-black opacity-80"
                      size={30}
                    />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
