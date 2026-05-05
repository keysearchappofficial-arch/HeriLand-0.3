import { state } from "./state.js";
import { dom } from "./dom.js";

export function openDetail(index) {
  const place = state.currentPlaces[index];
  if (!place) return;

  document.getElementById("detailImage").src = place.image;
  document.getElementById("detailMeta").textContent = `${place.name} · ${place.distance}`;
  document.getElementById("detailTitle").textContent = place.title;
  document.getElementById("detailGuide").textContent = place.guide;
  document.getElementById("detailDistance").textContent = place.distance;
  document.getElementById("detailMood").textContent = place.moodLabel;
  document.getElementById("detailTime").textContent = place.time;
  document.getElementById("detailCrowd").textContent = place.crowd;
  document.getElementById("detailReason").textContent = place.reason;

  dom.detailView?.classList.add("show");
  document.body.style.overflow = "hidden";
}

export function closeDetail() {
  dom.detailView?.classList.remove("show");
  document.body.style.overflow = "";
}

export function openAiSheet() {
  dom.aiSheet?.classList.add("show");
}

export function closeAiSheet() {
  dom.aiSheet?.classList.remove("show");
}