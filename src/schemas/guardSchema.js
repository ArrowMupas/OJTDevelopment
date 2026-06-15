import { z } from "zod";

export const guardSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),

  lastName: z.string().min(2, "Last name must be at least 2 characters"),

  middleInitial: z
    .string()
    .max(2, "Middle initial must be at most 2 characters")
    .optional()
    .or(z.literal("")),

  role: z.string().min(2, "Role is required"),

  email: z
    .string()
    .email("Invalid email address")
    .nullable()
    .optional()
    .or(z.literal("")),

  contact: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number must be at most 15 digits")
    .nullable()
    .optional()
    .or(z.literal("")),
});
