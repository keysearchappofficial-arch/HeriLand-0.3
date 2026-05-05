import { state } from "./state.js";
import { dom } from "./dom.js";

export function openDetail(index) {
  const place = state.currentPlaces[index];
  if (!place) return;

  document.getElementById("detailImage").src = place.image;
  document.getElementById("detailTitle").textContent = place.name;
  document.getElementById("detailAddress").textContent = place.address || "Kuching, Sarawak";
  document.getElementById("detailPhone").textContent = place.phone || "+60 12-345 6789";
  document.getElementById("detailHours").textContent = place.hours || "10:00 AM – 9:00 PM";
  document.getElementById("detailReason").textContent = place.reason || place.guide || place.desc;

  const services = place.services || [
    "AI 推薦附近路線",
    "適合拍照與停留",
    "可加入個人行程",
    "可直接導航前往"
  ];

  const serviceList = document.getElementById("detailServices");
  if (serviceList) {
    serviceList.innerHTML = services.map(item => `<li>${item}</li>`).join("");
  }

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