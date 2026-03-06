import {
  ClipboardList,
  Navigation,
  Car,
  Users,
  PackageOpen,
  Star,
  ArrowLeft,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { format, parse } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function MoreInfoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  if (loading) return <p className="p-5">Loading...</p>;
  if (!request) return <p className="p-5">Request not found.</p>;

  const parsedDateTime = parse(
    `${request.departure_date} ${request.departure_time}`,
    "yyyy-MM-dd HH:mm:ss",
    new Date(),
  );

  const formattedDate = format(parsedDateTime, "MMM d, yyyy");
  const formattedTime = format(parsedDateTime, "hh:mm a");

  return (
    <main className="p-5 pb-32">
      <div className="flex gap-2">
        <div className="flex items-center gap-5 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-square btn-warning btn-dash h-full  "
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        <div>
          <h1 className="text-lg font-bold ">Request Overview</h1>
          <p className="text-gray-500 mb-8 text-sm">
            Complete summary and assignment details.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="relative card rounded-xl shadow p-5 bg-base-100">
          <ClipboardList
            className="absolute top-5 right-5 text-[#3C9C35] opacity-80"
            size={30}
          />

          <p className="text-sm text-gray-500">Current Status</p>
          <h2 className="text-3xl font-bold text-[#3C9C35] mt-2">
            {request.status || "Pending"}
          </h2>
        </div>

        <div className="relative md:col-span-2   card rounded-xl shadow p-5 bg-base-100">
          <Navigation className="absolute top-5 right-5 opacity-80" size={30} />

          <p className="text-sm text-gray-500">Destination</p>
          <h2 className="text-2xl font-bold card-title mt-1 capitalize">
            {request.destination}
          </h2>

          <p className="text-gray-600 mt-2">
            {formattedDate} • {formattedTime}
          </p>
        </div>

        <div className="relative card rounded-xl shadow p-5 bg-base-100">
          <Users
            className="absolute top-5 right-5 text-[#07A3A3] opacity-80"
            size={30}
          />

          <p className="text-sm text-gray-500">Passengers</p>
          <h2 className="text-xl font-bold card-title mt-1 capitalize">
            {request.passengers}
          </h2>

          <p className="text-sm text-gray-600 mt-2">
            {request.passenger_contact_number}
          </p>
        </div>

        <div className="relative   card rounded-xl shadow p-5 bg-base-100">
          <Car
            className="absolute top-5 right-5 text-[#C4412F] opacity-80"
            size={30}
          />

          <p className="text-sm text-gray-500">Assigned Driver</p>
          <p className="font-bold card-title mt-1">
            {request.driver_id || "Unassigned"}
          </p>

          <p className="text-sm text-gray-500 mt-4">Assigned Vehicle</p>
          <p className="font-bold card-title">
            {request.vehicle_id || "Unassigned"}
          </p>
        </div>

        <div className="relative   card rounded-xl shadow p-5 bg-base-100">
          <Star
            className="absolute top-5 right-5 text-[#063E34] opacity-80"
            size={30}
          />

          <p className="text-sm text-gray-500">Rating</p>
          <h2 className="text-xl font-bold card-title mt-1">
            {request.rating || "Not rated"}
          </h2>

          <p className="text-sm text-gray-500 mt-4">Cancel Reason</p>
          <p className="font-medium">{request.cancel_reason || "—"}</p>
        </div>

        <div className="relative md:col-span-3    card rounded-xl shadow p-5 bg-base-100">
          <PackageOpen
            className="absolute top-5 right-5 text-[#46244E] opacity-80"
            size={30}
          />

          <p className="text-sm text-gray-500">Additional Travel Data</p>

          <div className="grid md:grid-cols-3 gap-6 mt-4 text-sm">
            <div>
              <p className="text-gray-500">Held Items</p>
              <p className="font-medium mt-1">{request.items || "None"}</p>
            </div>

            <div>
              <p className="text-gray-500">Instructions</p>
              <p className="font-medium mt-1">
                {request.instructions || "None"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Remarks</p>
              <p className="font-medium mt-1">{request.remarks || "None"}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
