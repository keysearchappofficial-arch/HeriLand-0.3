import { loadExploreCards } from "./cards.js";
import { bindFilters } from "./filters.js";
import { bindSwipe } from "./swipe.js";
import {
  bindAuthUI,
  updateAuthUI
} from "./auth-ui.js";
import {
  bindAvatarPanel,
  updateAvatarStats
} from "./avatar-panel.js";

console.log("✅ app.js loaded");

let appStarted = false;

async function bootExplore(){
  if (appStarted) return;
  appStarted = true;

  console.log("🚀 bootExplore()");

  document.body.classList.remove("no-scroll");

  bindAuthUI();
  bindAvatarPanel();
  bindFilters();
  bindSwipe();

  await updateAuthUI();

  updateAvatarStats();

  await loadExploreCards();

  console.log("✅ HeriLand Explore booted");
}

window.addEventListener("DOMContentLoaded", bootExplore);