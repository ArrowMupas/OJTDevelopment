import { z } from "zod";

export const surveySchema = z.object({
  // email: z.email({ message: "Please enter a valid email" }),
  lastName: z.string().nonempty("Last name is required"),
  firstName: z.string().nonempty("First name is required"),
  travelDate: z.string().nonempty("Travel date is required"),
  driverName: z.string().nonempty("Driver is required"),
  vehicle: z.string().nonempty("Vehicle is required"),
  appearance: z.string().nonempty("Required"),
  behavior: z.string().nonempty("Required"),
  safety: z.string().nonempty("Required"),
  vehicleCondition: z.string().nonempty("Required"),
  onTime: z.string().nonempty("Required"),
  comments: z.string().nonempty("Comments are required"),
});
