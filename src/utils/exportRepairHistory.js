import { format } from "date-fns";
import * as XLSX from "xlsx";

export async function exportRepairHistory({
  supabase,
  search,
  filterType,
  startDate,
  endDate,
  selectedMechanic,
  mechanics,
  selectedVehicle,
  vehicles,
  toast,
}) {
  try {
    let query = supabase
      .from("maintenance_records")
      .select(
        `
        *,
        vehicles (
          name,
          plate_number
        )
      `,
      )
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false });

    // TYPE FILTER
    if (filterType && filterType !== "all") {
      query = query.eq("type", filterType);
    }

    // SEARCH FILTER
    if (search?.trim()) {
      const searchTerm = search.trim();

      query = query.or(
        `service_shop.ilike.%${searchTerm}%,remarks.ilike.%${searchTerm}%`,
      );
    }

    // MECHANIC FILTER
    let selectedMechanicName = "";

    if (selectedMechanic) {
      const selectedMechanicData = mechanics?.find(
        (mechanic) => mechanic.id.toString() === selectedMechanic.toString(),
      );

      if (selectedMechanicData) {
        selectedMechanicName = selectedMechanicData.full_name;

        query = query.or(
          `assigned_personnel_1.eq.${selectedMechanicName},assigned_personnel_2.eq.${selectedMechanicName}`,
        );
      }
    }

    // VEHICLE FILTER
    if (selectedVehicle) {
      query = query.eq("vehicle_id", selectedVehicle);
    }

    // DATE FILTER
    if (startDate) {
      query = query.gte("completed_at", startDate);
    }

    if (endDate) {
      // Include the entire end date
      const nextDay = new Date(endDate);
      nextDay.setDate(nextDay.getDate() + 1);

      query = query.lt("completed_at", nextDay.toISOString());
    }

    // EXECUTE QUERY
    const { data, error } = await query;

    if (error) {
      console.error("Export query error:", error);
      toast.error("Failed to export repair history");
      return;
    }

    const exportData = data || [];

    // NO DATA
    if (exportData.length === 0) {
      toast.error("No data to export");
      return;
    }

    // FILTER INFORMATION
    const filterInfo = [];

    if (startDate) {
      filterInfo.push(`From: ${format(new Date(startDate), "MMM dd, yyyy")}`);
    }

    if (endDate) {
      filterInfo.push(`To: ${format(new Date(endDate), "MMM dd, yyyy")}`);
    }

    if (selectedMechanicName) {
      filterInfo.push(`Mechanic: ${selectedMechanicName}`);
    }

    if (selectedVehicle) {
      const selectedVehicleData = vehicles?.find(
        (vehicle) => vehicle.id.toString() === selectedVehicle.toString(),
      );

      if (selectedVehicleData) {
        const vehicleLabel = selectedVehicleData.plate_number
          ? `${selectedVehicleData.name} - ${selectedVehicleData.plate_number}`
          : selectedVehicleData.name;

        filterInfo.push(`Vehicle: ${vehicleLabel}`);
      }
    }

    if (filterType && filterType !== "all") {
      const typeLabel =
        filterType === "internal-mini"
          ? "Mini Repair"
          : filterType === "internal"
            ? "Internal"
            : filterType === "external"
              ? "External"
              : filterType;

      filterInfo.push(`Repair Type: ${typeLabel}`);
    }

    if (search?.trim()) {
      filterInfo.push(`Search: ${search.trim()}`);
    }

    // EXCEL DATA
    const sheetData = [
      ["REPAIR HISTORY REPORT"],
      [],
      ["TOTAL RECORDS:", exportData.length],
      ["GENERATED ON:", format(new Date(), "MMMM d, yyyy hh:mm a")],
      ...(filterInfo.length > 0
        ? [["FILTERS APPLIED:", filterInfo.join(" | ")], []]
        : [[""], []]),
      [
        "VEHICLE DESCRIPTION",
        "DATE REQUESTED",
        "INSPECTION/FINDINGS",
        "ASSIGNED MECHANIC",
        "DATE COMPLETED",
      ],

      ...exportData.map((repair) => {
        let assignedMechanic = "-";

        // INTERNAL / MINI REPAIR
        if (repair.type !== "external") {
          if (repair.assigned_personnel_1) {
            assignedMechanic = repair.assigned_personnel_1;
          } else if (repair.assigned_personnel_2) {
            assignedMechanic = repair.assigned_personnel_2;
          }
        }

        // EXTERNAL REPAIR
        if (repair.type === "external") {
          assignedMechanic = repair.service_shop || "-";
        }

        // VEHICLE DESCRIPTION
        const vehicleName = repair.vehicles?.name || "-";
        const plateNumber = repair.vehicles?.plate_number;

        const vehicleDescription = plateNumber
          ? `${vehicleName} - ${plateNumber}`
          : vehicleName;

        return [
          vehicleDescription,

          repair.created_at
            ? format(new Date(repair.created_at), "MMM dd, yyyy")
            : "-",

          repair.remarks || "-",

          assignedMechanic,

          repair.completed_at
            ? format(new Date(repair.completed_at), "MMM dd, yyyy")
            : "-",
        ];
      }),
    ];

    // CREATE WORKSHEET
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // COLUMN WIDTHS
    worksheet["!cols"] = [
      { wch: 35 },
      { wch: 20 },
      { wch: 50 },
      { wch: 30 },
      { wch: 20 },
    ];

    // HEADER STYLING
    const headerRange = XLSX.utils.decode_range(worksheet["!ref"]);

    for (let C = headerRange.s.c; C <= headerRange.e.c; C++) {
      const headerCell =
        worksheet[
          XLSX.utils.encode_cell({
            r: 5,
            c: C,
          })
        ];

      if (headerCell) {
        headerCell.s = {
          font: {
            bold: true,
            sz: 12,
          },
          fill: {
            fgColor: {
              rgb: "4F81BD",
            },
            patternType: "solid",
          },
          alignment: {
            horizontal: "center",
            vertical: "center",
          },
        };
      }
    }

    // WORKBOOK
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Repair History");

    // EXPORT FILE
    const fileName = `repair_history_${format(
      new Date(),
      "yyyyMMdd_HHmmss",
    )}.xlsx`;

    XLSX.writeFile(workbook, fileName);

    // SUCCESS MESSAGE
    toast.success(`Exported ${exportData.length} repair records successfully!`);
  } catch (err) {
    console.error("Export repair history error:", err);
    toast.error("Failed to export repair history");
  }
}
