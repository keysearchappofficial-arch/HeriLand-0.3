import { loadExploreCards } from "./cards.js";

let appStarted = false;

async function bootExplore(){
  if (appStarted) return;
  appStarted = true;

  document.body.classList.remove("no-scroll");

  await window.getCurrentUser?.();
  await loadExploreCards();

  console.log("HeriLand Explore booted");
}

window.addEventListener("DOMContentLoaded", bootExplore);