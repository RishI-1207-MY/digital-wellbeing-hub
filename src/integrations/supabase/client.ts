
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wdbwvrtixcrvozznreof.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkYnd2cnRpeGNydm96em5yZW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzczMTksImV4cCI6MjA1OTg1MzMxOX0.lB0xB8lhNknF_U64YI1mnnRYrEitnqKh_osIvFUvl1k";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
