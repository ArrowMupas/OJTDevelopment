// utils/exportCompletedRequests.js
import { format } from "date-fns";
import * as XLSX from "xlsx";

export async function exportCompletedRequests({
  supabase,
  search,
  filterDriver,
  filterVehicle,
  filterFrom,
  filterTo,
  drivers,
  vehicles,
  toast,
}) {
  try {
    let query = supabase
      .from("service_vehicle_requests")
      .select("*")
      .in("status", ["Completed", "Cancelled"])
      .order("departure_date", { ascending: false })
      .order("departure_time", { ascending: false });

    const searchColumns = [
      "department",
      "email",
      "destination",
      "purpose",
      "items",
      "passengers",
      "other_instructions",
      "passenger_contact_number",
      "requested_by",
    ];

    if (search) {
      const orQueryParts = searchColumns.map(
        (field) => `${field}.ilike.%${search}%`,
      );
      query = query.or(orQueryParts.join(","));
    }

    if (filterDriver) query = query.eq("driver_id", parseInt(filterDriver));
    if (filterVehicle) query = query.eq("vehicle_id", parseInt(filterVehicle));
    if (filterFrom) query = query.gte("departure_date", filterFrom);
    if (filterTo) query = query.lte("departure_date", filterTo);

    const { data: allRequests, error } = await query;

    if (error) {
      console.error(error);
      toast.error("Failed to export data");
      return;
    }

    if (!allRequests?.length) {
      toast.error("No data to export");
      return;
    }

    const completedRequests = allRequests.filter(
      (r) => r.status === "Completed" && r.is_surveyed === true,
    );

    let reportTitle = "Completed Vehicle Requests Report";

    if (filterFrom && filterTo) {
      reportTitle += ` from ${format(new Date(filterFrom), "MMMM d")} to ${format(
        new Date(filterTo),
        "MMMM d, yyyy",
      )}`;
    }

    const vehicleMap = new Map(vehicles.map((v) => [v.id, v.name]));

    const sheetData = [
      [reportTitle],
      [],
      [
        "No.",
        "REQUESTING PERSONNEL/OFFICE",
        "DESTINATION",
        "DATE REQUESTED",
        "DATE OF DEPARTURE",
        "DISPATCHED VEHICLE",
        "DRIVER",
        "STATUS",
      ],
      ...completedRequests.map((r, index) => [
        index + 1,
        r.department ?? "-",
        r.destination ?? "-",
        r.timestamp ? format(new Date(r.timestamp), "MMMM d, yyyy") : "-",
        r.departure_date
          ? format(new Date(r.departure_date), "MMMM d, yyyy")
          : "-",
        vehicleMap.get(r.vehicle_id) ?? "Not Assigned",
        r.driver_id
          ? `${drivers.find((d) => d.id === r.driver_id)?.last_name}, ${
              drivers.find((d) => d.id === r.driver_id)?.first_name
            }`
          : "Not Assigned",
        r.status ?? "-",
      ]),
    ];

    sheetData.push([], ["Report Summary"]);
    sheetData.push(["Total Completed Requests:", completedRequests.length]);
    sheetData.push([
      "Generated On:",
      format(new Date(), "MMMM d, yyyy hh:mm a"),
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    worksheet["!cols"] = [
      { wch: 8 }, // No.
      { wch: 35 }, // Requesting Office
      { wch: 35 }, // Destination
      { wch: 20 }, // Date Requested
      { wch: 20 }, // Departure Date
      { wch: 25 }, // Vehicle
      { wch: 35 }, // Driver
      { wch: 10 }, // Rating
      { wch: 15 }, // Status
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Completed Requests");

    const fileName = `completed_requests_${format(
      new Date(),
      "yyyyMMdd_HHmmss",
    )}.xlsx`;

    XLSX.writeFile(workbook, fileName);

    toast.success(
      `Exported ${completedRequests.length} requests successfully!`,
    );
  } catch (err) {
    console.error(err);
    toast.error("Failed to export data");
  }
}
