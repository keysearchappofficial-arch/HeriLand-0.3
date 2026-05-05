/* =========================
   HeriLand App Entry
========================= */

import { renderMood } from "./render.js";
import { bindEvents, selectMoodFromSheet } from "./events.js";
import { initUserLocation } from "./location.js";
import { openDetail, closeDetail, openAiSheet, closeAiSheet } from "./detail.js";

/* =========================
   App Init
========================= */

function init() {
  // 綁定所有事件（chip / search 等）
  bindEvents();

  // 初始化定位（非同步）
  initUserLocation();

  // 預設畫面
  renderMood("relax");

  console.log("[HeriLand] App initialized");
}

/* =========================
   Global (給 HTML 用)
   ⚠️ 因為 HTML onclick 還在用
========================= */

window.openDetail = openDetail;
window.closeDetail = closeDetail;

window.openAiSheet = openAiSheet;
window.closeAiSheet = closeAiSheet;

window.selectMoodFromSheet = selectMoodFromSheet;

/* =========================
   Start
========================= */

init();