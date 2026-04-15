import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { format, parse } from "date-fns";
import { Bean, BeanOff } from "lucide-react";

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

  return (
    <main className="flex min-h-screen justify-center bg-linear-to-b from-lime-100 to-green-100 p-2 pb-25 sm:p-8">
      <div className="card w-full max-w-xl rounded-3xl bg-white p-7 shadow-lg">
        <div className="card-body max-w-3xl rounded-lg border-2 border-dashed border-green-600 p-7">
          {loading ? (
            <div className="flex h-full w-full items-center justify-center">
              <span className="loading loading-infinity loading-xl"></span>
            </div>
          ) : !request ? (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <BeanOff className="size-20 sm:size-28" />
              <p>Request not found</p>
            </div>
          ) : (
            (() => {
              const parsedDateTime = parse(
                `${request.departure_date} ${request.departure_time}`,
                "yyyy-MM-dd HH:mm:ss",
                new Date(),
              );

              const formattedDate = format(parsedDateTime, "MMMM d, yyyy");
              const formattedTime = format(parsedDateTime, "hh:mm a");

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
                      Your Vehicle is Requested
                    </h1>
                    <p className="text-sm text-gray-500">
                      Kindly coordinate with motorpool with your request.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col gap-8 p-4 lg:flex-row">
                    {/* LEFT */}
                    <div className="flex w-full flex-col items-center gap-4 text-center lg:items-start lg:text-left">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          Your destination is
                        </p>
                        <p className="text-xl font-bold wrap-break-word text-emerald-600">
                          {request.destination || "N/A"}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">
                          Date of Departure
                        </p>
                        <p className="text-lg font-medium text-gray-800">
                          {formattedDate}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">
                          Time of Departure
                        </p>
                        <p className="text-lg font-medium text-gray-800">
                          {formattedTime}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-lg font-medium text-gray-800">
                          {request.travel_duration || "N/A"}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Purpose</p>
                        <p className="wrap-break-word text-gray-800">
                          {request.purpose || "N/A"}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">
                          Other Instructions
                        </p>
                        <p className="wrap-break-word whitespace-pre-line text-gray-800">
                          {request.other_instructions ||
                            "No additional instructions"}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex w-full flex-col items-center gap-4 text-center lg:items-start lg:text-left">
                      <div>
                        <p className="text-xs text-gray-500">Requested By</p>
                        <p className="font-medium text-gray-800">
                          {request.requested_by || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Passenger(s)</p>
                        <p className="font-medium wrap-break-word text-gray-800">
                          {request.passengers || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Contact Number</p>
                        <p className="font-medium text-gray-800">
                          {request.passenger_contact_number || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium break-all text-gray-800">
                          {request.email || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Held Items</p>
                        <p className="wrap-break-word text-gray-800">
                          {request.items || "None"}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()
          )}
        </div>
      </div>
    </main>
  );
}
