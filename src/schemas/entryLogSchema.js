import { z } from "zod";

export const entryLogSchema = z.object({
  vehicleType: z.enum(["private", "government"]),

  guardId: z.coerce.number().min(1, "Guard is required"),

  vehicleId: z.coerce.number().optional(),
  driverId: z.coerce.number().optional(),
  privateVehicleId: z.coerce.number().optional(),
  privateStaffId: z.coerce.number().optional(),

  plateNumber: z.string().optional(),
  driverName: z.string().optional(),
  vehicleName: z.string().optional(),
});
