// explore/auth-ui.js

console.log("✅ auth-ui.js loaded");

export function bindAuthUI(){

  console.log("🔐 bindAuthUI()");

  const authLayer =
    document.getElementById("authLayer");

  const authBackdrop =
    document.getElementById("authBackdrop");

  const authEmail =
    document.getElementById("authEmail");

  const authPassword =
    document.getElementById("authPassword");

  const authLoginBtn =
    document.getElementById("authLoginBtn");

  const authSignupBtn =
    document.getElementById("authSignupBtn");

  const authGoogleBtn =
    document.getElementById("authGoogleBtn");

  const avatarLoginBtn =
    document.getElementById("avatarLoginBtn");

  const avatarSignupBtn =
    document.getElementById("avatarSignupBtn");

  const logoutLayer =
    document.getElementById("logoutLayer");

  const logoutBackdrop =
    document.getElementById("logoutBackdrop");

  const logoutCancelBtn =
    document.getElementById("logoutCancelBtn");

  const logoutConfirmBtn =
    document.getElementById("logoutConfirmBtn");

  console.log("authLayer:", !!authLayer);
  console.log("authLoginBtn:", !!authLoginBtn);
  console.log("authGoogleBtn:", !!authGoogleBtn);
  console.log("logoutLayer:", !!logoutLayer);

  function openAuthModal(){
    console.log("🔐 openAuthModal()");
    authLayer?.classList.add("is-open");
    document.body.classList.add("no-scroll");
  }

  function closeAuthModal(){
    console.log("🔐 closeAuthModal()");
    authLayer?.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  }

  function openLogoutSheet(){
    console.log("🚪 openLogoutSheet()");
    logoutLayer?.classList.add("is-open");
    document.body.classList.add("no-scroll");
  }

  function closeLogoutSheet(){
    console.log("🚪 closeLogoutSheet()");
    logoutLayer?.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  }

  window.openAuthModal = openAuthModal;
  window.closeAuthModal = closeAuthModal;
  window.openLogoutSheet = openLogoutSheet;
  window.closeLogoutSheet = closeLogoutSheet;

  window.requireLogin = async function(actionText = "use this feature"){
    const user =
      await window.getCurrentUser?.();

    if (user) return true;

    alert(`Please login to ${actionText}.`);

    openAuthModal();

    return false;
  };

  avatarLoginBtn?.addEventListener("click", () => {
    console.log("🔐 avatar login clicked");
    openAuthModal();
  });

  avatarSignupBtn?.addEventListener("click", async () => {
    console.log("🔐 avatar signup/logout clicked");

    const user =
      await window.getCurrentUser?.();

    if (user) {
      openLogoutSheet();
      return;
    }

    openAuthModal();
  });

  authBackdrop?.addEventListener("click", () => {
    closeAuthModal();
  });

  authLoginBtn?.addEventListener("click", async () => {
    console.log("🔐 email login clicked");

    const email =
      authEmail?.value.trim();

    const password =
      authPassword?.value.trim();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    const user =
      await window.loginWithEmail?.(
        email,
        password
      );

    if (!user) return;

    closeAuthModal();

    await updateAuthUI();
  });

  authSignupBtn?.addEventListener("click", async () => {
    console.log("🔐 signup clicked");

    const email =
      authEmail?.value.trim();

    const password =
      authPassword?.value.trim();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    const user =
      await window.signUpWithEmail?.(
        email,
        password
      );

    if (!user) return;

    alert(
      "Account created. Please check your email if confirmation is required."
    );

    closeAuthModal();

    await updateAuthUI();
  });

  authGoogleBtn?.addEventListener("click", async () => {
    console.log("🔐 google login clicked");
    await window.loginWithGoogle?.();
  });

  logoutBackdrop?.addEventListener("click", () => {
    closeLogoutSheet();
  });

  logoutCancelBtn?.addEventListener("click", () => {
    closeLogoutSheet();
  });

  logoutConfirmBtn?.addEventListener("click", async () => {
    console.log("🚪 logout confirmed");

    await window.logout?.();

    localStorage.removeItem("heriland_saved_items");
    localStorage.removeItem("heriland_trip_items");
    localStorage.removeItem("heriland_reviews");

    closeLogoutSheet();

    location.reload();
  });

  console.log("✅ auth UI bound");
}

export async function updateAuthUI(){

  console.log("🔐 updateAuthUI()");

  const user =
    await window.getCurrentUser?.();

  const avatarLoginBtn =
    document.getElementById("avatarLoginBtn");

  const avatarSignupBtn =
    document.getElementById("avatarSignupBtn");

  const avatarUserName =
    document.getElementById("avatarUserName");

  const avatarUserDesc =
    document.getElementById("avatarUserDesc");

  const avatarPanelImage =
    document.querySelector(".avatar-panel-image");

  const DEFAULT_AVATAR_URL =
    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=300&q=80";

  if (!user) {
    console.log("🔐 user: not logged in");

    if (avatarUserName) {
      avatarUserName.textContent =
        "Welcome Traveler";
    }

    if (avatarUserDesc) {
      avatarUserDesc.textContent =
        "Save places, build trips, and contribute to HeriLand.";
    }

    if (avatarPanelImage) {
      avatarPanelImage.src =
        DEFAULT_AVATAR_URL;
    }

    if (avatarLoginBtn) {
      avatarLoginBtn.style.display = "block";
    }

    if (avatarSignupBtn) {
      avatarSignupBtn.style.display = "block";
      avatarSignupBtn.textContent = "Sign Up";
    }

    return;
  }

  console.log("🔐 user:", user.email);

  const profile =
    JSON.parse(
      localStorage.getItem(`heriland_account_profile_${user.id}`) ||
      localStorage.getItem("heriland_account_profile") ||
      "{}"
    );

  if (!profile.name && user.email) {
    profile.name = user.email;

    localStorage.setItem(
      `heriland_account_profile_${user.id}`,
      JSON.stringify(profile)
    );
  }

  if (avatarUserName) {
    avatarUserName.textContent =
      profile.name || user.email;
  }

  if (avatarUserDesc) {
    avatarUserDesc.textContent =
      "Travel slowly through Sarawak.";
  }

  if (avatarPanelImage) {
    avatarPanelImage.src =
      profile.avatarUrl || DEFAULT_AVATAR_URL;
  }

  if (avatarLoginBtn) {
    avatarLoginBtn.style.display = "none";
  }

  if (avatarSignupBtn) {
    avatarSignupBtn.style.display = "block";
    avatarSignupBtn.textContent = "Logout";
  }
}

window.updateAuthUI = updateAuthUI;
