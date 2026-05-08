import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import useDriverStore from "../../stores/driverStore";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OurInput from "../../components/OurInput";
import { useNavigate } from "react-router-dom";
import { surveySchema } from "../../schemas/surveySchema";

export default function SurveyPage() {
  const { getDrivers, fetchDrivers } = useDriverStore();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const drivers = getDrivers("service");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const { data: vehicleData, error: vehicleError } = await supabase
        .from("vehicles")
        .select("*")
        .neq("operational", false)
        .order("name", { ascending: true });

      if (vehicleError) console.error(vehicleError);
      else setVehicles(vehicleData);

      setLoading(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (drivers.length === 0) {
      fetchDrivers();
    }
  }, [drivers.length, fetchDrivers]);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(surveySchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitSurvey = async (data) => {
    setIsSubmitting(true);

    const fullName = `${data.lastName}, ${data.firstName}`;

    const ratings = [
      Number(data.appearance),
      Number(data.behavior),
      Number(data.safety),
      Number(data.vehicleCondition),
      Number(data.onTime),
    ];

    const averageScore =
      ratings.reduce((sum, val) => sum + val, 0) / ratings.length;

    const { data: surveyData, error } = await supabase
      .from("passenger_survey")
      .insert([
        {
          passenger_name: fullName,
          travel_date: data.travelDate,
          driver_id: Number(data.driver_id),
          vehicle_id: Number(data.vehicle_id),
          rating_appearance: data.appearance,
          rating_behavior: data.behavior,
          rating_safety: data.safety,
          rating_vehicle: data.vehicleCondition,
          rating_ontime: data.onTime,
          comments: data.comments,
          average_score: averageScore,
        },
      ])
      .select();

    if (error) {
      toast.error("Failed to submit survey");
    } else {
      toast.success("Survey submitted successfully!");
      reset();
    }

    const newRequestId = surveyData?.[0]?.id;
    if (newRequestId) {
      navigate(`/survey/finish/${newRequestId}`, { replace: true });
    }

    setIsSubmitting(false);
  };

  const ratingLabels = ["Poor", "Fair", "Good", "Satisfied", "Excellent"];

  const RatingGroup = ({ name, title, description }) => {
    const [selected, setSelected] = useState(null);

    return (
      <div className="rounded-md border p-5">
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-gray-500 italic">{description}</p>

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
          <p className="mt-1 text-sm font-medium text-gray-700">
            {ratingLabels[selected - 1]}
          </p>
        )}

        {errors[name] && (
          <p className="text-error mt-1 text-sm">{errors[name].message}</p>
        )}
      </div>
    );
  };

  return (
    <main className="flex min-h-screen justify-center bg-linear-to-b from-emerald-100 to-emerald-200 p-2 sm:p-8 sm:pb-25">
      <div className="card w-xl rounded-3xl bg-white p-10 shadow-lg">
        <div className="mb-4 flex flex-col items-center justify-center gap-2 text-center">
          <img
            className="size-20 sm:size-28"
            src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/national_electrification_logo.png"
            alt="NEA Logo"
          />
          <div>
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-green-800 uppercase">
              Passenger Survey
            </h2>
            <p className="mb-4 text-sm text-gray-500">
              Tell us how is your experience with our service vehicles and
              drivers.
            </p>
          </div>
        </div>

        <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-2">
          <OurInput
            label="Last Name"
            name="lastName"
            register={register}
            error={errors.lastName}
          />
          <OurInput
            label="First Name"
            name="firstName"
            register={register}
            error={errors.firstName}
          />
        </div>

        <form onSubmit={handleSubmit(submitSurvey)} className="space-y-8">
          <OurInput
            label="Travel Date"
            type="date"
            name="travelDate"
            register={register}
            error={errors.travelDate}
          />

          {/* DRIVER */}
          <div>
            <label className="text-sm font-bold">Driver</label>
            <select
              className={`select mt-1 w-full ${
                errors.driver_id ? "input-error" : ""
              }`}
              defaultValue=""
              {...register("driver_id")}
            >
              <option value="" disabled>
                Select Driver
              </option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.last_name}, {d.first_name} {d.middle_initial}.
                </option>
              ))}
            </select>
          </div>

          {/* VEHICLE */}
          <div>
            <label className="text-sm font-bold">Vehicle</label>
            <select
              className={`select w-full ${
                errors.vehicle_id ? "input-error" : ""
              }`}
              defaultValue=""
              {...register("vehicle_id")}
            >
              <option value="" disabled>
                Select Vehicle
              </option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.plate_number})
                </option>
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
            description="Courtesy, professionalism"
          />

          <RatingGroup
            name="safety"
            title="Safety Driving Skills"
            description="Traffic laws, safe driving"
          />

          <RatingGroup
            name="vehicleCondition"
            title="Vehicle Condition"
            description="Cleanliness, maintenance"
          />

          <RatingGroup
            name="onTime"
            title="On Time"
            description="Pickup and arrival punctuality"
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold">Comments / Suggestions</label>
            <textarea
              placeholder="Type here (up to 200 characters)"
              maxLength={200}
              className={`textarea textarea-neutral w-full ${
                errors.comments ? "input-error" : ""
              }`}
              {...register("comments")}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-lg mt-5 w-full rounded-2xl bg-green-600 py-7 font-bold text-white uppercase hover:bg-green-500"
          >
            {isSubmitting ? "Submitting..." : "Submit Survey"}
          </button>
        </form>
      </div>
    </main>
  );
}
