import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { format, parse } from "date-fns";

export default function RequestInputPage() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequest() {
      const { data, error } = await supabase
        .from("service_vehicle_requests")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setRequest(data);
      }
      setLoading(false);
    }

    fetchRequest();
  }, [id]);

  if (loading) return <p className="p-8">Loading...</p>;
  if (!request) return <p className="p-8">Request not found.</p>;

  const parsedDateTime = parse(
    `${request.departure_date} ${request.departure_time}`,
    "yyyy-MM-dd HH:mm:ss",
    new Date(),
  );

  const formattedDate = format(parsedDateTime, "MMMM d, yyyy");
  const formattedTime = format(parsedDateTime, "hh:mm a");

  return (
    <main className="min-h-screen bg-linear-to-b from-lime-100 to-green-100  00 pb-25 flex justify-center p-2 sm:p-8 ">
      <div className="card w-full max-w-xl bg-white shadow-lg rounded-3xl p-7">
        <div className="card-body max-w-3xl border-2 border-green-600 rounded-lg border-dashed p-7">
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
              Your Vehicle is Requested
            </h1>
            <p className="text-gray-500 text-sm">
              Kindly coordinate with motorpool with your request.
            </p>
          </div>

          {/* ===== MAIN + SIDEBAR LAYOUT WITH DETAIL SUBTITLES ===== */}
          <div className="flex flex-col lg:flex-row gap-8 mt-6 p-4">
            {/* LEFT - MAIN CONTENT (wide) */}
            <div className=" flex flex-col w-full text-center items-center lg:text-left lg:items-start gap-4 ">
              {/* DESTINATION */}
              <div className="space-y-1">
                <p className="text-gray-500 text-sm">Your destination is</p>
                <p className="text-xl font-bold text-emerald-600 wrap-break-word">
                  {request.destination || "N/A"}
                </p>
              </div>

              {/* DATE & TIME */}
              <div className="space-y-1">
                <p className="text-xs  text-gray-500 ">Date of Departure</p>

                <p className="text-lg font-medium text-gray-800">
                  {formattedDate}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs  text-gray-500 ">Time of Departure</p>
                <p className="text-lg font-medium text-gray-800">
                  {formattedTime}
                </p>
              </div>

              {/* DURATION */}
              <div className="space-y-1">
                <p className="text-xs text-gray-500 ">Duration</p>
                <p className="text-lg font-medium text-gray-800">
                  {request.travel_duration || "N/A"}
                </p>
              </div>

              {/* PURPOSE */}
              <div className="space-y-1">
                <p className="text-xs text-gray-500 ">Purpose</p>
                <p className="text-gray-800 wrap-break-word">
                  {request.purpose || "N/A"}
                </p>
              </div>

              {/* OTHER INSTRUCTIONS */}
              <div className="space-y-1">
                <p className="text-xs text-gray-500 ">Other Instructions</p>

                <p className="text-gray-800 wrap-break-word whitespace-pre-line">
                  {request.other_instructions || "No additional instructions"}
                </p>
              </div>
            </div>

            {/* RIGHT - SIDEBAR (narrow) */}
            <div className="w-full gap-4 text-center items-center lg:text-left lg:items-start flex flex-col ">
              <div>
                <p className="text-xs text-gray-500 ">Requested By</p>
                <p className="text-gray-800 font-medium">
                  {request.requested_by || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 ">Passenger(s)</p>
                <p className="text-gray-800 font-medium wrap-break-word">
                  {request.passengers || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 ">Contact Number</p>
                <p className="text-gray-800 font-medium">
                  {request.passenger_contact_number || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 ">Email</p>
                <p className="text-gray-800 font-medium break-all">
                  {request.email || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 ">Held Items</p>
                <p className="text-gray-800 wrap-break-word">
                  {request.items || "None"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
