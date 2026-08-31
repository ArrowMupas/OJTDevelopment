import { parse, format } from "date-fns";
import clsx from "clsx";
import Tippy from "@tippyjs/react";
import {
  CheckCircle,
  XCircle,
  Info,
  Search,
  Clock,
  LoaderCircle,
  Car,
  ChevronDown,
  Ellipsis,
  BookCheck,
  BookX,
} from "lucide-react";

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

  const handleStatusChange = (reqId, status, e) => {
    updateStatus(reqId, status);
    e.currentTarget.closest("details")?.removeAttribute("open");
  };

  return (
    <div className="bg-base-100">
      <div className="rounded-box border-base-content/5 bg-base-100 overflow-x-auto border">
        <table className="table-sm 2xl:table-md table min-h-50">
          {/* HEADER */}
          <thead className="uppercase">
            <tr>
              <th>
                <span className="hidden 2xl:inline">Department</span>
                <span className="2xl:hidden">Dept</span>
              </th>
              <th>Passengers</th>
              <th>Destination</th>
              <th>Purpose</th>
              <th>Date & Time</th>
              {/* <th>Duration</th> */}
              <th>Driver</th>
              <th>Vehicle</th>
              <th>Status</th>
              <th>Survey</th>
              <th></th>
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
                    <td className="text-success max-w-50 capitalize italic">
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
                      <p className="text-xs font-bold">
                        {format(parsedDateTime, "MMM. d, yyyy")}
                      </p>

                      <p className="text-xs">
                        {format(parsedDateTime, "hh:mm a")}
                      </p>
                      <div className="divider my-0"></div>
                      <p className="text-sm text-gray-600">
                        {req.travel_duration}
                      </p>
                    </td>

                    {/* <td className="text-xs sm:text-sm">
                      {req.travel_duration}
                    </td> */}

                    {/* DRIVER */}
                    <td className="min-w-50">
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
                    <td className="min-w-50">
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
                      <details className="dropdown">
                        <summary
                          className={clsx("btn btn-xs btn-outline", {
                            "btn-ghost text-gray-500": req.status === "Pending",
                            "btn-warning": req.status === "On_Going",
                            "btn-success": req.status === "Completed",
                            "btn-error": req.status === "Cancelled",
                          })}
                        >
                          {req.status === "Pending" && (
                            <>
                              <Clock size={16} /> <ChevronDown size={12} />
                            </>
                          )}
                          {req.status === "On_Going" && (
                            <>
                              <Car size={16} /> <ChevronDown size={12} />
                            </>
                          )}
                          {req.status === "Completed" && (
                            <>
                              <CheckCircle size={16} />{" "}
                              <ChevronDown size={12} />
                            </>
                          )}
                          {req.status === "Cancelled" && (
                            <>
                              <XCircle size={16} /> <ChevronDown size={12} />
                            </>
                          )}
                        </summary>

                        <ul className="menu dropdown-content bg-base-100 rounded-box z-50 p-0.5 shadow">
                          <li>
                            <button
                              onClick={(e) =>
                                handleStatusChange(req.id, "Pending", e)
                              }
                              className="text-gray-500"
                            >
                              Pending
                            </button>
                          </li>

                          <li>
                            <button
                              onClick={(e) =>
                                handleStatusChange(req.id, "On_Going", e)
                              }
                              className="text-warning"
                            >
                              On Going
                            </button>
                          </li>

                          <li>
                            <button
                              onClick={(e) =>
                                handleStatusChange(req.id, "Completed", e)
                              }
                              className="text-success"
                            >
                              Completed
                            </button>
                          </li>

                          <li>
                            <button
                              onClick={(e) =>
                                handleStatusChange(req.id, "Cancelled", e)
                              }
                              className="text-error"
                            >
                              Cancelled
                            </button>
                          </li>
                        </ul>
                      </details>
                    </td>

                    {/* SURVEY */}
                    <td className="mx-0 px-0">
                      <div className="flex flex-col items-center gap-1">
                        {req.is_surveyed ? (
                          <BookCheck className="text-success size-5" />
                        ) : (
                          <BookX className="text-error size-5" />
                        )}
                      </div>
                    </td>

                    <td className="mx-0 px-0">
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
                        <Ellipsis className="size-4 cursor-pointer" />
                      </Tippy>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* FOOTER */}
          <tfoot className="">
            <tr>
              <td colSpan={colSpan} className="py-12 text-center">
                Total Requests: {data.length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
