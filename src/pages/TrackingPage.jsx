import { ClockCheck, ClockFading } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-6 text-center text-2xl font-bold">PMS Tracking</h1>

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
                  navigate("/track-release");
                }
              }}
            />
          </div>
        </div>
      </div>

      {cars.map((car) => (
        <div key={car.id} className="mb-6 rounded-xl bg-white p-4">
          <div className="mb-4 flex justify-between">
            <div>
              <h2 className="text-lg font-bold">{car.plate}</h2>
              <p className="text-sm text-gray-500">{car.name}</p>
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
