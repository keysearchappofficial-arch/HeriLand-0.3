// explore/account.js

import {
  getSavedItems,
  getTripItems,
  getReviews
} from "./storage.js";

console.log("✅ account.js loaded");

const ACCOUNT_PROFILE_KEY =
  "heriland_account_profile";

const DEFAULT_AVATAR_URL =
  "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=300&q=80";

export function getAccountProfile(){

  return JSON.parse(
    localStorage.getItem(
      ACCOUNT_PROFILE_KEY
    ) || "{}"
  );

}

export function saveAccountProfile(profile){

  localStorage.setItem(
    ACCOUNT_PROFILE_KEY,
    JSON.stringify(profile)
  );

}

export function renderAccountPage(){

  console.log("👤 renderAccountPage()");

  return `
    <div class="account-paper">

      <div class="account-paper-head">

        <div class="account-avatar-block">

          <div class="account-avatar">

            <img
              id="accountAvatarImg"
              src=""
              alt="Traveler Avatar"
            >

          </div>

          <button
            class="account-avatar-edit"
            id="accountAvatarEditBtn"
            type="button"
          >
            Change Photo
          </button>

          <input
            id="accountAvatarInput"
            type="file"
            accept="image/*"
            hidden
          >

        </div>

        <div class="account-identity">

          <div class="account-name-top">

            <label>
              Traveler Name
            </label>

            <button
              class="account-inline-edit"
              id="accountEditBtn"
              type="button"
            >
              Edit
            </button>

          </div>

          <input
            id="accountName"
            class="account-paper-input account-name-input"
            type="text"
            value=""
            disabled
          >

          <p>
            Personal traveler profile
            for saved places, trips,
            reviews, and HeriLand activity.
          </p>

        </div>

      </div>

      <div class="account-paper-line"></div>

      <div class="account-section-title">
        Personal Information
      </div>

      <div class="account-paper-grid">

        <div class="account-field">

          <label>Date of Birth</label>

          <input
            id="accountBirth"
            class="account-paper-input"
            type="date"
            disabled
          >

        </div>

        <div class="account-field">

          <label>Phone</label>

          <input
            id="accountPhone"
            class="account-paper-input"
            type="tel"
            disabled
          >

        </div>

        <div class="account-field account-field-full">

          <label>Email</label>

          <input
            id="accountEmail"
            class="account-paper-input"
            type="email"
            disabled
          >

        </div>

      </div>

      <div class="account-section-title">
        Travel Profile
      </div>

      <div class="account-paper-grid">

        <div class="account-field">

          <label>Default Region</label>

          <select
            id="accountRegion"
            class="account-paper-select"
            disabled
          >
            <option value="sarawak">
              Sarawak
            </option>

            <option value="kuching">
              Kuching
            </option>

            <option value="sibu">
              Sibu
            </option>

            <option value="miri">
              Miri
            </option>

            <option value="bintulu">
              Bintulu
            </option>

          </select>

        </div>

      </div>

      <div class="account-travel-stats">

        <div>
          <strong id="accountSavedStat">
            ${getSavedItems().length}
          </strong>

          <span>Saved</span>
        </div>

        <div>
          <strong id="accountTripStat">
            ${getTripItems().length}
          </strong>

          <span>Trips</span>
        </div>

        <div>
          <strong id="accountReviewStat">
            ${getReviews().length}
          </strong>

          <span>Reviews</span>
        </div>

      </div>

      <div class="account-paper-actions">

        <button
          class="account-save-btn"
          id="accountSaveBtn"
          type="button"
        >
          Save Profile
        </button>

      </div>

    </div>
  `;
}

export async function bindAccountPage(){

  console.log("👤 bindAccountPage()");

  await loadAccountProfileToUI();

  setAccountEditMode(false);

  const editBtn =
    document.getElementById(
      "accountEditBtn"
    );

  const saveBtn =
    document.getElementById(
      "accountSaveBtn"
    );

  editBtn?.addEventListener(
    "click",
    async () => {

      console.log(
        "✏️ edit profile"
      );

      const loggedIn =
        await window.requireLogin?.(
          "edit your account profile"
        );

      if (!loggedIn) return;

      setAccountEditMode(true);

    }
  );

  saveBtn?.addEventListener(
    "click",
    async () => {

      console.log(
        "💾 save profile"
      );

      const loggedIn =
        await window.requireLogin?.(
          "save your account profile"
        );

      if (!loggedIn) return;

      saveAccountProfileFromUI();

      setAccountEditMode(false);

      await window.updateAuthUI?.();

      alert("Account updated");

    }
  );

  bindAccountAvatarUpload();

  console.log("✅ account page bound");
}

async function loadAccountProfileToUI(){

  console.log(
    "👤 loadAccountProfileToUI()"
  );

  const user =
    await window.getCurrentUser?.();

  const profile =
    getAccountProfile();

  const fallbackName =
    profile.name ||
    user?.email ||
    "Welcome Traveler";

  const avatarUrl =
    profile.avatarUrl ||
    DEFAULT_AVATAR_URL;

  const accountAvatarImg =
    document.getElementById(
      "accountAvatarImg"
    );

  if (accountAvatarImg) {
    accountAvatarImg.src = avatarUrl;
  }

  const accountName =
    document.getElementById(
      "accountName"
    );

  if (accountName) {
    accountName.value = fallbackName;
  }

  const accountEmail =
    document.getElementById(
      "accountEmail"
    );

  if (accountEmail) {
    accountEmail.value =
      profile.email ||
      user?.email ||
      "";
  }

  const accountPhone =
    document.getElementById(
      "accountPhone"
    );

  if (accountPhone) {
    accountPhone.value =
      profile.phone || "";
  }

  const accountBirth =
    document.getElementById(
      "accountBirth"
    );

  if (accountBirth) {
    accountBirth.value =
      profile.birth || "";
  }

  const accountRegion =
    document.getElementById(
      "accountRegion"
    );

  if (accountRegion) {
    accountRegion.value =
      profile.region ||
      "sarawak";
  }

  console.log(
    "✅ profile loaded"
  );
}

function saveAccountProfileFromUI(){

  console.log(
    "💾 saveAccountProfileFromUI()"
  );

  const oldProfile =
    getAccountProfile();

  const profile = {
    ...oldProfile,

    avatarUrl:
      oldProfile.avatarUrl ||
      DEFAULT_AVATAR_URL,

    name:
      document.getElementById(
        "accountName"
      )?.value.trim() || "",

    birth:
      document.getElementById(
        "accountBirth"
      )?.value || "",

    phone:
      document.getElementById(
        "accountPhone"
      )?.value.trim() || "",

    email:
      document.getElementById(
        "accountEmail"
      )?.value.trim() || "",

    region:
      document.getElementById(
        "accountRegion"
      )?.value || "sarawak"
  };

  saveAccountProfile(profile);

  console.log(
    "✅ profile saved",
    profile
  );
}

function setAccountEditMode(isEditing){

  console.log(
    "✏️ setAccountEditMode:",
    isEditing
  );

  const fields = [
    "accountName",
    "accountBirth",
    "accountPhone",
    "accountEmail",
    "accountRegion"
  ];

  fields.forEach((id) => {

    const el =
      document.getElementById(id);

    if (!el) return;

    el.disabled = !isEditing;

  });

  const avatarEditBtn =
    document.getElementById(
      "accountAvatarEditBtn"
    );

  if (avatarEditBtn) {
    avatarEditBtn.disabled =
      !isEditing;
  }

  const saveBtn =
    document.getElementById(
      "accountSaveBtn"
    );

  if (saveBtn) {

    saveBtn.style.display =
      isEditing
        ? "block"
        : "none";

  }

}

function bindAccountAvatarUpload(){

  console.log(
    "🖼️ bindAccountAvatarUpload()"
  );

  const editBtn =
    document.getElementById(
      "accountAvatarEditBtn"
    );

  const input =
    document.getElementById(
      "accountAvatarInput"
    );

  const img =
    document.getElementById(
      "accountAvatarImg"
    );

  editBtn?.addEventListener(
    "click",
    async () => {

      if (editBtn.disabled) return;

      input?.click();

    }
  );

  input?.addEventListener(
    "change",
    async () => {

      const file =
        input.files?.[0];

      if (!file) return;

      console.log(
        "🖼️ avatar file:",
        file.name
      );

      const imageUrl =
        URL.createObjectURL(file);

      if (img) {
        img.src = imageUrl;
      }

      const profile =
        getAccountProfile();

      profile.avatarUrl =
        imageUrl;

      saveAccountProfile(profile);

      console.log(
        "✅ avatar updated"
      );

    }
  );

}