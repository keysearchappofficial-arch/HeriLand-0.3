import { state } from "./state.js";
import { dom } from "./dom.js";

export function openDetail(index) {

  const place =
    state.currentPlaces[index];

  if (!place) return;

  /* =========================
     Image
  ========================= */

  const detailImage =
    document.getElementById("detailImage");

  if (detailImage) {
    detailImage.src = place.image || "";
    detailImage.alt = place.name || "";
  }

  /* =========================
     Basic Info
  ========================= */

setText(
  "detailTitle",
  place.name || "Untitled Place"
);

  setText(
    "detailAddress",
    place.address || "Kuching, Sarawak"
  );

  setText(
    "detailPhone",
    place.phone || "+60 12-345 6789"
  );

  setText(
    "detailHours",
    place.hours || "10:00 AM – 9:00 PM"
  );

  /* =========================
     Contact
  ========================= */

  const contactImage =
    document.getElementById(
      "detailContactImage"
    );

  if (contactImage) {
    contactImage.src =
      place.contactImage ||
      place.image ||
      "";

    contactImage.alt =
      place.contactName ||
      place.name ||
      "";
  }

  setText(
    "detailContactName",
    place.contactName ||
    "HeriLand Guide"
  );

  /* =========================
     Intro
  ========================= */

setText(
  "detailIntro",
  place.intro ||
  place.reason ||
  place.guide ||
  place.desc ||
  "A place worth staying awhile."
);

  /* =========================
     Services
  ========================= */

  const services =
const services =
  place.services || [
    "Nearby route recommendations",
    "Good for photos and slow visits",
    "Can be added to your trip",
    "Navigation available"
  ];

  const serviceList =
    document.getElementById(
      "detailServices"
    );

  if (serviceList) {

    serviceList.innerHTML =
      services
        .map(item => `
          <li>${item}</li>
        `)
        .join("");
  }

  /* =========================
     AI Box
  ========================= */

setText(
  "detailReason",
  place.reason ||
  "A place worth exploring slowly."
);

  const aiTags =
    document.getElementById(
      "detailAiTags"
    );

  if (aiTags) {

const tags =
  place.tags || [
    "Slow Travel",
    "Recommended",
    "Local"
  ];

    aiTags.innerHTML =
      tags
        .slice(0, 5)
        .map(tag => `
          <span>${tag}</span>
        `)
        .join("");
  }

  /* =========================
     Show Page
  ========================= */

  dom.detailView
    ?.classList.add("show");

  document.body.style.overflow =
    "hidden";
}

export function closeDetail() {

  dom.detailView
    ?.classList.remove("show");

  document.body.style.overflow =
    "";
}

/* =========================
   AI Sheet
========================= */

export function openAiSheet() {

  dom.aiSheet
    ?.classList.add("show");
}

export function closeAiSheet() {

  dom.aiSheet
    ?.classList.remove("show");
}

/* =========================
   Helpers
========================= */

function setText(id, value) {

  const el =
    document.getElementById(id);

  if (!el) return;

  el.textContent =
    value || "";
}
