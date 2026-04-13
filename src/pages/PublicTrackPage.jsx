import { ClockFading } from "lucide-react";
import React, { useState } from "react";

// FULL STEPS
const fullSteps = [
  "Inspection",
  "Job Order",
  "Spare Parts Complete",
  "On-Going Repair",
  "Accomplished | For Release",
];

// MINI STEPS
const miniSteps = ["Inspection", "Accomplished | For Release"];

const initialCars = [
  {
    id: 1,
    plate: "TA477B",
    name: "Toyota Vios",
    personnel: ["Maintenance 1", "Maintenance 2"],
    step: 0,
    type: "internal",
  },
  {
    id: 2,
    plate: "XI943A",
    name: "Honda Civic",
    personnel: ["Maintenance 1", "Maintenance 2"],
    step: 0,
    type: "external",
  },
];

export default function TrackingPage() {
  const [cars, setCars] = useState(initialCars);
  const [viewType, setViewType] = useState("internal");

  const updateStep = (id, action) => {
    const updated = cars.map((car) => {
      if (car.id !== id) return car;

      const steps = car.type === "internal-mini" ? miniSteps : fullSteps;

      let newStep = car.step;

      if (action === "next" && car.step < steps.length - 1) {
        newStep++;
      }

      if (action === "prev" && car.step > 0) {
        newStep--;
      }

      return { ...car, step: newStep };
    });

    setCars(updated);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Repair and Maintenance
      </h1>

      {/* HEADER + FILTER */}
      <div className="mb-4 flex items-center justify-between rounded-xl border border-green-200 bg-green-600 p-5 shadow-lg">
        <div className="text-white">
          <h2 className="text-xl font-bold">Repair Tracking</h2>
          <p className="text-sm opacity-90">
            Monitor vehicle repair progress and status
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 shadow">
          <div className="rounded-md bg-[#30694B] p-2">
            <ClockFading className="h-5 w-5 text-white" />
          </div>

          <select
            className="select select-sm border-none bg-white font-medium text-[#30694B]"
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
          >
            <option value="internal">Internal</option>
            <option value="external">External</option>
            <option value="internal-mini">Internal (Mini Repair)</option>
          </select>
        </div>
      </div>

      {/* CAR LIST */}
      {cars
        .filter((car) => car.type === viewType)
        .map((car) => {
          const steps = car.type === "internal-mini" ? miniSteps : fullSteps;

          return (
            <div key={car.id} className="mb-6 rounded-xl bg-white p-6 shadow">
              {/* CAR INFO */}
              <div className="mb-4">
                <h2 className="text-lg font-bold">{car.plate}</h2>
                <p className="text-sm text-gray-500">{car.name}</p>
              </div>

              {/* ✅ DAISYUI TIMELINE (FIXED FULL WIDTH SPACING) */}
              <ul className="timeline timeline-horizontal w-full">
                {steps.map((label, index) => {
                  const isActive = index <= car.step;
                  const isCurrent = index === car.step;

                  return (
                    <li key={index} className="relative flex-1">
                      {/* LINE BEFORE */}
                      {index !== 0 && (
                        <hr
                          className={isActive ? "bg-green-500" : "bg-gray-300"}
                        />
                      )}

                      {/* DOT */}
                      <div className="timeline-middle flex justify-center">
                        <div
                          className={`h-4 w-4 rounded-full ${
                            isActive ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                      </div>

                      {/* LABEL */}
                      <div className="timeline-end mt-2 text-center text-xs">
                        {label}
                      </div>

                      {/* ACTION BUTTONS */}
                      {isCurrent && (
                        <div className="mt-3 flex justify-center gap-2">
                          {car.step > 0 && (
                            <button
                              className="btn btn-sm bg-gray-300"
                              onClick={() => updateStep(car.id, "prev")}
                            >
                              Undo
                            </button>
                          )}

                          {car.step < steps.length - 1 && (
                            <button
                              className="btn btn-sm bg-green-600 text-white"
                              onClick={() => updateStep(car.id, "next")}
                            >
                              Proceed
                            </button>
                          )}
                        </div>
                      )}

                      {/* LINE AFTER */}
                      {index !== steps.length - 1 && (
                        <hr
                          className={isActive ? "bg-green-500" : "bg-gray-300"}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* PERSONNEL */}
              <div className="mt-6 text-sm text-gray-700">
                <p className="font-semibold">Assigned Personnel:</p>
                <ul className="list-inside list-disc">
                  {car.personnel.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
    </div>
  );
}
