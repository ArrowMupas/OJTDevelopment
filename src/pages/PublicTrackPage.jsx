import { CirclePlus, ClockFading } from "lucide-react";
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

  const [selectedCarId, setSelectedCarId] = useState("");
  const [maintenance1, setMaintenance1] = useState("");
  const [maintenance2, setMaintenance2] = useState("");
  const [type, setType] = useState("");

  const updateStep = (id, action) => {
    const updated = cars.map((car) => {
      if (car.id !== id) return car;

      const steps = car.type === "internal-mini" ? miniSteps : fullSteps;

      let newStep = car.step;

      if (action === "next" && car.step < steps.length - 1) newStep++;
      if (action === "prev" && car.step > 0) newStep--;

      return { ...car, step: newStep };
    });

    setCars(updated);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Repair and Maintenance
      </h1>

      {/* ADD BUTTON */}
      <button
        className="btn mb-4 border-green-700 bg-green-700 font-bold text-white shadow-md hover:bg-[#30694B]"
        onClick={() => {
          setSelectedCarId("");
          setMaintenance1("");
          setMaintenance2("");
          setType("");
          document.getElementById("trackingModal").showModal();
        }}
      >
        <CirclePlus className="h-4 w-6" /> Add New Repair
      </button>

      {/* HEADER */}
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

      {/* MODAL */}
      <dialog id="trackingModal" className="modal">
        <div className="modal-box">
          <h1 className="mb-3 text-xl font-bold">Add New Repair</h1>

          <button
            className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
            onClick={() => document.getElementById("trackingModal").close()}
          >
            ✕
          </button>

          <div className="space-y-4">
            <select
              className="select select-bordered w-full"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select type</option>
              <option value="external">External</option>
              <option value="internal">Internal</option>
              <option value="internal-mini">Internal (Mini Repair)</option>
            </select>

            <select
              className="select select-bordered w-full"
              value={selectedCarId}
              onChange={(e) => setSelectedCarId(Number(e.target.value))}
            >
              <option value="">Select vehicle</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.name} ({car.plate})
                </option>
              ))}
            </select>
            <h1 className="text-sm font-bold">Maintenance Personnel</h1>

            <input
              type="text"
              placeholder="Maintenance 1"
              className="input input-bordered w-full"
              value={maintenance1}
              onChange={(e) => setMaintenance1(e.target.value)}
            />

            <input
              type="text"
              placeholder="Maintenance 2"
              className="input input-bordered w-full"
              value={maintenance2}
              onChange={(e) => setMaintenance2(e.target.value)}
            />

            <button
              className="btn w-full bg-[#30694B] text-white"
              onClick={() => {
                if (!selectedCarId || !type) return;

                const updated = cars.map((car) => {
                  if (car.id === selectedCarId) {
                    return {
                      ...car,
                      personnel: [maintenance1, maintenance2],
                      type,
                      step: 0,
                    };
                  }
                  return car;
                });

                setCars(updated);
                document.getElementById("trackingModal").close();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </dialog>

      {/* CAR LIST */}
      {cars
        .filter((car) => car.type === viewType)
        .map((car) => {
          const steps = car.type === "internal-mini" ? miniSteps : fullSteps;

          return (
            <div key={car.id} className="mb-6 rounded-xl bg-white p-6 shadow">
              <div className="mb-4">
                <h2 className="text-lg font-bold">{car.plate}</h2>
                <p className="text-sm text-gray-500">{car.name}</p>
              </div>

              {/* ✅ FIXED TIMELINE */}
              <div className="relative mt-12 w-full">
                {/* CONTINUOUS LINE */}
                <div className="absolute top-2 right-0 left-0 h-1 bg-gray-300" />

                <div className="relative flex justify-between">
                  {steps.map((label, index) => {
                    const isActive = index <= car.step;
                    const isCurrent = index === car.step;

                    return (
                      <div
                        key={index}
                        className="relative flex flex-1 flex-col items-center"
                      >
                        {/* BUTTONS */}
                        {isCurrent && (
                          <div className="absolute -top-10 flex gap-2">
                            {car.step > 0 && (
                              <button
                                className="btn btn-xs bg-gray-300"
                                onClick={() => updateStep(car.id, "prev")}
                              >
                                Undo
                              </button>
                            )}
                            {car.step < steps.length - 1 && (
                              <button
                                className="btn btn-xs bg-green-600 text-white"
                                onClick={() => updateStep(car.id, "next")}
                              >
                                Proceed
                              </button>
                            )}
                          </div>
                        )}

                        {/* DOT */}
                        <div
                          className={`z-10 h-4 w-4 rounded-full ${
                            isActive ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />

                        {/* LABEL */}
                        <span className="mt-2 text-center text-xs">
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

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
