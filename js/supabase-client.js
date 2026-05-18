// js/supabase-client.js

const SUPABASE_URL =
  "https://hmmminllmtfnsellpvyt.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbW1pbmxsbXRmbnNlbGxwdnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MjI4MjcsImV4cCI6MjA5NDI5ODgyN30.9z5e_CaKUOskbLLoQr3F6bgqKyDMCmsrWUGLoDsUnug";


window.supabase =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,

    {
      auth: {

        persistSession: true,

        autoRefreshToken: true,

        detectSessionInUrl: true

      }
    }
  );

/* =========================
   Auth Helpers
========================= */

async function getCurrentUser(){

  const {
    data,
    error
  } = await supabase.auth.getSession();

  if (error) {

    console.error(
      "Get session failed:",
      error
    );

    return null;
  }

  return data?.session?.user || null;
}

async function signUpWithEmail(
  email,
  password
){

  const {
    data,
    error
  } = await supabase.auth.signUp({

    email,
    password,

    options: {

      emailRedirectTo:
        "https://keysearchappofficial-arch.github.io/HeriLand-0.3/explore.html"

    }

  });

  if (error) {

    console.error(
      "Signup failed:",
      error
    );

    alert(error.message);

    return null;
  }

  return data?.user || null;
}

async function loginWithEmail(
  email,
  password
){

  const {
    data,
    error
  } = await supabase.auth.signInWithPassword({

    email,
    password

  });

  if (error) {

    console.error(
      "Login failed:",
      error
    );

    alert(error.message);

    return null;
  }

  return data?.user || null;
}

async function logout(){

  const { error } =
    await supabase.auth.signOut();

  if (error) {

    console.error(
      "Logout failed:",
      error
    );

  }

}

/* =========================
   Expose to window
========================= */

window.getCurrentUser =
  getCurrentUser;

window.signUpWithEmail =
  signUpWithEmail;

window.loginWithEmail =
  loginWithEmail;

window.logout =
  logout;

/* =========================
   Debug
========================= */

supabase.auth.onAuthStateChange(
  async (event, session) => {

    console.log(
      "Auth changed:",
      event,
      session
    );

  }
);
