import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { format } from "date-fns";
import { BeanOff } from "lucide-react";

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

  const ratingLabels = ["Poor", "Fair", "Good", "Satisfied", "Excellent"];

  return (
    <main className="flex min-h-screen justify-center bg-linear-to-b from-emerald-100 to-emerald-200 p-2 sm:p-8 sm:pb-40">
      <div className="card w-xl rounded-3xl bg-white p-10 shadow-lg">
        {/* HEADER */}

        {/* BODY */}
        {loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <span className="loading loading-infinity loading-xl"></span>
          </div>
        ) : !survey ? (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <BeanOff className="size-20 sm:size-28" />
            <p>Survey not found</p>
          </div>
        ) : (
          (() => {
            const formattedDate = survey.travel_date
              ? format(new Date(survey.travel_date), "MMMM d, yyyy")
              : "N/A";

            return (
              <>
                <div className="flex flex-col items-center justify-center gap-2 p-3 text-center">
                  <img
                    className="size-20 sm:size-28"
                    src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/national_electrification_logo.png"
                    alt="NEA Logo"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://8upload.com/display/33ff4ec683a6b52a/nea-logo.png.php";
                    }}
                  />

                  <h1 className="text-3xl font-bold tracking-tight text-green-700 uppercase">
                    Thank you for your response.
                  </h1>

                  <p className="text-sm text-gray-500">
                    Your survey response is recorded.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-8 p-4 lg:flex-row">
                  {/* LEFT */}
                  <div className="flex w-full flex-col items-center gap-4 text-center lg:items-start lg:text-left">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Driver</p>
                      <p className="text-lg font-bold">
                        {survey.driver_name || "N/A"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Travel Date</p>
                      <p className="font-medium text-gray-800">
                        {formattedDate}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Vehicle</p>
                      <p className="font-medium text-gray-800">
                        {survey.vehicle || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex w-full flex-col items-center gap-4 text-center lg:items-start lg:text-left">
                    <div>
                      <p className="text-xs text-gray-500">
                        Driver's Appearance
                      </p>
                      <p className="font-medium text-gray-800">
                        {ratingLabels[(survey.rating_appearance ?? 1) - 1]}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Driver's Behavior</p>
                      <p className="font-medium text-gray-800">
                        {ratingLabels[(survey.rating_behavior ?? 1) - 1]}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Safety Driving Skills
                      </p>
                      <p className="font-medium text-gray-800">
                        {ratingLabels[(survey.rating_safety ?? 1) - 1]}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Vehicle Condition(s)
                      </p>
                      <p className="font-medium text-gray-800">
                        {ratingLabels[(survey.rating_vehicle ?? 1) - 1]}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">On Time</p>
                      <p className="font-medium text-gray-800">
                        {ratingLabels[(survey.rating_ontime ?? 1) - 1]}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Comments/Suggestions
                      </p>
                      <p className="font-medium wrap-break-word text-gray-800">
                        {survey.comments || "None"}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            );
          })()
        )}
      </div>
    </main>
  );
}
