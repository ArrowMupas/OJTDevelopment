import { z } from "zod";

export const vehicleRequestSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),

  department: z
    .string()
    .nonempty({ message: "Department/Division/Office is required" }),

  destination: z.string().nonempty({ message: "Destination is required" }),

  departureTime: z.string().nonempty({ message: "Departure time is required" }),

  departureDate: z.string().nonempty({ message: "Departure date is required" }),

  purpose: z.string().nonempty({ message: "Purpose of travel is required" }),

  items: z
    .string()
    .nonempty({ message: "Please select what you are bringing" }),

  itemsOther: z.string().optional(),

  passengers: z
    .string()
    .nonempty({ message: "Passenger name(s) are required" }),

  travelDuration: z
    .string()
    .nonempty({ message: "Travel duration is required" }),

  otherInstructions: z.string().optional(),

  passengerContactNumber: z.string().optional(),

  requestedBy: z.string().nonempty({ message: "Requester name is required" }),
});
