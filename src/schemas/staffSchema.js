import { z } from "zod";

export const staffSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),

  lastName: z.string().min(2, "Last name must be at least 2 characters"),

  middleInitial: z
    .string()
    .min(1, "Middle initial must be at least 1 character")
    .optional(),

  designation: z.string().min(2, "Designation must be at least 2 characters"),

  email: z.email("Invalid email address"),

  contact: z.string().min(7, "Contact number must be at least 7 digits"),

  isMechanic: z.boolean().default(false),

  licenseExpiration: z.string().optional().or(z.literal("")),
});
