// js/supabase-client.js



const SUPABASE_URL = "https://hmmminllmtfnsellpvyt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbW1pbmxsbXRmbnNlbGxwdnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MjI4MjcsImV4cCI6MjA5NDI5ODgyN30.9z5e_CaKUOskbLLoQr3F6bgqKyDMCmsrWUGLoDsUnug";

window.supabase =

  supabase.createClient(

    SUPABASE_URL,

    SUPABASE_ANON_KEY

  );
