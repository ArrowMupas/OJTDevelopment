import React from "react";
import cardbg from "../../assets/carbg.jpg";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">

      {/* Background Image */}
      <img 
      src={cardbg}
      alt="background"
      className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Content */}
      <div className="relative flex items-center justify-center min-h-screen text-center px-6">
        <div className="max-w-4xl text-white">

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Request a Service Vehicle{" "}
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-10">
            Submit your official transport request to the Transport Operations Services Unit for approval.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">


            {/* Primary Button */}
            <button
              onClick={() => window.location.href = "/request"}
              className="bg-green-600 hover:bg-green-600   text-white font-semibold px-6 py-3 rounded-md shadow-md transition"
            >
              Request Vehicle
            </button>

          </div>

        </div>
      </div>

    </div>
  );
}
