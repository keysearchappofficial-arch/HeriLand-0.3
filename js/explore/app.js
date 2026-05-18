import { loadExploreCards } from "./cards.js";
import { bindFilters } from "./filters.js";

console.log("✅ app.js loaded");

let appStarted = false;

async function bootExplore(){
  if (appStarted) return;
  appStarted = true;

  console.log("🚀 bootExplore()");

  document.body.classList.remove("no-scroll");

  bindFilters();

  await loadExploreCards();

  console.log("✅ HeriLand Explore booted");
}

window.addEventListener("DOMContentLoaded", bootExplore);
