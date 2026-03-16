import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type EventRegistration = {
  id?: string;
  created_at?: string;
  full_name: string;
  phone: string;
  email: string | null;
  community: string;
  is_producer: boolean;
  is_student: boolean;
  is_visitor: boolean;
  works_in_org: boolean;
  interested_in_agroecology: boolean;
  wants_to_sell: boolean;
  products_to_sell: string | null;
  needs_table: boolean;
  brings_table: boolean;
  bringing_seeds: boolean;
  seed_types: string | null;
  interest_compost: boolean;
  interest_networking: boolean;
  interest_seeds: boolean;
  interest_future_events: boolean;
  consent_given: boolean;
};
