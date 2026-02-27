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
    <main className="h-full p-8 bg-linear-to-b from-lime-100 to-green-200 pb-25">
      <div className="card lg:card-side p-7 w-xl mx-auto bg-white shadow-lg">
        <form
          onSubmit={handleSubmit(requestVehicle)}
          className="card-body max-w-2xl border-2 border-green-600 rounded-lg border-dashed p-7"
        >
          <div className=" text-center p-3 items-center justify-center flex flex-col gap-2">
            <img
              className="size-20 "
              src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/nea-logo.png"
              alt="NEA Logo"
              onError={(e) => {
                e.currentTarget.src =
                  "https://8upload.com/display/33ff4ec683a6b52a/nea-logo.png.php";
              }}
            />
            <h1 className="text-4xl font-bold text-green-700 tracking-tight font-rubik">
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

            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                value="Baggage"
                className="radio h-3 w-3"
                {...register("items")}
              />
              <span className="ml-2 text-sm">Baggage</span>
            </label>

            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                value="Equipment"
                className="radio h-3 w-3"
                {...register("items")}
              />
              <span className="ml-2 text-sm">Equipment</span>
            </label>

            <label className="inline-flex items-center cursor-pointer w-full">
              <input
                type="radio"
                value="Others"
                className="radio h-3 w-3"
                {...register("items")}
              />
              <div className="ml-2 w-full">
                <input
                  type="text"
                  placeholder="Others (please specify)"
                  className={`input w-full ${errors.itemsOther ? "border-red-500" : ""}`}
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
          <div className="w-full mb-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-sm">
                Duration of Travel:
              </legend>

              <select
                className={`select w-full  ${errors.travelDuration ? "border-red-500" : ""}`}
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
            </fieldset>
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
            className="btn btn-lg bg-green-500 hover:bg-green-400 text-white py-7 w-full rounded-2xl mt-5"
          >
            {isSubmitting ? "Requesting vehicle..." : "Request Vehicle"}
          </button>
        </form>
      </div>
    </main>
  );
}
