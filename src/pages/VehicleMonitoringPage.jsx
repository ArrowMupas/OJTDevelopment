import React, { useState } from "react";
import { AlertTriangle, CheckCircle, History, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VehicleMonitoringPage() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([
    {
      plate: "SND 1339",
      model: "Isuzu Dmax",
      status: "overdue",
      showPmsForm: false,
      showBatteryTireForm: false,
      batteryChecked: false,
      tiresChecked: false,
    },
    {
      plate: "XYZ 123",
      model: "Honda Civic",
      status: "updated",
      showPmsForm: false,
      showBatteryTireForm: false,
      batteryChecked: false,
      tiresChecked: false,
    },
  ]);

  const togglePmsForm = (plate) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.plate === plate ? { ...v, showPmsForm: !v.showPmsForm } : v
      )
    );
  };

  const toggleBatteryTireForm = (plate) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.plate === plate
          ? { ...v, showBatteryTireForm: !v.showBatteryTireForm }
          : v
      )
    );
  };

  const handleSavePms = (plate) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.plate === plate ? { ...v, showPmsForm: false } : v
      )
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
          : v
      )
    );
  };

  const handleVehicleChange = (plate, field, value) => {
    setVehicles((prev) =>
      prev.map((v) => (v.plate === plate ? { ...v, [field]: value } : v))
    );
  };

  return (
    <div className="min-h-screen bg-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold">
              Motorpool Compliance Monitoring
            </h1>
            <p className="text-gray-500">PMS Monitoring</p>
          </div>

          <button
            onClick={() => navigate("/history")}
            className="bg-green-600 text-white px-5 py-2 rounded-2xl flex items-center gap-2"
          >
            <History size={18} /> View History
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-6 relative w-full md:w-1/3">
          <Search className="absolute top-2 left-2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Plate Number..."
            className="border p-2 pl-9 rounded w-full"
          />
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

              <p className="mt-3">Last PMS Date:</p>
              <p className="font-semibold">
                {v.status === "overdue"
                  ? "Not yet recorded"
                  : "2026-01-15"}
              </p>

              <p
                className={`mt-2 font-bold ${
                  v.status === "overdue"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {v.status === "overdue"
                  ? "PMS OVERDUE"
                  : "PMS Up to Date"}
              </p>

              {/* BUTTONS  */}
              {v.status === "overdue" && !v.showPmsForm && (
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
              )}

              {v.status === "overdue" && !v.showBatteryTireForm && (
                <button
                  onClick={() => toggleBatteryTireForm(v.plate)}
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded-2xl"
                >
                  Update Battery/Tires
                </button>
              )}

              {v.status === "overdue" && v.showBatteryTireForm && (
                <div className="mt-4 border p-4 rounded-xl bg-gray-50 space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={v.batteryChecked}
                      onChange={(e) =>
                        handleVehicleChange(
                          v.plate,
                          "batteryChecked",
                          e.target.checked
                        )
                      }
                    />
                    Battery Changed
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={v.tiresChecked}
                      onChange={(e) =>
                        handleVehicleChange(
                          v.plate,
                          "tiresChecked",
                          e.target.checked
                        )
                      }
                    />
                    Tires Changed
                  </label>

                  <button
                    onClick={() => handleSaveBatteryTire(v.plate)}
                    className="w-full bg-green-600 text-white py-2 rounded-xl"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}