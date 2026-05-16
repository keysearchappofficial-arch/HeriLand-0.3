async function getCurrentUser(){
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

async function signUpWithEmail(email, password){
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return null;
  }

  return data.user;
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

  return data.user;
}

async function logout(){
  await supabase.auth.signOut();
}