import { z } from "zod";

export const voucherSchema = z.object({
  controlNo: z.string().min(1, "Required"),
  payeeName: z.string().min(1, "Required"),
  transactionType: z.string().min(1, "Required"),
  particulars: z.string().min(1, "Required"),
  amount: z.coerce.number().positive(),
  date: z.string().min(1, "Required"),
});
