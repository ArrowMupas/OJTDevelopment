import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { format, parse } from "date-fns";

export default function SurveyInput() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSurvey() {
      const { data, error } = await supabase
        .from("passenger_survey")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setSurvey(data);
      }
      setLoading(false);
    }

    fetchSurvey();
  }, [id]);

  if (loading) return <p className="p-8">Loading...</p>;
  if (!survey) return <p className="p-8">Request not found.</p>;

  const formattedDate = format(`${survey.travel_date}`, "MMMM d, yyyy");

  const ratingLabels = ["Poor", "Fair", "Good", "Satisfied", "Excellent"];

  return (
    <main className="min-h-screen bg-linear-to-b from-emerald-100 to-emerald-200 flex justify-center p-2 sm:p-8 sm:pb-40">
      <div className="card w-xl bg-white shadow-lg rounded-3xl p-10 ">
        <div className="text-center flex flex-col items-center justify-center gap-2 p-3">
          <img
            className="size-20 sm:size-28"
            src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/national_electrification_logo.png"
            alt="NEA Logo"
            onError={(e) => {
              e.currentTarget.src =
                "https://8upload.com/display/33ff4ec683a6b52a/nea-logo.png.php";
            }}
          />
          <h1 className="text-3xl font-bold text-green-700 tracking-tight uppercase">
            Thank you for your response.
          </h1>
          <p className="text-gray-500 text-sm">
            Your survey response is recorded.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mt-6 p-4">
          {/* LEFT - MAIN CONTENT (wide) */}
          <div className=" flex flex-col w-full text-center items-center lg:text-left lg:items-start gap-4 ">
            {/* DURATION */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500 ">Driver</p>
              <p className="text-lg font-bold ">{survey.driver_name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-500 ">Travel Date</p>
              <p className=" font-medium text-gray-800">{formattedDate}</p>
            </div>

            {/* PURPOSE */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500 ">Vehicle</p>
              <p className=" font-medium text-gray-800">{survey.vehicle}</p>
            </div>
          </div>

          {/* RIGHT - SIDEBAR (narrow) */}
          <div className="w-full gap-4 text-center items-center lg:text-left lg:items-start flex flex-col ">
            <div>
              <p className="text-xs text-gray-500 ">Driver's Appearance</p>
              <p className="text-gray-800 font-medium">
                {ratingLabels[survey.rating_appearance - 1]}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 ">Driver's Behavior</p>
              <p className="text-gray-800 font-medium">
                {ratingLabels[survey.rating_behavior - 1]}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 ">Safety Driving Skills</p>
              <p className="text-gray-800 font-medium wrap-break-word">
                {ratingLabels[survey.rating_safety - 1]}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 ">Vehicle Condition(s)</p>
              <p className="text-gray-800 font-medium wrap-break-word">
                {ratingLabels[survey.rating_vehicle - 1]}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 ">On Time</p>
              <p className="text-gray-800 font-medium">
                {ratingLabels[survey.rating_ontime - 1]}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 ">Comments/Suggestions</p>
              <p className="text-gray-800 font-medium break-all">
                {survey.comments}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
