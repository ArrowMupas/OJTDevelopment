import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import OurInput from "../components/OurInput";

const vehicleRequestSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
  department: z
    .string()
    .nonempty({ message: "Department/Division/Office is required" }),
  destination: z.string().nonempty({ message: "Destination is required" }),
  departureTime: z.string().nonempty({ message: "Departure time is required" }),
  departureDate: z.string().nonempty({ message: "Departure date is required" }),
  purpose: z.string().nonempty({ message: "Purpose of travel is required" }),

  items: z
    .string()
    .nonempty({ message: "Please select what you are bringing" }),
  itemsOther: z.string().optional(),

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
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vehicleRequestSchema),
  });

  const selectedItem = watch("items");
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
        items: data.items === "Others" ? data.itemsOther : data.items,
        passengers: data.passengers,
        travel_duration: data.travelDuration,
        other_instructions: data.otherInstructions,
        passenger_contact_number: data.passengerContactNumber,
        requested_by: data.requestedBy,
      },
    ]);

    if (error) {
      toast.error("Failed to request a vehicle. Please try again.");
    } else {
      toast.success("Vehicle request submitted successfully!");
      reset();
    }

    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-lime-100 to-green-200 pb-25 flex justify-center p-2 sm:p-8 ">
      <div className="card w-full max-w-xl bg-white shadow-lg rounded-3xl p-7">
        <form
          onSubmit={handleSubmit(requestVehicle)}
          className="card-body border-2 border-green-600 border-dashed rounded-lg p-5 sm:p-7 flex flex-col gap-4"
        >
          <div className="text-center flex flex-col items-center justify-center gap-2 p-3">
            <img
              className="w-24 sm:w-28 lg:w-32 h-auto"
              src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/national_electrification_logo.png"
              alt="NEA Logo"
              onError={(e) => {
                e.currentTarget.src =
                  "https://8upload.com/display/33ff4ec683a6b52a/nea-logo.png.php";
              }}
            />
            <h1 className="text-3xl font-bold text-green-700 tracking-tight uppercase">
              Request a Service Vehicle
            </h1>
            <p className="text-gray-500 text-sm">
              Fill up the form to request a vehicle for your official use.
            </p>
          </div>

          <OurInput
            label="Email:"
            name="email"
            register={register}
            error={errors.email}
          />
          <OurInput
            label="Service Vehicle to be used by:"
            label2="Department/Division/Offices"
            name="department"
            register={register}
            error={errors.department}
          />
          <OurInput
            label="In going to:"
            name="destination"
            register={register}
            error={errors.destination}
          />
          <OurInput
            label="Date of departure:"
            type="date"
            name="departureDate"
            register={register}
            error={errors.departureDate}
          />
          <OurInput
            label="Time of departure:"
            type="time"
            name="departureTime"
            register={register}
            error={errors.departureTime}
          />
          <OurInput
            label="Purpose of travel:"
            name="purpose"
            register={register}
            error={errors.purpose}
          />

          {/* RADIO GROUP */}
          <div className="flex flex-col mb-4 space-y-2">
            <legend className="fieldset-legend text-sm">With:</legend>

            <label className="flex flex-col sm:flex-row items-start sm:items-center cursor-pointer w-full">
              <input
                type="radio"
                value="Baggage"
                className="h-3 w-3 mt-1 sm:mt-0"
                {...register("items")}
              />
              <span className="ml-0 sm:ml-2 text-sm">Baggage</span>
            </label>

            <label className="flex flex-col sm:flex-row items-start sm:items-center cursor-pointer w-full">
              <input
                type="radio"
                value="Equipment"
                className="h-3 w-3 mt-1 sm:mt-0"
                {...register("items")}
              />
              <span className="ml-0 sm:ml-2 text-sm">Equipment</span>
            </label>

            <label className="flex flex-col sm:flex-row items-start sm:items-center cursor-pointer w-full">
              <input
                type="radio"
                value="Others"
                className="h-3 w-3 mt-1 sm:mt-0"
                {...register("items")}
              />
              <div className="ml-0 sm:ml-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Others (please specify)"
                  className={`input w-full sm:w-auto ${errors.itemsOther ? "border-red-500" : ""}`}
                  disabled={selectedItem !== "Others"}
                  {...register("itemsOther")}
                />
              </div>
            </label>

            {errors.items && (
              <span className="text-red-500 text-sm">
                {errors.items.message}
              </span>
            )}
          </div>

          <OurInput
            label="Name of Passenger:"
            label2="Input all the names if more than one (1)."
            name="passengers"
            register={register}
            error={errors.passengers}
          />

          {/* SELECT */}
          <div>
            <label className="font-bold text-sm">Duration of Travel:</label>
            <select
              className={`select w-full mt-1 ${errors.travelDuration ? "border-red-500" : ""}`}
              defaultValue=""
              {...register("travelDuration")}
            >
              <option value="" disabled>
                Choose
              </option>
              <option value="Same Day">Same Day</option>
              <option value="2 Days">2 Days</option>
              <option value="3 Days">3 Days</option>
              <option value="4 Days">4 Days</option>
              <option value="5 Days or more">5 Days or more</option>
            </select>
            {errors.travelDuration && (
              <span className="text-red-500 text-sm">
                {errors.travelDuration.message}
              </span>
            )}
          </div>

          <OurInput
            label="Other Instructions:"
            name="otherInstructions"
            register={register}
            error={errors.otherInstructions}
          />
          <OurInput
            label="Passenger Contact Number:"
            name="passengerContactNumber"
            register={register}
            error={errors.passengerContactNumber}
          />
          <OurInput
            label="Requested By:"
            label2="Division Manager/Department Manager/Deputy Administrator."
            name="requestedBy"
            register={register}
            error={errors.requestedBy}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-lg bg-green-500 hover:bg-green-400 text-white py-7 w-full rounded-2xl mt-5 uppercase font-bold tracking-wider"
          >
            {isSubmitting ? "Requesting vehicle..." : "Request Vehicle"}
          </button>
        </form>
      </div>
    </main>
  );
}
