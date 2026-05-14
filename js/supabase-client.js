// js/supabase-client.js

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://hmmminllmtfnsellpvyt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbW1pbmxsbXRmbnNlbGxwdnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MjI4MjcsImV4cCI6MjA5NDI5ODgyN30.9z5e_CaKUOskbLLoQr3F6bgqKyDMCmsrWUGLoDsUnug";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
