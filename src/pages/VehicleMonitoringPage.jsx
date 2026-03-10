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
      pms: "",
      actualPms: "",
      pmsDate: "",
    },
  ]);

  const toggleBatteryTireForm = (plate) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.plate === plate
          ? { ...v, showBatteryTireForm: !v.showBatteryTireForm }
          : v,
      ),
    );
  };

  const handleSaveBatteryTire = (plate) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.plate === plate
          ? {
              ...v,
              showBatteryTireForm: false,
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

      {/* TABS */}
      <div role="tablist" className="tabs tabs-border mb-6">
        <Link to="/vehiclemonitoring">
          <a role="tab" className="tab tab-active">
            PMS
          </a>
        </Link>

        <Link to="/battery">
          <a role="tab" className="tab">
            Battery
          </a>
        </Link>

        <Link to="/tires">
          <a role="tab" className="tab">
            Tires
          </a>
        </Link>
      </div>

      {/* VEHICLE CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div
            key={v.plate}
            className={`card border-2 shadow bg-base-100 ${
              v.status === "overdue"
                ? "border-red-400 bg-red-50"
                : "border-base-300"
            }`}
          >
            <div className="card-body">
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

              {/* VEHICLE IMAGE */}
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

              <p className="mt-3 text-sm">Latest PMS Date:</p>
              <p className="font-semibold text-sm">
                {v.status === "overdue" ? "Not yet recorded" : "2026-01-15"}
              </p>

              <p className="mt-3 text-sm">Next PMS Date:</p>
              <p className="font-semibold text-sm">
                {v.status === "overdue" ? "Not yet recorded" : "2026-01-15"}
              </p>

              <p
                className={`mt-3 font-bold ${
                  v.status === "overdue" ? "text-red-600" : "text-green-600"
                }`}
              >
                {v.status === "overdue" ? "PMS OVERDUE" : "PMS Up to Date"}
              </p>

              {/* UPDATE BUTTON */}
              {v.status === "overdue" && !v.showBatteryTireForm && (
                <button
                  onClick={() => toggleBatteryTireForm(v.plate)}
                  className="btn bg-green-600 text-white mt-4"
                >
                  Update PMS
                </button>
              )}

              {/* PMS FORM */}
              {v.status === "overdue" && v.showBatteryTireForm && (
                <div className="mt-2 border border-dashed p-3 rounded-sm bg-green-100 space-y-4">
                  <div>
                    <label className="text-sm font-medium">PMS</label>
                    <input
                      type="text"
                      value={v.pms}
                      onChange={(e) =>
                        handleVehicleChange(v.plate, "pms", e.target.value)
                      }
                      className="input input-bordered w-full mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Actual PMS</label>
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
                      className="input input-bordered w-full mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <input
                      type="date"
                      value={v.pmsDate}
                      onChange={(e) =>
                        handleVehicleChange(v.plate, "pmsDate", e.target.value)
                      }
                      className="input input-bordered w-full mt-1"
                    />
                  </div>

                  <button
                    onClick={() => handleSaveBatteryTire(v.plate)}
                    className="btn bg-green-600 text-white w-full"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}