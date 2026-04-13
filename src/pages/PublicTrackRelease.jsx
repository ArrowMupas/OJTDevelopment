import { ClockCheck } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ FULL EXTERNAL STEPS
const fullSteps = [
  "Inspection",
  "Job Order",
  "Transaction",
  "Auto Repair Service",
  "Accomplished | For Release",
];

// ✅ MINI STEPS
const miniSteps = ["Inspection", "Accomplished | For Release"];

const initialCars = [
  {
    id: 1,
    plate: "TA477B",
    name: "Toyota Vios",
    personnel: ["Maintenance 1", "Maintenance 2"],
    step: 4,
    type: "external",
  },
  {
    id: 2,
    plate: "XI943A",
    name: "Honda Civic",
    personnel: ["Maintenance 1", "Maintenance 2"],
    step: 4,
    type: "external",
  },
  {
    id: 3,
    plate: "EE657B",
    name: "Mitsubishi Mirage",
    personnel: ["Maintenance 1", "Maintenance 2"],
    step: 4,
    type: "internal-mini",
  },
];

export default function PublicTrackRelease() {
  const [cars, setCars] = useState(initialCars);
  const [viewType, setViewType] = useState("external"); // ✅ FILTER STATE
  const navigate = useNavigate();

  const updateStatus = (id, newStep) => {
    const updated = cars.map((car) =>
      car.id === id ? { ...car, step: newStep } : car,
    );
    setCars(updated);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Repair and Maintenance
      </h1>

      {/* ✅ DROPDOWN NAVIGATION */}
      <div className="card-body mb-3 flex-row justify-between rounded-sm border-2 border-[#30694B] bg-[#30694B] p-4 shadow-md">
        <h2 className="card-title flex items-center gap-2 text-white">
          <ClockCheck className="h-8 w-8 text-white" />

          <select
            className="select select-sm text-black"
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
          >
            <option value="external">External</option>
            <option value="internal">Internal</option>
            <option value="internal-mini">Internal (Mini Repair)</option>
          </select>
        </h2>
      </div>

      {/* ✅ FILTERED DISPLAY */}
      {cars
        .filter((car) => car.type === viewType)
        .map((car) => {
          const steps = car.type === "internal-mini" ? miniSteps : fullSteps;

          return (
            <div key={car.id} className="mb-6 rounded-xl bg-white p-4">
              <div className="mb-4 flex justify-between">
                <div>
                  <h2 className="text-lg font-bold">{car.plate}</h2>
                  <p className="text-sm text-gray-500">{car.name}</p>
                </div>

                <div className="mt-2">
                  <select
                    className="select select-sm select-bordered w-full max-w-xs"
                    value={car.step}
                    onChange={(e) =>
                      updateStatus(car.id, Number(e.target.value))
                    }
                  >
                    {steps.map((label, index) => (
                      <option key={index} value={index}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PROGRESS */}
              <div className="relative flex items-center justify-between">
                <div className="absolute top-3 right-0 left-0 h-1 bg-gray-300"></div>

                {steps.map((label, index) => (
                  <div
                    key={index}
                    className="relative z-10 flex flex-1 flex-col items-center"
                  >
                    <div
                      className={`mb-1 h-6 w-6 rounded-full ${
                        index <= car.step ? "bg-[#30694B]" : "bg-gray-300"
                      }`}
                    ></div>
                    <span className="text-center text-xs">{label}</span>
                  </div>
                ))}
              </div>

              {/* PERSONNEL */}
              <div className="mt-5 text-sm text-gray-700">
                <p className="font-semibold">Assigned Personnel:</p>
                <ul className="list-inside list-disc">
                  {car.personnel.map((person, index) => (
                    <li key={index}>{person}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
    </div>
  );
}
