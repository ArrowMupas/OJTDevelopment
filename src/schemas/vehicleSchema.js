import { z } from "zod";

export const vehicleSchema = z
  .object({
    vehicleName: z
      .string()
      .min(2, "Vehicle name must be at least 2 characters"),

    plateNumber: z
      .string()
      .min(2, "Plate number must be at least 2 characters"),

    policyNumber: z
      .string()
      .min(2, "Policy number must be at least 2 characters"),

    policyID: z.string().min(2, "Policy ID must be at least 2 characters"),

    requiredCovered: z
      .string()
      .min(2, "Required covered must be at least 2 characters"),

    issueDate: z.string().min(1, "Issue date is required"),

    periodFrom: z.string().min(1, "Period from is required"),

    periodTo: z.string().min(1, "Period to is required"),

    engineNumber: z.string().optional(),

    chassisNumber: z.string().optional(),

    fileNumber: z.string().optional(),

    yearModel: z.string().min(1, "Year Model is required"),

    periodDuration: z.string().min(1, "Period Duration is required"),

    periodDurationTo: z.string().min(1, "Period Duration To is required"),

    acquisitionDate: z.string().min(1, "Acquisition date is required"),

    acquisitionCost: z.coerce
      .number()
      .min(0, "Acquisition cost must be positive"),
  })
  .refine((data) => new Date(data.periodTo) >= new Date(data.periodFrom), {
    message: "Period To must be after Period From",
    path: ["periodTo"],
  });
