import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  FacebookIcon,
  Mail,
  MapPin,
  PhoneCall,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto font-inter">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>

      {/* Grid Layout */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Customer Input */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-1/2 p-3 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-1/2 p-3 border border-gray-300 rounded"
            />
          </div>

          <input
            type="text"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded"
          />

          <input
            type="text"
            placeholder="Phone Number"
            className="w-full p-3 border border-gray-300 rounded"
          />

          <textarea
            placeholder="Your Message"
            className="w-full p-3 border border-gray-300 rounded h-40"
          ></textarea>

          <button className="bg-green-600 hover:bg-blue-700 text-white px-6 py-3 rounded mt-2">
            Submit
          </button>
        </div>

        {/* Right: Company Info */}
        <div className="bg-green-600 text-white p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>

          <p>
            Formerly located at the D&E and CDC Buildings, 1050 Quezon Avenue,
            Paligsahan, their office is now inside Triangle Park at the National
            Government Center in Quezon City.<strong></strong>
          </p>

          <p>
            <strong>
              <PhoneCall className="h-10 w-4 inline-block mr-2" /> Phone:
            </strong>{" "}
            (929) 190-9119
          </p>
          <p>
            <strong>
              <Mail className="h-10 w-4 inline-block mr-2" /> Email:
            </strong>{" "}
            nea.motorpool@gmail.com{" "}
          </p>
          <p>
            <strong>
              <MapPin className="h-4 w-4 inline-block mr-2" /> Address:
            </strong>{" "}
            57 NEA Building, NIA Road, Government Center, Diliman , Quezon City,
            Philippines, 1001
          </p>

          <div className="flex justify-center items-center gap-6">
            <a
              href="https://twitter.com/nea_ph"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d1dadf] text-4xl transition duration-200 hover:scale-110"
            >
              <TwitterIcon className="w-8 h-20" />
            </a>

            <a
              href="https://www.youtube.com/@NEAPhilippines"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e2e2d1] text-3xl transition duration-200 hover:scale-110"
            >
              <YoutubeIcon className="w-8 h-20" />
            </a>
            <a
              href="https://www.facebook.com/NEAPhilippines"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e2e2d1] text-3xl transition duration-200 hover:scale-110"
            >
              <FacebookIcon className="w-8 h-20" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
