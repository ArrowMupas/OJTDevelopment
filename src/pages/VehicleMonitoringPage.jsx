import React, { useState } from "react";
import { AlertTriangle, CheckCircle, History, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function VehicleMonitoringPage() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([
    {
      plate: "SND 1339",
      model: "Isuzu Dmax",
      status: "overdue",
      showPmsForm: false,
      showBatteryTireForm: false,

      // NEW PMS INPUT FIELDS
      pms: "",
      actualPms: "",
      pmsDate: "",
    },
    {
      plate: "XYZ 123",
      model: "Honda Civic",
      status: "updated",
      showPmsForm: false,
      showBatteryTireForm: false,

      // NEW PMS INPUT FIELDS
      pms: "",
      actualPms: "",
      pmsDate: "",
    },
  ]);

  const togglePmsForm = (plate) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.plate === plate ? { ...v, showPmsForm: !v.showPmsForm } : v,
      ),
    );
  };

  const toggleBatteryTireForm = (plate) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.plate === plate
          ? { ...v, showBatteryTireForm: !v.showBatteryTireForm }
          : v,
      ),
    );
  };

  const handleSavePms = (plate) => {
    setVehicles((prev) =>
      prev.map((v) => (v.plate === plate ? { ...v, showPmsForm: false } : v)),
    );
  };

  const handleSaveBatteryTire = (plate) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.plate === plate
          ? {
              ...v,
              showBatteryTireForm: false,
              batteryChecked: false,
              tiresChecked: false,
            }
          : v,
      ),
    );
  };

  const handleVehicleChange = (plate, field, value) => {
    setVehicles((prev) =>
      prev.map((v) => (v.plate === plate ? { ...v, [field]: value } : v)),
    );
  };

  return (
    <main className="px-3 py-4 sm:px-5  h-full pb-25 ">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center ">
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              Motorpool Compliance Monitoring
            </h1>
            <p className="text-gray-500 text-sm mb-6">PMS Monitoring</p>
          </div>

          <button
            onClick={() => navigate("/history")}
            className="bg-green-600 text-white px-5 py-2 rounded-2xl flex items-center gap-2"
          >
            <History size={18} /> View History
          </button>
        </div>

        <label className="input input-neutral mb-7">
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

        <div role="tablist" className="tabs tabs-box mb-6">
          <Link to="/vehiclemonitoring" className="tab tab-active">
            PMS
          </Link>

          <Link to="/battery" className="tab ">
            Battery
          </Link>

          <Link to="/tires" className="tab ">
            Tires
          </Link>
        </div>

        {/* VEHICLE CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div
              key={v.plate}
              className={`p-6 rounded-2xl shadow border-2 ${
                v.status === "overdue"
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="font-bold text-lg">{v.plate}</h2>
                  <p className="text-xs text-gray-500">{v.model}</p>
                </div>

                {v.status === "overdue" ? (
                  <AlertTriangle className="text-red-600 w-6 h-6" />
                ) : (
                  <CheckCircle className="text-green-600 w-6 h-6" />
                )}
              </div>
              <div className="w-full h-32 bg-linear-to-r from-emerald-100 to-green-200 rounded-xl flex items-center justify-center mt-2">
                <div className="text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  <p className="text-sm text-violet-600 font-medium mt-1">
                    Vehicle Image
                  </p>
                </div>
              </div>

              <p className="mt-3">Latest PMS Date:</p>
              <p className="font-semibold">
                {v.status === "overdue" ? "Not yet recorded" : "2026-01-15"}
              </p>

              <p className="mt-3">Next PMS Date:</p>
              <p className="font-semibold">
                {v.status === "overdue" ? "Not yet recorded" : "2026-01-15"}
              </p>

              <p
                className={`mt-3 mb-4 font-bold ${
                  v.status === "overdue" ? "text-red-600" : "text-green-600"
                }`}
              >
                {v.status === "overdue" ? "PMS OVERDUE" : "PMS Up to Date"}
              </p>

              {/* BUTTONS  */}
              {/* {v.status === "overdue" && !v.showPmsForm && (
                <button
                  onClick={() => togglePmsForm(v.plate)}
                  className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-2xl"
                >
                  Mark PMS Done
                </button>
              )}

              {v.status === "overdue" && v.showPmsForm && (
                <div className="mt-4 bg-white">
                  <button
                    onClick={() => handleSavePms(v.plate)}
                    className="w-full bg-yellow-500 text-white py-2 rounded-xl"
                  >
                    Save
                  </button>
                </div>
              )} */}

              {v.status === "overdue" && !v.showBatteryTireForm && (
                <button
                  onClick={() => toggleBatteryTireForm(v.plate)}
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded-xl"
                >
                  Update PMS
                </button>
              )}

              {v.status === "overdue" && v.showBatteryTireForm && (
                <div className="mt-2 border border-dashed p-3 rounded-sm bg-green-100 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      PMS
                    </label>
                    <input
                      type="text"
                      value={v.pms}
                      onChange={(e) =>
                        handleVehicleChange(v.plate, "pms", e.target.value)
                      }
                      className="w-full border rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-[#FAF9F6]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Actual PMS
                    </label>
                    <input
                      type="text"
                      value={v.actualPms}
                      onChange={(e) =>
                        handleVehicleChange(
                          v.plate,
                          "actualPms",
                          e.target.value,
                        )
                      }
                      className="w-full border rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-[#FAF9F6]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={v.pmsDate}
                      onChange={(e) =>
                        handleVehicleChange(v.plate, "pmsDate", e.target.value)
                      }
                      className="w-full border rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-[#FAF9F6]"
                    />
                  </div>

                  <button
                    onClick={() => handleSaveBatteryTire(v.plate)}
                    className="w-full bg-green-600 text-white py-2 rounded-sm"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
