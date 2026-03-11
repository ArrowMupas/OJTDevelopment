import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import OurInput from "../../components/OurInput";
import { useNavigate } from "react-router-dom";

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
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDrivers() {
      setLoading(true);
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setDrivers(data);
      }
      setLoading(false);
    }
    fetchDrivers();
  }, []);

  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
    async function fetchVehicles() {
      setLoading(true);
      const { data: vehicleData, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setVehicles(vehicleData);
      }
      setLoading(false);
    }
    fetchVehicles();
  }, []);

  const navigate = useNavigate();
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

    const { data: surveyData, error } = await supabase
      .from("passenger_survey")
      .insert([
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
      ])
      .select();

    if (error) {
      toast.error("Failed to submit survey");
    } else {
      toast.success("Survey submitted successfully!");
      reset();
    }

    const newRequestId = surveyData[0]?.id;

    if (newRequestId) {
      navigate(`/surveyinput/${newRequestId}`, { replace: true });
    }

    setIsSubmitting(false);
  };

  const ratingLabels = ["Poor", "Fair", "Good", "Satisfied", "Excellent"];

  const RatingGroup = ({ name, title, description }) => {
    const [selected, setSelected] = useState(null);

    return (
      <div className="border rounded-md p-5">
        <p className="font-medium">{title}</p>
        <p className="text-sm italic text-gray-500 mt-1">{description}</p>

        <div className="rating mt-3">
          {[1, 2, 3, 4, 5].map((num) => (
            <input
              key={num}
              type="radio"
              value={num}
              {...register(name)}
              onClick={() => setSelected(num)}
              className="mask mask-star-2 bg-green-500"
              aria-label={`${num} star`}
            />
          ))}
        </div>

        {selected && (
          <p className="text-sm text-gray-700 mt-1 font-medium">
            {ratingLabels[selected - 1]}
          </p>
        )}

        {errors[name] && (
          <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-emerald-100 to-emerald-200 sm:pb-25 flex justify-center p-2 sm:p-8">
      <div className="card w-xl bg-white shadow-lg rounded-3xl p-10 ">
        <div className=" text-center items-center justify-center flex flex-col gap-1 mb-4 ">
          <img
            className="size-20 sm:size-28"
            src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/national_electrification_logo.png"
            alt="NEA Logo"
            onError={(e) => {
              e.currentTarget.src =
                "https://8upload.com/display/33ff4ec683a6b52a/nea-logo.png.php";
            }}
          />
          <div className="space-x-0">
            <h2 className="text-3xl font-bold text-center mb-2 text-green-800 uppercase tracking-tight">
              Tell us about the service
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
                <option key={d.id}>
                  <div className="flex gap-2">
                    <img
                      className="size-14"
                      src={d.image_url}
                      alt={d.last_name}
                    />
                    <p className="">
                      {d.first_name} {d.last_name}
                    </p>
                  </div>
                </option>
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
                <option key={v.id}>{v.name}</option>
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
            className="btn btn-lg bg-green-600 hover:bg-green-500 text-white py-7 w-full rounded-2xl mt-5 font-bold tracking-woder uppercase"
          >
            {isSubmitting ? "Submitting..." : "Submit Survey"}
          </button>
        </form>
      </div>
    </main>
  );
}
