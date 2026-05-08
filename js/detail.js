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
    place.name || "未命名地點"
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
    "這是一個值得慢慢停留的地方。"
  );

  /* =========================
     Services
  ========================= */

  const services =
    place.services || [
      "AI 推薦附近路線",
      "適合拍照與停留",
      "可加入個人行程",
      "可直接導航前往"
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
    "這個地方很適合慢慢探索。"
  );

  const aiTags =
    document.getElementById(
      "detailAiTags"
    );

  if (aiTags) {

    const tags =
      place.tags || [
        "慢旅",
        "推薦",
        "在地"
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