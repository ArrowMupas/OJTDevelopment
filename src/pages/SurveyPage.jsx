import React, { useState } from "react";

export default function SurveyPage() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");

  const capitalizeFirstLetter = (value) => {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  };

  const drivers = [
    "Juan Dela Cruz",
    "Pedro Santos",
    "Mark Reyes",
    "Anthony Garcia",
  ];

  const vehicles = [
    "Toyota Hiace",
    "Mitsubishi L300",
    "Isuzu Elf",
    "Toyota Innova",
  ];

  return (
    <div className="min-h-screen bg-lime-100 flex justify-center p-8">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Passenger Satisfaction Survey
        </h1>
        <p className="text-center text-gray-600 mb-8">Survey for passengers</p>

        <form className="space-y-8">
          {/* Passenger Name */}
          <div>
            <label className="block font-medium mb-3">
              Passenger Name <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) =>
                  setLastName(capitalizeFirstLetter(e.target.value))
                }
                className=" input input-neutral"
                required
              />
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) =>
                  setFirstName(capitalizeFirstLetter(e.target.value))
                }
                className=" input input-neutral"
                required
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block font-medium mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className=" input input-neutral w-full"
              required
            />
          </div>

          {/* Driver Dropdown */}
          <div>
            <label className="block font-medium mb-1">
              Name of Driver <span className="text-red-500">*</span>
            </label>
            <select className=" input input-neutral w-full" required>
              <option value="">-- Select Driver --</option>
              {drivers.map((driver, index) => (
                <option key={index} value={driver}>
                  {driver}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Dropdown */}
          <div>
            <label className="block font-medium mb-1">
              Type of Vehicle <span className="text-red-500">*</span>
            </label>
            <select className=" input input-neutral w-full" required>
              <option value="">-- Select Vehicle --</option>
              {vehicles.map((vehicle, index) => (
                <option key={index} value={vehicle}>
                  {vehicle}
                </option>
              ))}
            </select>
          </div>

          {/* Driver's Appearance */}
          <div className="border rounded-md p-5">
            <p className="font-medium">
              Driver's Appearance <span className="text-red-500">*</span>
            </p>
            <p className="text-sm italic text-gray-500 mt-1">
              Wearing proper uniform; Maintaining cleanliness and proper
              hygiene; Alert and Attentive, not drowsy.
            </p>
            <p className="text-xs italic text-gray-400 mt-1">
              {`{1 = Poor; 2 = Fair; 3 = Good; 4 = Satisfied; 5 = Excellent}`}
            </p>
            <div className="flex gap-8 mt-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="flex flex-col items-center">
                  <input type="radio" name="appearance" value={num} required />
                  <span className="text-sm">{num}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Driver's Behavior */}
          <div className="border rounded-md p-5">
            <p className="font-medium">
              Driver's Behavior <span className="text-red-500">*</span>
            </p>
            <p className="text-sm italic text-gray-500 mt-1">
              Courteous, reminds passenger to fasten seatbelts before departure;
              ensures discharge of passengers; assists with luggage; avoids
              excessive conversation; provides trip ticket signatures.
            </p>
            <p className="text-xs italic text-gray-400 mt-1">
              {`{1 = Poor; 2 = Fair; 3 = Good; 4 = Satisfied; 5 = Excellent}`}
            </p>
            <div className="flex gap-8 mt-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="flex flex-col items-center">
                  <input type="radio" name="behavior" value={num} required />
                  <span className="text-sm">{num}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Driver's Safety Driving Skills */}
          <div className="border rounded-md p-5">
            <p className="font-medium">
              Driver's Safety Driving Skills{" "}
              <span className="text-red-500">*</span>
            </p>
            <p className="text-sm italic text-gray-500 mt-1">
              Focuses on the road, avoids potholes; adheres to traffic laws;
              does not use cellphone while driving.
            </p>
            <p className="text-xs italic text-gray-400 mt-1">
              {`{1 = Poor; 2 = Fair; 3 = Good; 4 = Satisfied; 5 = Excellent}`}
            </p>
            <div className="flex gap-8 mt-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="flex flex-col items-center">
                  <input type="radio" name="safety" value={num} required />
                  <span className="text-sm">{num}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Vehicle Condition/Cleanliness */}
          <div className="border rounded-md p-5">
            <p className="font-medium">
              Vehicle Condition/Cleanliness{" "}
              <span className="text-red-500">*</span>
            </p>
            <p className="text-sm italic text-gray-500 mt-1">
              Clean and well-maintained vehicle; Pleasant fragrance; Effective
              air conditioning.
            </p>
            <p className="text-xs italic text-gray-400 mt-1">
              {`{1 = Poor; 2 = Fair; 3 = Good; 4 = Satisfied; 5 = Excellent}`}
            </p>
            <div className="flex gap-8 mt-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="flex flex-col items-center">
                  <input type="radio" name="vehicle" value={num} required />
                  <span className="text-sm">{num}</span>
                </label>
              ))}
            </div>
          </div>

          {/* On Time */}
          <div className="border rounded-md p-5">
            <p className="font-medium">
              On Time <span className="text-red-500">*</span>
            </p>
            <p className="text-sm italic text-gray-500 mt-1">
              On call time upon leaving (pick-up) and arrival at destination
              (drop-off).
            </p>
            <p className="text-xs italic text-gray-400 mt-1">
              {`{1 = Poor; 2 = Fair; 3 = Good; 4 = Satisfied; 5 = Excellent}`}
            </p>
            <div className="flex gap-8 mt-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="flex flex-col items-center">
                  <input type="radio" name="ontime" value={num} required />
                  <span className="text-sm">{num}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block font-medium mb-1">
              Comments/Suggestions <span className="text-red-500">*</span>
            </label>
            <p className="text-sm italic text-gray-500 mb-2">
              Comments and suggestions are very well appreciated to improve our
              services. Thank you!
            </p>
            <textarea
              placeholder="bio"
              className=" textarea textarea-neutral w-full"
              required
            ></textarea>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-800 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
