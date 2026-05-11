import { supabase } from "../supabaseClient";
import { format } from "date-fns";
import * as XLSX from "xlsx";

export const exportTripTickets = async ({
  search,
  filterDriver,
  filterFrom,
  filterTo,
  drivers,
  setExporting,
  toast,
}) => {
  setExporting(true);

  try {
    let query = supabase
      .from("trip_tickets")
      .select(
        `
        *,
        drivers (
          id,
          first_name,
          last_name,
          middle_initial
        )
      `,
      )
      .order("date_received", { ascending: false });

    // filters
    if (search) query = query.ilike("dtt_no", `%${search}%`);
    if (filterDriver) query = query.eq("driver_id", parseInt(filterDriver));
    if (filterFrom) query = query.gte("date_received", filterFrom);
    if (filterTo) query = query.lte("date_received", filterTo);

    const { data, error } = await query;

    if (error) {
      console.error(error);
      toast.error("Failed to export data");
      return;
    }

    const exportData = data || [];

    if (exportData.length === 0) {
      toast.error("No data to export");
      return;
    }

    const averageExportRating =
      exportData.reduce((sum, t) => sum + Number(t.rating || 0), 0) /
        exportData.length || 0;

    let reportTitle = "Trip Tickets Report";

    if (filterFrom && filterTo) {
      reportTitle += ` from ${format(new Date(filterFrom), "MMM d")} to ${format(
        new Date(filterTo),
        "MMM d, yyyy",
      )}`;
    }

    if (filterDriver) {
      const selected = drivers.find((d) => d.id === parseInt(filterDriver));
      if (selected) {
        reportTitle += ` - Driver: ${selected.last_name}, ${selected.first_name}`;
      }
    }

    if (search) {
      reportTitle += ` (Search: "${search}")`;
    }

    const sheetData = [
      [reportTitle],
      [],
      ["DTT No", "Driver", "Date", "Time", "Rating", "Created At"],
      ...exportData.map((t) => [
        t.dtt_no,
        t.drivers
          ? `${t.drivers.last_name}, ${t.drivers.first_name} ${t.drivers.middle_initial || ""}`
          : "Unknown",
        t.date_received
          ? format(new Date(t.date_received), "MMM d, yyyy")
          : "-",
        t.time_received || "-",
        t.rating || "-",
        t.created_at
          ? format(new Date(t.created_at), "MMM d, yyyy hh:mm a")
          : "-",
      ]),
      [],
      ["Summary"],
      ["Total Tickets", exportData.length],
      ["Average Rating", averageExportRating.toFixed(2)],
      ["Generated", format(new Date(), "MMM d, yyyy hh:mm a")],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    worksheet["!cols"] = [
      { wch: 18 },
      { wch: 30 },
      { wch: 18 },
      { wch: 12 },
      { wch: 10 },
      { wch: 22 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trip Tickets");

    const fileName = `trip_tickets_${format(
      new Date(),
      "yyyyMMdd_HHmmss",
    )}.xlsx`;

    XLSX.writeFile(workbook, fileName);

    toast.success(`Exported ${exportData.length} tickets`);
  } catch (err) {
    console.error(err);
    toast.error("Failed to export data");
  } finally {
    setExporting(false);
  }
};
