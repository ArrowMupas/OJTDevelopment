import { CirclePlus, ClockCheck, ClockFading, UserPlus } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  "Inspection",
  "Job Order",
  "Spare Parts Complete",
  "On-Going Repair",
  "Accomplished | For Release",
];

const initialCars = [
  {
    id: 1,
    plate: "TA477B",
    name: "Toyota Vios",
    personnel: ["Maintenance 1", "Maintenance 2"],
    step: 3,
  },
  {
    id: 2,
    plate: "XI943A",
    name: "Honda Civic",
    personnel: ["Maintenance 1", "Maintenance 2"],
    step: 2,
  },
  {
    id: 3,
    plate: "EE657B",
    name: "Mitsubishi Mirage",
    personnel: ["Maintenance 1", "Maintenance 2"],
    step: 1,
  },
  {
    id: 4,
    plate: "NIA9436",
    name: "Ford Ranger",
    personnel: ["Maintenance 1", "Maintenance 2"],
    step: 0,
  },
  {
    id: 5,
    plate: "ZIE0093",
    name: "Toyota Hilux",
    personnel: ["Maintenance 1", "Maintenance 2"],
    step: 0,
  },
];

export default function TrackingPage() {
  const [cars, setCars] = useState(initialCars);
  const navigate = useNavigate();

  const updateStatus = (id, newStep) => {
    const updated = cars.map((car) =>
      car.id === id ? { ...car, step: newStep } : car,
    );
    setCars(updated);
  };

  const [selectedCarId, setSelectedCarId] = useState("");
  const [maintenance1, setMaintenance1] = useState("");
  const [maintenance2, setMaintenance2] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Repair and Maintenance
      </h1>

      <button
        className="btn btn-info mb-4 border-green-700 bg-green-700 font-bold text-white shadow-md hover:border-[#30694B] hover:bg-[#30694B]"
        onClick={() => {
          setSelectedCarId("");
          setMaintenance1("");
          setMaintenance2("");
          document.getElementById("trackingModal").showModal();
        }}
      >
        <CirclePlus className="h-4 w-6" /> Add New Tracking
      </button>

      <div className="card-body mb-3 flex-row justify-between rounded-sm border-2 border-green-500 bg-green-500 p-4 shadow-md">
        <h2 className="card-title text-white">
          <ClockFading className="mr-2 h-8 w-12 text-white" />
          Ongoing Tracking
        </h2>
        <div className="tooltip tooltip-left" data-tip="Toggle Vehicle View">
          <div>
            <input
              type="checkbox"
              className="toggle toggle-xl my-auto border-[#30694B] bg-[#30694B] checked:border-[#30694B] checked:bg-[#30694B] checked:text-[#30694B]"
              onChange={(e) => {
                if (e.target.checked) {
                  navigate("/public-track-release");
                }
              }}
            />
          </div>
        </div>
      </div>

      <dialog id="trackingModal" className="modal">
        <div className="modal-box">
          <h1 className="text-xl font-bold">Add New Tracking</h1>
          <p className="mb-4 text-sm text-gray-500">
            Assign personnel and select vehicle
          </p>

          {/* CLOSE BUTTON */}
          <button
            className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
            onClick={() => document.getElementById("trackingModal").close()}
          >
            ✕
          </button>

          {/* FORM */}
          <div className="space-y-4">
            {/* Vehicle Dropdown */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Select Vehicle</span>
              </label>
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
            </div>

            {/* Maintenance 1 */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Maintenance 1</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={maintenance1}
                onChange={(e) => setMaintenance1(e.target.value)}
              />
            </div>

            {/* Maintenance 2 */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Maintenance 2</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={maintenance2}
                onChange={(e) => setMaintenance2(e.target.value)}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              className="btn btn-success [#30694B] w-full bg-[#30694B] text-white shadow-md hover:border-green-700 hover:bg-green-700"
              onClick={() => {
                if (!selectedCarId) return;

                const updated = cars.map((car) => {
                  if (car.id === selectedCarId) {
                    return {
                      ...car,
                      personnel: [maintenance1, maintenance2],
                    };
                  }
                  return car;
                });

                setCars(updated);

                document.getElementById("trackingModal").close();
              }}
            >
              Save Tracking
            </button>
          </div>
        </div>
      </dialog>

      {cars.map((car) => (
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
                onChange={(e) => updateStatus(car.id, Number(e.target.value))}
              >
                {steps.map((label, index) => (
                  <option key={index} value={index}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Progress */}
          <div className="relative flex items-center justify-between">
            <div className="absolute top-3 right-0 left-0 h-1 bg-gray-300"></div>

            {steps.map((label, index) => (
              <div
                key={index}
                className="relative z-10 flex flex-1 flex-col items-center"
              >
                <div
                  className={`mb-1 h-6 w-6 rounded-full ${
                    index <= car.step ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
                <span className="text-center text-xs">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 text-sm text-gray-700">
            <p className="font-semibold">Assigned Personnel:</p>
            <ul className="list-inside list-disc">
              {car.personnel.map((person, index) => (
                <li key={index}>{person}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
