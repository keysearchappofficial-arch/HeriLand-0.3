// explore/detail-bridge.js

import { state } from "./state.js";

console.log("✅ detail-bridge.js loaded");

export function openCardDetail(cardEl){

  console.log("📄 openCardDetail()");

  const slug =
    cardEl?.dataset.slug;

  const type =
    cardEl?.dataset.type;

  console.log("detail slug:", slug);
  console.log("detail type:", type);

  if (!slug) {
    console.log("⛔ no slug for detail");
    return;
  }

  state.currentOpenedItem =
    state.cards.find(card => card.slug === slug) || null;

  console.log(
    "currentOpenedItem:",
    state.currentOpenedItem
  );

  if (type === "event") {
    console.log("🎉 route: openEventDetail");
    window.openEventDetail?.(slug);
    return;
  }

  if (type === "culture") {
    console.log("🏺 route: openCultureDetail");
    window.openCultureDetail?.(slug);
    return;
  }

  if (type === "experience") {
    console.log("🧳 route: openTravelerDetail");
    window.openTravelerDetail?.(slug);
    return;
  }

  console.log("📍 route: openDetail");
  window.openDetail?.(slug);
}

window.openCardDetail =
  openCardDetail;