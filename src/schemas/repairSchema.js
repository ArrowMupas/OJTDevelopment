import { z } from "zod";

export const repairSchema = z
  .object({
    vehicleId: z.string().min(1, "Vehicle is required"),
    type: z.string().min(1, "Type is required"),

    maintenance1: z.string().optional(),
    maintenance2: z.string().optional(),

    serviceShop: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      (data.type === "internal" || data.type === "internal-mini") &&
      (!data.maintenance1 || !data.maintenance2)
    ) {
      if (!data.maintenance1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["maintenance1"],
          message: "Maintenance personnel 1 is required",
        });
      }

      if (!data.maintenance2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["maintenance2"],
          message: "Maintenance personnel 2 is required",
        });
      }
    }

    if (data.type === "external" && !data.serviceShop) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["serviceShop"],
        message: "Service shop is required",
      });
    }
  });
