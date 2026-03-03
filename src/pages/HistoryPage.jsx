import React, { useRef } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
  const navigate = useNavigate();
  const tableRef = useRef();

  // Placeholder function, does nothing
  const handlePrint = () => {
    console.log("Print button clicked");
  };

  return (
    <div className="min-h-screen bg-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
            <span className="font-bold text-lg">Back</span>
          </div>
          <h1 className="text-3xl font-bold">History</h1>
        </div>

        {/* Search and Filter (UI only) */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-6">
          {/* Search Input with Icon */}
          <div className="relative w-full md:w-1/2 mb-2 md:mb-0">
            <Search className="absolute top-2 left-2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Plate Number..."
              className="border p-2 pl-9 rounded w-full"
            />
          </div>

          <select className="border p-2 rounded w-full md:w-1/4">
            <option>All Types</option>
            <option>PMS</option>
            <option>Tire</option>
            <option>Battery</option>
          </select>
        </div>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Print Report
        </button>

        {/* Static Table */}
        <div ref={tableRef}>
          <table className="w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Plate No.</th>
                <th className="px-4 py-2 text-center">PMS</th>
                <th className="px-4 py-2 text-center">Battery</th>
                <th className="px-4 py-2 text-center">Tires</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">2026-03-01</td>
                <td className="px-4 py-2">SND 1339</td>
                <td className="text-center">✅</td>
                <td className="text-center">✅</td>
                <td className="text-center"></td>
              </tr>

              <tr className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">2026-02-15</td>
                <td className="px-4 py-2">SJX 840</td>
                <td className="text-center"></td>
                <td className="text-center"></td>
                <td className="text-center">✅</td>
              </tr>

              <tr className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">2026-01-10</td>
                <td className="px-4 py-2">SND 1339</td>
                <td className="text-center">✅</td>
                <td className="text-center">✅</td>
                <td className="text-center">✅</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}