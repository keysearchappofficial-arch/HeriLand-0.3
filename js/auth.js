async function getCurrentUser(){

  const {
    data,
    error
  } = await supabase.auth.getSession();

  if (error) {
    console.warn(
      "Get session failed:",
      error
    );

    return null;
  }

  return data?.session?.user || null;
}

async function signUpWithEmail(email, password){

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
    console.error("Signup failed:", error);

    alert(error.message);

    return null;
  }

  return data?.user || null;
}

async function loginWithEmail(email, password){

  const {
    data,
    error
  } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error("Login failed:", error);

    alert(error.message);

    return null;
  }

  return data?.user || null;
}

async function logout(){

  const { error } =
    await supabase.auth.signOut();

  if (error) {
    console.error("Logout failed:", error);
  }

}
