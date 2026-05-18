// explore/avatar-panel.js

import {
  getSavedItems,
  getTripItems,
  getReviews
} from "./storage.js";

console.log("✅ avatar-panel.js loaded");

let avatarCurrentPageKey = null;
let avatarSupportMode = false;
let avatarContributeMode = false;

export function bindAvatarPanel(){

  console.log("👤 bindAvatarPanel()");

  const topAvatarBtn =
    document.getElementById("topAvatarBtn");

  const avatarPanelLayer =
    document.getElementById("avatarPanelLayer");

  const avatarPanelBackdrop =
    document.getElementById("avatarPanelBackdrop");

  const avatarHomeView =
    document.getElementById("avatarHomeView");

  const avatarSubView =
    document.getElementById("avatarSubView");

  const avatarSubBack =
    document.getElementById("avatarSubBack");

  console.log("topAvatarBtn:", !!topAvatarBtn);
  console.log("avatarPanelLayer:", !!avatarPanelLayer);
  console.log("avatarPanelBackdrop:", !!avatarPanelBackdrop);
  console.log("avatarHomeView:", !!avatarHomeView);
  console.log("avatarSubView:", !!avatarSubView);

  function resetAvatarPanel(){
    console.log("👤 resetAvatarPanel()");

    avatarSubView?.classList.remove("is-active");
    avatarHomeView?.classList.add("is-active");

    avatarCurrentPageKey = null;
    avatarSupportMode = false;
    avatarContributeMode = false;
  }

  function closeAvatarPanel(){
    console.log("👤 closeAvatarPanel()");

    avatarPanelLayer?.classList.remove("is-open");
    document.body.classList.remove("no-scroll");

    resetAvatarPanel();
  }

  function openAvatarPanel(){
    console.log("👤 openAvatarPanel()");

    resetAvatarPanel();

    updateAvatarStats();

    avatarPanelLayer?.classList.add("is-open");
    document.body.classList.add("no-scroll");
  }

  topAvatarBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    openAvatarPanel();
  });

  avatarPanelBackdrop?.addEventListener("click", () => {
    closeAvatarPanel();
  });

  avatarSubBack?.addEventListener("click", () => {
    console.log("👤 avatar back clicked:", avatarCurrentPageKey);

    avatarSubView?.classList.remove("is-active");
    avatarHomeView?.classList.add("is-active");

    avatarCurrentPageKey = null;
    avatarSupportMode = false;
    avatarContributeMode = false;
  });

  window.closeAvatarPanel = closeAvatarPanel;
  window.resetAvatarPanel = resetAvatarPanel;

  console.log("✅ avatar panel bound");
}

export function updateAvatarStats(){

  console.log("📊 updateAvatarStats()");

  const savedCount =
    document.getElementById("savedCount");

  const tripCount =
    document.getElementById("tripCount");

  const reviewCount =
    document.getElementById("reviewCount");

  const savedLength =
    getSavedItems().length;

  const tripLength =
    getTripItems().length;

  const reviewLength =
    getReviews().length;

  if (savedCount) {
    savedCount.textContent = savedLength;
  }

  if (tripCount) {
    tripCount.textContent = tripLength;
  }

  if (reviewCount) {
    reviewCount.textContent = reviewLength;
  }

  console.log("📊 stats:", {
    saved: savedLength,
    trip: tripLength,
    reviews: reviewLength
  });
}

window.updateAvatarStats = updateAvatarStats;