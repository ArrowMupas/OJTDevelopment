import { FolderClock, Search, ArrowLeft, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const internalSteps = [
  "Inspection",
  "Job Order",
  "Spare Parts Complete",
  "On-Going Repair",
  "Accomplished | For Release",
];

const externalSteps = [
  "Inspection",
  "Job Order",
  "Received Disbursement Voucher with Check",
  "On-Going Repair",
  "Accomplished | For Release",
];

const miniSteps = ["Inspection", "Accomplished | For Release"];

export default function TrackingHistory() {
  const [repairs, setRepairs] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");

  const navigate = useNavigate(); // ✅ ADD

  const getSteps = (type) => {
    if (type === "internal-mini") return miniSteps;
    if (type === "external") return externalSteps;
    return internalSteps;
  };

  async function fetchRecords() {
    const { data, error } = await supabase
      .from("maintenance_records")
      .select(
        `
        *,
        vehicles (
          name,
          plate_number
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const finished = data.filter((item) => {
      const steps = getSteps(item.type);
      return item.step === steps.length - 1;
    });

    setRepairs(finished);
    setFiltered(finished);
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    let temp = [...repairs];

    if (filterType !== "all") {
      temp = temp.filter((r) => r.type === filterType);
    }

    if (search) {
      const keyword = search.toLowerCase();

      temp = temp.filter(
        (r) =>
          r.vehicles?.name?.toLowerCase().includes(keyword) ||
          r.vehicles?.plate_number?.toLowerCase().includes(keyword) ||
          r.service_shop?.toLowerCase().includes(keyword),
      );
    }

    setFiltered(temp);
  }, [search, filterType, repairs]);

  return (
    <main className="min-h-screen space-y-7 px-3 py-4 pb-25 sm:px-5">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-square btn-warning btn-dash h-auto"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold">Repair History</h1>
            <p className="text-sm text-gray-500">
              View your vehicle&apos;s repair history
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:w-full sm:flex-row sm:items-center sm:justify-end">
          <div className="relative w-full bg-transparent sm:w-62.5 md:w-82.5 lg:w-87.5">
            <SearchIcon className="absolute text-black" />
            <input
              type="text"
              placeholder="Search vehicle, plate, shop..."
              className="input input-bordered w-full pl-9 text-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="select text-green-700"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="internal">Internal</option>
            <option value="external">External</option>
            <option value="internal-mini">Internal (Mini Repair)</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center text-gray-500">
            No completed records found
          </div>
        )}

        {filtered.map((repair) => {
          const steps = getSteps(repair.type);

          const personnel = [
            repair.assigned_personnel_1,
            repair.assigned_personnel_2,
          ].filter(Boolean);

          return (
            <div
              key={repair.id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              {/* HEADER */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {repair.vehicles?.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {repair.vehicles?.plate_number}
                  </p>
                </div>

                <div className="badge badge-success">Completed</div>
              </div>

              {/* TIMELINE */}
              <div className="relative flex justify-between">
                <div className="absolute top-2 right-0 left-0 h-1 bg-green-500" />

                {steps.map((label, index) => (
                  <div
                    key={index}
                    className="flex flex-1 flex-col items-center"
                  >
                    <div className="h-4 w-4 rounded-full bg-green-500" />
                    <span className="mt-2 text-center text-xs">{label}</span>
                  </div>
                ))}
              </div>

              {/* DETAILS */}
              <div className="mt-6 text-sm">
                {repair.type === "external" ? (
                  <>
                    <p className="font-semibold">Service Shop:</p>
                    <p className="text-gray-600">
                      {repair.service_shop || "N/A"}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold">Personnel:</p>
                    <ul className="list-disc pl-5">
                      {personnel.length > 0 ? (
                        personnel.map((p, i) => <li key={i}>{p}</li>)
                      ) : (
                        <li className="text-gray-400">No personnel assigned</li>
                      )}
                    </ul>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
