import { useState } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import OurInput from "../components/OurInput";

const satisfactionSurveySchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
  lastName: z.string().nonempty("Last name is required"),
  firstName: z.string().nonempty("First name is required"),
  travelDate: z.string().nonempty("Travel date is required"),
  driverName: z.string().nonempty("Driver is required"),
  vehicle: z.string().nonempty("Vehicle is required"),
  appearance: z.string().nonempty("Required"),
  behavior: z.string().nonempty("Required"),
  safety: z.string().nonempty("Required"),
  vehicleCondition: z.string().nonempty("Required"),
  onTime: z.string().nonempty("Required"),
  comments: z.string().nonempty("Comments are required"),
});

export default function SurveyPage() {
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(satisfactionSurveySchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitSurvey = async (data) => {
    setIsSubmitting(true);

    const fullName = `${data.lastName}, ${data.firstName}`;

    const { error } = await supabase.from("passenger_survey").insert([
      {
        email: data.email,
        passenger_name: fullName,
        travel_date: data.travelDate,
        driver_name: data.driverName,
        vehicle: data.vehicle,
        rating_appearance: data.appearance,
        rating_behavior: data.behavior,
        rating_safety: data.safety,
        rating_vehicle: data.vehicleCondition,
        rating_ontime: data.onTime,
        comments: data.comments,
      },
    ]);

    if (error) {
      toast.error("Failed to submit survey");
    } else {
      toast.success("Survey submitted successfully!");
      reset();
    }

    setIsSubmitting(false);
  };

  const RatingGroup = ({ name, title, description }) => (
    <div className="border rounded-md p-5">
      <p className="font-medium">{title}</p>
      <p className="text-sm italic text-gray-500 mt-1">{description}</p>
      <p className="text-xs italic text-gray-400 mt-1">
        {`{1 = Poor; 2 = Fair; 3 = Good; 4 = Satisfied; 5 = Excellent}`}
      </p>

      <div className="flex gap-8 mt-3">
        {[1, 2, 3, 4, 5].map((num) => (
          <label key={num} className="flex flex-col items-center">
            <input type="radio" value={num} {...register(name)} />
            <span className="text-sm">{num}</span>
          </label>
        ))}
      </div>

      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-linear-to-b from-emerald-100 to-emerald-200 pb-25 flex justify-center p-8">
      <div className="card w-xl bg-white shadow-lg rounded-3xl p-10 ">
        <div className=" text-center items-center justify-center flex flex-col gap-1 mb-4 ">
          <img
            className="size-25 "
            src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/nea-logo.png"
            alt="NEA Logo"
            onError={(e) => {
              e.currentTarget.src =
                "https://8upload.com/display/33ff4ec683a6b52a/nea-logo.png.php";
            }}
          />
          <div className="space-x-0">
            <h2 className="text-4xl font-bold text-center mb-2 text-green-800 font-rubik">
              Tell us about the service!
            </h2>
            <p className="text-center text-gray-500 mb-4 text-sm">
              Tell us how is your experience with our service vehicles and
              drivers. Your feedback is important to us!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-0">
          <OurInput
            label="Last Name"
            name="lastName"
            register={register}
            error={errors.lastName}
            placeholder="Enter last name"
          />

          <OurInput
            label="First Name"
            name="firstName"
            register={register}
            error={errors.firstName}
            placeholder="Enter first name"
          />
        </div>

        <form onSubmit={handleSubmit(submitSurvey)} className="space-y-8">
          <OurInput
            label="Email"
            name="email"
            register={register}
            error={errors.email}
          />

          <OurInput
            label="Travel Date"
            type="date"
            name="travelDate"
            register={register}
            error={errors.travelDate}
          />

          {/* DRIVER */}
          <div>
            <label className="font-bold text-sm">Driver</label>
            <select
              className={`select w-full mt-1 ${
                errors.driverName ? "border-red-500" : ""
              }`}
              defaultValue=""
              {...register("driverName")}
            >
              <option value="" disabled>
                Select Driver
              </option>
              {drivers.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* VEHICLE */}
          <div>
            <label className="font-bold text-sm mt-1 ">Vehicle</label>
            <select
              className={`select w-full ${
                errors.vehicle ? "border-red-500" : ""
              }`}
              defaultValue=""
              {...register("vehicle")}
            >
              <option value="" disabled>
                Select Vehicle
              </option>
              {vehicles.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>

          <RatingGroup
            name="appearance"
            title="Driver's Appearance"
            description="Uniform, hygiene, alertness"
          />

          <RatingGroup
            name="behavior"
            title="Driver's Behavior"
            description="Courtesy, assistance, professionalism"
          />

          <RatingGroup
            name="safety"
            title="Safety Driving Skills"
            description="Traffic laws, attention, safe driving"
          />

          <RatingGroup
            name="vehicleCondition"
            title="Vehicle Condition"
            description="Cleanliness, AC, maintenance"
          />

          <RatingGroup
            name="onTime"
            title="On Time"
            description="Pickup and arrival punctuality"
          />

          {/* COMMENTS */}
          <div className="gap-2 flex flex-col">
            <label className="font-bold text-sm">Comments / Suggestions</label>
            <textarea
              className={`textarea textarea-neutral w-full ${
                errors.comments ? "border-red-500" : ""
              }`}
              placeholder="Any comments about our service?"
              {...register("comments")}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-lg bg-lime-400 hover:bg-lime-500 text-white py-7 w-full rounded-2xl mt-5"
          >
            {isSubmitting ? "Submitting..." : "Submit Survey"}
          </button>
        </form>
      </div>
    </main>
  );
}
