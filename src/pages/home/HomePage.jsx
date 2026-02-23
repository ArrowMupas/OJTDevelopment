import React from "react";
import Neabg from "../../assets/Neabg.png";

export default function HomePage() {
  // Google form link
  const googleFormLink = "https://docs.google.com/forms/d/12wQf-ejjEcC3GBcGb0ISnC2mnr5q8hJkG_f52dMcYAI/viewform";

  return (
    <div className="relative min-h-screen bg-white font-sans overflow-hidden">
      
      {/* Background Image Container */}
      <div className="absolute right-0 top-0 w-full lg:w-2/3 h-full">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${Neabg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 lg:via-transparent to-transparent"></div>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 flex flex-col justify-center min-h-screen">
        <div className="max-w-xl">

          {/* Badge */}
          <div className="inline-block bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
            NEA Motorpool
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
            Official Vehicle <br />
            <span className="text-green-600">Request System</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-md">
            Submit your request to the Transport Operations Services Unit (TOSU) for review and approval.
          </p>

         {/* Button */}
          <div className="flex flex-col items-start">
            <a 
              href={googleFormLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg active:scale-95 no-underline"
            >
              Request Vehicle
            </a>
            
            <p className="mt-4 text-sm text-slate-400 font-medium italic">
              * (1) One vehicle per request.
            </p>


          </div>

        </div>
      </div>
    </div>
  );
}