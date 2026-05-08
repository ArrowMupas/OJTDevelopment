import { parse, format } from "date-fns";
import clsx from "clsx";
import Tippy from "@tippyjs/react";
import { CheckCircle, XCircle, Info, Search } from "lucide-react";

export default function VehicleRequestsTable({
  data = [],
  loading = false,
  search = "",
  drivers = [],
  vehicles = [],
  updateAssignedDriver,
  updateAssignedVehicle,
  updateStatus,
}) {
  const colSpan = 10;

  return (
    <div className="bg-base-100">
      <div className="rounded-box border-base-content/5 bg-base-100 overflow-x-auto border">
        <table className="table-sm 2xl:table-md table min-h-50">
          {/* HEADER */}
          <thead className="uppercase">
            <tr>
              <th>Department</th>
              <th>Passengers</th>
              <th>Destination</th>
              <th>Purpose</th>
              <th>Date & Time</th>
              <th>Duration</th>
              <th>Driver</th>
              <th>Vehicle</th>
              <th>Status</th>
              <th>Survey</th>
            </tr>
          </thead>

          <tbody>
            {/* LOADING */}
            {loading ? (
              <tr>
                <td colSpan={colSpan} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <span className="loading loading-infinity loading-xl"></span>
                    <p className="text-gray-500">Loading requests...</p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="size-8 text-gray-500" />
                    <p className="text-gray-500">No requests found</p>
                    <p className="text-xs text-gray-500">
                      {search
                        ? "Try a different search term"
                        : "No pending requests available right now"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              /* ROWS */
              data.map((req) => {
                const parsedDateTime = parse(
                  `${req.departure_date} ${req.departure_time}`,
                  "yyyy-MM-dd HH:mm:ss",
                  new Date(),
                );

                return (
                  <tr key={req.id} className="hover:bg-green-50">
                    {/* DEPARTMENT */}
                    <th className="text-xs uppercase">{req.department}</th>

                    {/* PASSENGERS */}
                    <td className="">
                      <div className="line-clamp-3 font-bold capitalize hover:line-clamp-none">
                        {req.passengers}
                      </div>
                      <span className="text-xs font-medium">
                        {req.passenger_contact_number}
                      </span>
                    </td>

                    {/* DESTINATION */}
                    <td className="text-success capitalize italic">
                      {req.destination}
                    </td>

                    {/* PURPOSE */}
                    <td className="text-xs">
                      <div className="line-clamp-3 hover:line-clamp-none">
                        {req.purpose}
                      </div>
                    </td>

                    {/* DATE */}
                    <td className="truncate">
                      <span className="text-sm">
                        {format(parsedDateTime, "MMM. d, yyyy")}
                      </span>
                      <br />
                      <span className="text-xs">
                        {format(parsedDateTime, "hh:mm a")}
                      </span>
                    </td>

                    <td className="text-xs sm:text-sm">
                      {req.travel_duration}
                    </td>

                    {/* DRIVER */}
                    <td>
                      <select
                        className="select select-sm"
                        disabled={
                          req.status === "Completed" ||
                          req.status === "Cancelled"
                        }
                        value={req.driver_id || ""}
                        onChange={(e) =>
                          updateAssignedDriver(
                            req.id,
                            e.target.value ? Number(e.target.value) : null,
                          )
                        }
                      >
                        <option value="">Unassigned</option>
                        {drivers.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.last_name}, {d.first_name} {d.middle_initial}.
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* VEHICLE */}
                    <td>
                      <select
                        className="select select-sm"
                        disabled={
                          req.status === "Completed" ||
                          req.status === "Cancelled"
                        }
                        value={req.vehicle_id || ""}
                        onChange={(e) =>
                          updateAssignedVehicle(
                            req.id,
                            e.target.value ? Number(e.target.value) : null,
                          )
                        }
                      >
                        <option value="">Unassigned</option>
                        {vehicles.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name} ({v.plate_number})
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* STATUS */}
                    <td className="">
                      <select
                        className={clsx("select select-sm", {
                          "select-success text-success":
                            req.status === "Completed",
                          "select-error text-error": req.status === "Cancelled",
                          "select-warning text-warning":
                            req.status === "On_Going",
                        })}
                        value={req.status || ""}
                        onChange={(e) => updateStatus(req.id, e.target.value)}
                      >
                        <option value="Pending" className="text-gray-500">
                          Pending
                        </option>
                        <option value="On_Going" className="text-warning">
                          On Going
                        </option>
                        <option value="Completed" className="text-success">
                          Completed
                        </option>
                        <option value="Cancelled" className="text-error">
                          Cancelled
                        </option>
                      </select>
                    </td>

                    {/* SURVEY */}
                    <td>
                      <div className="flex items-center gap-2">
                        {req.is_surveyed ? (
                          <div className="badge badge-success badge-soft">
                            <CheckCircle className="size-3" />
                          </div>
                        ) : (
                          <div className="badge badge-error badge-soft">
                            <XCircle className="size-3" />
                          </div>
                        )}

                        <Tippy
                          interactive
                          placement="left"
                          theme="light"
                          content={
                            <div className="w-64 p-3">
                              <h3 className="font-bold">Requested By</h3>
                              <p>{req.requested_by || "None"}</p>

                              <h3 className="mt-2 font-bold">Instructions</h3>
                              <p>{req.other_instructions || "None"}</p>

                              <h3 className="mt-2 font-bold">Items</h3>
                              <p>{req.items || "None"}</p>
                            </div>
                          }
                        >
                          <Info className="size-4 cursor-pointer" />
                        </Tippy>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* FOOTER */}
          <tfoot className="bg-green-400 font-medium">
            <tr>
              <td colSpan={colSpan} className="py-5 text-center text-white">
                Total Requests: {data.length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
