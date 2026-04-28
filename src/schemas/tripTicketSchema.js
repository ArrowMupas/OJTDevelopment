import { z } from "zod";

export const tripTicketSchema = z.object({
  dttNo: z.string().min(1, "DTT number is required"),

  driverId: z.number({
    required_error: "Driver is required",
  }),

  dateReceived: z.string().min(1, "Date is required"),

  timeReceived: z.string().min(1, "Time is required"),

  rating: z.number().min(1, "Rating is required").max(5, "Max rating is 5"),
});
