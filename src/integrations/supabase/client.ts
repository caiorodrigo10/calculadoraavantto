// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://ywajuqzdhdtalsutzpjd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3YWp1cXpkaGR0YWxzdXR6cGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0NTA2MzMsImV4cCI6MjA0NzAyNjYzM30.Br0apEEd8Jno82HBjhfy7C5jb4rNUOC2KTlui-WI6Iw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);