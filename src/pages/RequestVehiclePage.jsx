import { Car, CircleCheckBig } from "lucide-react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";

const vehicleRequestSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
  department: z
    .string()
    .nonempty({ message: "Department/Division/Office is required" }),
  destination: z.string().nonempty({ message: "Destination is required" }),
  departureTime: z.string().nonempty({ message: "Departure time is required" }),
  departureDate: z.string().nonempty({ message: "Departure date is required" }),
  purpose: z.string().nonempty({ message: "Purpose of travel is required" }),
  items: z.string().optional(),
  passengers: z
    .string()
    .nonempty({ message: "Passenger name(s) are required" }),
  travelDuration: z
    .string()
    .nonempty({ message: "Travel duration is required" }),
  otherInstructions: z.string().optional(),
  passengerContactNumber: z.string().optional(),
  requestedBy: z.string().nonempty({ message: "Requester name is required" }),
});

export default function TransactionsPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vehicleRequestSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestVehicle = async (data) => {
    setIsSubmitting(true);
    const { error } = await supabase.from("service_vehicle_requests").insert([
      {
        email: data.email,
        department: data.department,
        destination: data.destination,
        departure_time: data.departureTime,
        departure_date: data.departureDate,
        purpose: data.purpose,
        items: data.items,
        passengers: data.passengers,
        travel_duration: data.travelDuration,
        other_instructions: data.otherInstructions,
        passenger_contact_number: data.passengerContactNumber,
        requested_by: data.requestedBy,
      },
    ]);

    if (error) {
      toast.error("Failed to request a vehicle. Please try again.", {
        position: "top-center",
      });
    } else {
      toast.success("Vehicle request submitted successfully!", {
        position: "top-center",
      });
      document.getElementById("vehicleRequestModal ")?.close();
      reset();
    }

    setIsSubmitting(false);
  };

  return (
    <main className=" h-full p-8 bg-lime-100">
      <div className="card lg:card-side p-5 w-xl mx-auto bg-white shadow-xl">
        {/* <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
            alt="Album"
          />
        </figure> */}
        <form className="card-body max-w-2xl border-2 border-green-600 rounded-lg border-dashed">
          <div className="mb-4 justify-center items-center text-center p-3">
            <h1 className="text-2xl font-bold tracking-tight">
              Request for NEA Service Vehicle
            </h1>
            <p className="text-gray-500 text-sm">
              Fill up the form to request a vehicle for your official use.
            </p>
          </div>

          <div className="w-full mt-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legendc font-bold">
                Service Vehicle to be used by:
              </legend>
              <p className="font-syle: italic">Department/Division/Offices</p>
              <input
                type="text"
                className="input input-neutral w-full"
                placeholder="Type here"
              />
              {/* <p className="label">Optional</p> */}
            </fieldset>
          </div>
          <div className="w-full mt-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legendc font-bold">
                In going to:
              </legend>
              <p className="font-syle: italic">The Destination</p>
              <input
                type="text"
                className="input input-neutral w-full"
                placeholder="Type here"
              />
              {/* <p className="label">Optional</p> */}
            </fieldset>
          </div>
          <div className="w-full mt-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legendc font-bold">
                Time of Departure:
              </legend>
              <input
                type="time"
                className="input input-neutral w-full"
                placeholder="Type here"
              />
              {/* <p className="label">Optional</p> */}
            </fieldset>
          </div>
          <div className="w-full mt-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legendc font-bold">
                Date of Departure:
              </legend>
              <input
                type="date"
                className="input input-neutral w-full"
                placeholder="Type here"
              />
              {/* <p className="label">Optional</p> */}
            </fieldset>
          </div>
          <div className="w-full mt-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legendc font-bold">
                Purpose of Travel:
              </legend>
              <input
                type="text"
                className="input input-neutral w-full"
                placeholder="Type here"
              />
              {/* <p className="label">Optional</p> */}
            </fieldset>
          </div>
          <div className="flex flex-col gap-5 mt-3">
            <legend className="fieldset-legendc font-bold">With:</legend>
            <div className="inline-flex items-center">
              <label className="relative flex items-center cursor-pointer">
                <input name="radio" type="radio" className="radio h-3 w-3" />
              </label>
              <label className="ml-2 text-slate-600 cursor-pointer text-sm">
                Baggage
              </label>
            </div>

            <div className="inline-flex items-center w-full">
              <label className="relative flex items-center cursor-pointer">
                <input
                  name="radio"
                  type="radio"
                  className="radio h-3 w-3"
                  id="equipment-custom"
                />
              </label>
              <label
                className="ml-2 text-slate-600 cursor-pointer text-sm"
                for="equipment-custom"
              >
                Equipment
              </label>
            </div>

            <div className="inline-flex items-center">
              <label className="relative flex items-center cursor-pointer">
                <input
                  name="radio"
                  type="radio"
                  className="radio h-3 w-3"
                  id="equipment-custom"
                />
              </label>
              <label
                className="ml-2 text-slate-600 cursor-pointer text-sm w-full"
                for="equipment-custom"
              >
                <div className="w-75">
                  <fieldset className="fieldset">
                    <input
                      type="text"
                      className="input input-neutral w-full"
                      placeholder="Others (please specify)"
                    />
                    {/* <p className="label">Optional</p> */}
                  </fieldset>
                </div>
              </label>
            </div>
            <div className="w-full mt-3">
              <fieldset className="fieldset">
                <legend className="fieldset-legendc font-bold">
                  Name of Passenger:
                </legend>
                <p className="font-syle: italic">
                  Input all the names if more than one (1).
                </p>
                <input
                  type="text"
                  className="input input-neutral w-full"
                  placeholder="Type here"
                />
                {/* <p className="label">Optional</p> */}
              </fieldset>
            </div>
            <div className="w-full mt-3">
              <fieldset className="fieldset">
                <legend className="fieldset-legendc font-bold">
                  Duration of Travel:
                </legend>
                <select
                  defaultValue="Pick a browser"
                  className="select w-full select-neutral"
                >
                  <option disabled={true}>Choose</option>
                  <option>Same Day</option>
                  <option>2 Days</option>
                  <option>3 Days</option>
                  <option>4 Days</option>
                  <option>5 Days or more</option>
                </select>
              </fieldset>
            </div>
            <div className="w-full mt-3">
              <fieldset className="fieldset">
                <legend className="fieldset-legendc font-bold">
                  Other Instructions:
                </legend>
                <input
                  type="text"
                  className="input input-neutral w-full"
                  rows="2"
                  placeholder="Type here"
                />
                {/* <p className="label">Optional</p> */}
              </fieldset>
            </div>
            <div className="w-full mt-3">
              <fieldset className="fieldset">
                <legend className="fieldset-legendc font-bold">
                  Contact Number of Passenger:
                </legend>
                <input
                  type="text"
                  className="input input-neutral w-full"
                  placeholder="Type here"
                />
                {/* <p className="label">Optional</p> */}
              </fieldset>
            </div>
            <div className="w-full mt-3">
              <fieldset className="fieldset">
                <legend className="fieldset-legendc font-bold">
                  Requested By:
                </legend>
                <p className="font-syle: italic">
                  Division Manager/Department Manager/Deputy Administrator.
                </p>
                <input
                  type="text"
                  className="input input-neutral w-full"
                  placeholder="Type here"
                />
                {/* <p className="label">Optional</p> */}
              </fieldset>
            </div>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-lg bg-green-600 hover:bg-highlight text-white p-4 w-full">
                <Car className="size-7 mr-2" />
                Request a Vehicle
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
