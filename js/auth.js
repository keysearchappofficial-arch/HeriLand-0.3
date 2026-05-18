async function getCurrentUser(){
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Get session failed:", error);
    return null;
  }

  return data?.session?.user || null;
}

async function loginWithEmail(email, password){
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return null;
  }

  return data?.user || null;
}

async function signUpWithEmail(email, password){
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        "https://keysearchappofficial-arch.github.io/HeriLand-0.3/explore.html"
    }
  });

  if (error) {
    alert(error.message);
    return null;
  }

  return data?.user || null;
}

async function loginWithGoogle(){
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        "https://keysearchappofficial-arch.github.io/HeriLand-0.3/explore.html"
    }
  });

  if (error) {
    console.error("Google login failed:", error);
    alert("Google login failed.");
  }
}

async function logout(){
  await supabase.auth.signOut({ scope: "global" });

  Object.keys(localStorage).forEach((key) => {
    if (
      key.startsWith("sb-") ||
      key.includes("supabase")
    ) {
      localStorage.removeItem(key);
    }
  });

  sessionStorage.clear();
}

window.getCurrentUser = getCurrentUser;
window.loginWithEmail = loginWithEmail;
window.signUpWithEmail = signUpWithEmail;
window.loginWithGoogle = loginWithGoogle;
window.logout = logout;
