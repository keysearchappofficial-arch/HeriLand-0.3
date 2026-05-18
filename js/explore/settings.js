// explore/settings.js

console.log("✅ settings.js loaded");

const THEME_KEY =
  "heriland_theme";

const MAP_PROVIDER_KEY =
  "heriland_map_provider";

export function renderSettingsPage(){

  console.log("⚙️ renderSettingsPage()");

  return `
    <div class="settings-list">

      <div class="settings-row">

        <div class="settings-head">
          <h4>Language</h4>
          <p>Choose your preferred display language.</p>
        </div>

        <select
          class="settings-select"
          id="settingLanguage"
        >
          <option value="en">
            English
          </option>

          <option value="zh">
            中文
          </option>
        </select>

      </div>

      <div class="settings-row">

        <div class="settings-head">
          <h4>Appearance</h4>
          <p>Choose how HeriLand looks on your device.</p>
        </div>

        <div
          class="setting-segment"
          id="settingAppearance"
        >
          <button
            type="button"
            data-value="system"
          >
            System
          </button>

          <button
            type="button"
            data-value="light"
          >
            Light
          </button>

          <button
            type="button"
            data-value="dark"
          >
            Dark
          </button>
        </div>

      </div>

      <div class="settings-row">

        <div class="settings-head">
          <h4>Map</h4>
          <p>Select your preferred navigation app.</p>
        </div>

        <select
          class="settings-select"
          id="settingMap"
        >
          <option value="apple">
            Apple Maps
          </option>

          <option value="google">
            Google Maps
          </option>
        </select>

      </div>

      <div class="settings-about">
        <h4>About HeriLand</h4>

        <p>
          Version 1.0 · Explore Sarawak slowly.
        </p>
      </div>

    </div>
  `;
}

export function bindSettingsPage(){

  console.log("⚙️ bindSettingsPage()");

  bindAppearanceSetting();
  bindMapSetting();

  console.log("✅ settings page bound");
}

export function getSavedTheme(){

  return localStorage.getItem(THEME_KEY) || "dark";

}

function getSystemTheme(){

  return window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches
    ? "light"
    : "dark";

}

export function applyTheme(theme){

  console.log("🎨 applyTheme:", theme);

  const finalTheme =
    theme === "system"
      ? getSystemTheme()
      : theme;

  document.body.dataset.theme =
    finalTheme;

  localStorage.setItem(
    THEME_KEY,
    theme
  );

}

function bindAppearanceSetting(){

  const savedTheme =
    getSavedTheme();

  const buttons =
    document.querySelectorAll(
      "#settingAppearance button"
    );

  console.log(
    "🎨 appearance buttons:",
    buttons.length
  );

  buttons.forEach((button) => {

    const value =
      button.dataset.value;

    button.classList.toggle(
      "active",
      value === savedTheme
    );

    button.addEventListener("click", () => {

      console.log(
        "🎨 theme clicked:",
        value
      );

      buttons.forEach(btn =>
        btn.classList.remove("active")
      );

      button.classList.add("active");

      applyTheme(value);

    });

  });

}

export function getDefaultMapProvider(){

  const isIOS =
    /iPad|iPhone|iPod/.test(
      navigator.userAgent
    ) ||
    (
      navigator.platform === "MacIntel" &&
      navigator.maxTouchPoints > 1
    );

  return isIOS ? "apple" : "google";
}

export function getSavedMapProvider(){

  return (
    localStorage.getItem(MAP_PROVIDER_KEY) ||
    getDefaultMapProvider()
  );

}

export function saveMapProvider(provider){

  console.log("🗺️ saveMapProvider:", provider);

  localStorage.setItem(
    MAP_PROVIDER_KEY,
    provider
  );

}

function bindMapSetting(){

  const mapSelect =
    document.getElementById("settingMap");

  console.log("🗺️ mapSelect:", !!mapSelect);

  if (!mapSelect) return;

  mapSelect.value =
    getSavedMapProvider();

  mapSelect.addEventListener("change", () => {

    saveMapProvider(
      mapSelect.value
    );

  });

}

window
  .matchMedia("(prefers-color-scheme: light)")
  .addEventListener("change", () => {

    if (getSavedTheme() === "system") {
      applyTheme("system");
    }

  });

applyTheme(getSavedTheme());

window.getSavedMapProvider =
  getSavedMapProvider;