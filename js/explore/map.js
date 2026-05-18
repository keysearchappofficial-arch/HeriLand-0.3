// explore/map.js

import {
  getSavedMapProvider
} from "./settings.js";

console.log("✅ map.js loaded");

export function openMapByPreference({
  title = "",
  address = "",
  mapUrl = ""
}){

  console.log("🗺️ openMapByPreference()");
  console.log("title:", title);
  console.log("address:", address);
  console.log("mapUrl:", mapUrl);

  const provider =
    getSavedMapProvider();

  console.log("provider:", provider);

  const query =
    encodeURIComponent(
      [title, address]
        .filter(Boolean)
        .join(" ")
    );

  if (!query && mapUrl) {
    console.log("🗺️ open raw mapUrl");
    window.open(mapUrl, "_blank");
    return;
  }

  if (!query) {
    alert("Map information is not available.");
    return;
  }

  if (provider === "apple") {
    console.log("🗺️ open Apple Maps");

    window.location.href =
      `maps://maps.apple.com/?q=${query}`;

    setTimeout(() => {
      window.open(
        `https://maps.apple.com/?q=${query}`,
        "_blank"
      );
    }, 900);

    return;
  }

  console.log("🗺️ open Google Maps");

  if (/Android/i.test(navigator.userAgent)) {
    window.location.href =
      `geo:0,0?q=${query}`;

    setTimeout(() => {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${query}`,
        "_blank"
      );
    }, 900);

    return;
  }

  window.open(
    `https://www.google.com/maps/search/?api=1&query=${query}`,
    "_blank"
  );
}

window.openMapByPreference =
  openMapByPreference;