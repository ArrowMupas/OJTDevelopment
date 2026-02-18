import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yelvewyjonvcyucwjcti.supabase.co";
const supabaseAnonKey = "sb_publishable_JuLUkBQJ3BXc7IiU5gX_Vw_uyourgHT";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
