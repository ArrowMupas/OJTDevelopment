import * as XLSX from "xlsx";
import { format } from "date-fns";
import { supabase } from "../supabaseClient";

export async function exportSurveyReport({
  search,
  selectedDriver,
  startDate,
  endDate,
}) {
  try {
    let query = supabase
      .from("passenger_survey")
      .select(
        `
        *,
        drivers!inner (
          id,
          first_name,
          middle_initial,
          last_name
        )
      `,
      )
      .order("timestamp", { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(
        `passenger_name.ilike.%${search}%,comments.ilike.%${search}%`,
      );
    }

    if (selectedDriver) {
      query = query.eq("driver_id", selectedDriver);
    }

    if (startDate) {
      query = query.gte("travel_date", startDate);
    }

    if (endDate) {
      query = query.lte("travel_date", endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      return;
    }

    const exportData = data || [];

    if (!exportData.length) return;

    const valid = exportData.filter(
      (s) => s.average_score !== null && s.average_score !== undefined,
    );

    const average =
      valid.length > 0
        ? valid.reduce((sum, s) => sum + s.average_score, 0) / valid.length
        : null;

    const sheetData = [
      ["Passenger Survey Report"],
      [],
      ["Total Responses:", exportData.length],

      ...(average !== null ? [["Overall Average:", average.toFixed(2)]] : []),

      [],

      [
        "Name",
        "Travel Date",
        "Appearance",
        "Behavior",
        "Safety",
        "Vehicle",
        "On-time",
        "Average",
        "Comments",
        "Driver Name",
      ],

      ...exportData.map((s) => [
        s.passenger_name || "Anonymous",

        s.travel_date ? format(new Date(s.travel_date), "MMMM d, yyyy") : "-",

        s.rating_appearance ?? "-",
        s.rating_behavior ?? "-",
        s.rating_safety ?? "-",
        s.rating_vehicle ?? "-",
        s.rating_ontime ?? "-",

        s.average_score != null ? s.average_score.toFixed(2) : "-",

        s.comments || "-",

        `${s.drivers.last_name}, ${s.drivers.first_name} ${
          s.drivers.middle_initial || ""
        }`.trim(),
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    worksheet["!merges"] = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: 9 },
      },
    ];

    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 20 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 35 },
      { wch: 30 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Survey Report");

    XLSX.writeFile(
      workbook,
      `survey_report_${format(new Date(), "yyyyMMdd_HHmmss")}.xlsx`,
    );
  } catch (err) {
    console.error(err);
  }
}
