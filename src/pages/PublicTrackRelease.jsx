import {
  Check,
  CheckCheck,
  ClockCheck,
  ClockFading,
  SquareCheckBig,
} from "lucide-react";
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
    step: 5,
  },
  {
    id: 2,
    plate: "XI943A",
    name: "Honda Civic",
    personnel: ["Maintenance 1", "Maintenance 2"],
    step: 5,
  },
  {
    id: 3,
    plate: "EE657B",
    name: "Mitsubishi Mirage",
    personnel: ["Maintenance 1", "Maintenance 2"],
    step: 5,
  },
  {
    id: 4,
    plate: "NIA9436",
    name: "Ford Ranger",
    personnel: ["Maintenance 1", "Maintenance 2"],
    step: 5,
  },
  {
    id: 5,
    plate: "ZIE0093",
    name: "Toyota Hilux",
    personnel: ["Maintenance 1", "Maintenance 2"],
    step: 5,
  },
];

export default function PublicTrackRelease() {
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
      <h1 className="text-2xl font-bold text-center mb-6">PMS Tracking</h1>

      <div className="card-body flex-row justify-between bg-[#30694B] border-[#30694B] border-2 rounded-sm shadow-md mb-3 p-4">
        <h2 className="card-title text-white">
          <ClockCheck className="h-8 w-12 mr-2 text-white" />
          For Release
        </h2>
        <div className="tooltip tooltip-left" data-tip="Toggle Vehicle View">
          <div>
            <input
              type="checkbox"
              className="toggle toggle-xl my-auto border-green-500 bg-green-500 checked:border-[#30694B] checked:bg-[#30694B] checked:text-[#30694B]"
              onChange={(e) => {
                if (e.target.checked) {
                  navigate("/public-track");
                }
              }}
            />
          </div>
        </div>
      </div>

      {cars.map((car) => (
        <div key={car.id} className="bg-white rounded-xl  p-4 mb-6">
          <div className="flex justify-between mb-4">
            <div>
              <h2 className="font-bold text-lg">{car.plate}</h2>
              <p className="text-sm text-gray-600">{car.name}</p>
            </div>
            <div>
              <p className="text-sm font-bold"></p>
              <div className="badge badge-primary badge-dash badge-sm border-green-400 text-green-500">
                <CheckCheck className="text-green-500" />
                Complete
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="relative flex items-center justify-between">
            <div className="absolute top-3 left-0 right-0 h-1 bg-gray-300"></div>

            {steps.map((label, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center relative z-10"
              >
                <div
                  className={`w-6 h-6 rounded-full mb-1 ${
                    index <= car.step ? "bg-[#30694B]" : "bg-gray-300"
                  }`}
                ></div>
                <span className="text-xs text-center">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 text-sm text-gray-700">
            <p className="font-semibold">Assigned Personnel:</p>
            <ul className="list-disc list-inside">
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
