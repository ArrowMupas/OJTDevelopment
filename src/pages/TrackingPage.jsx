import React, { useState } from "react";

const steps = ["Inspection", "For Repair", "Job Order", "Spare Parts Installed", "For Release"];

const initialCars = [
  { id: 1, plate: "TA477B", step: 3 },
  { id: 2, plate: "XI943A", step: 2 },
  { id: 3, plate: "EE657B", step: 1 },
  { id: 4, plate: "NIA9436", step: 0 },
  { id: 5, plate: "ZIE0093", step: 0 },
];

export default function TrackingPage() {
  const [cars, setCars] = useState(initialCars);

  const updateStatus = (id, newStep) => {
    const updated = cars.map((car) =>
      car.id === id ? { ...car, step: newStep } : car
    );
    setCars(updated);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        PMS Tracking
      </h1>

      {cars.map((car) => (
        <div key={car.id} className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex justify-between mb-4">
            <h2 className="font-bold text-lg">{car.plate}</h2>

           
          </div>

          {/* Progress */}
          <div className="relative flex items-center justify-between">
            
            <div className="absolute top-3 left-0 right-0 h-1 bg-gray-300"></div>

            {steps.map((label, index) => (
              <div key={index} className="flex-1 flex flex-col items-center relative z-10">
                <div
                  className={`w-6 h-6 rounded-full mb-1 ${
                    index <= car.step ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
                <span className="text-xs text-center">{label}</span>
              </div>
            ))}
          </div>

         
            </div>
          
      ))}
    </div>
  );
}