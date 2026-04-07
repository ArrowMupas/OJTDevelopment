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
      <h1 className="mb-6 text-center text-2xl font-bold">
        Repair and Maintenance
      </h1>

      <div className="card-body mb-3 flex-row justify-between rounded-sm border-2 border-[#30694B] bg-[#30694B] p-4 shadow-md">
        <h2 className="card-title text-white">
          <ClockCheck className="mr-2 h-8 w-12 text-white" />
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
        <div key={car.id} className="mb-6 rounded-xl bg-white p-4">
          <div className="mb-4 flex justify-between">
            <div>
              <h2 className="text-lg font-bold">{car.plate}</h2>
              <p className="text-sm text-gray-500">{car.name}</p>
            </div>
            <div>
              <p className="text-sm font-bold"></p>
              <div className="badge badge-primary badge-dash badge-sm text-success border-green-400">
                <CheckCheck className="text-success" />
                Complete
              </div>
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
                    index <= car.step ? "bg-[#30694B]" : "bg-gray-300"
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
