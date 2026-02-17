import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jprkleohthakfrnncnon.supabase.co";
const supabaseAnonKey = "sb_publishable_oeVAw8ism2OQr2pv2tIkvQ_wMhJYWYI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
