// explore/interactions.js

import { state } from "./state.js";
import { renderCards } from "./cards.js";
import { toggleSaved } from "./saved.js";
import { openCardDetail } from "./detail-bridge.js";

console.log("✅ interactions.js loaded");

export function bindEvents(){

  console.log("🔄 bindEvents()");

  const nextBtn =
    document.querySelector(".nav-next");

  const prevBtn =
    document.querySelector(".nav-prev");

  const activeCard =
    document.querySelector(".card.active");

  const saveBtn =
    document.querySelector(".card.active .save");

  console.log("➡️ next button:", !!nextBtn);
  console.log("⬅️ prev button:", !!prevBtn);
  console.log("🃏 active card:", !!activeCard);
  console.log("❤️ save button:", !!saveBtn);

  nextBtn?.addEventListener("click", () => {
    console.log("➡️ next clicked");
    nextCard();
  });

  prevBtn?.addEventListener("click", () => {
    console.log("⬅️ prev clicked");
    prevCard();
  });

  saveBtn?.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    console.log("❤️ save clicked");

    const requireLogin =
      window.requireLogin || (async () => true);

    const loggedIn =
      await requireLogin("save places");

    if (!loggedIn) {
      console.log("⛔ save blocked: not logged in");
      return;
    }

    const button =
      event.currentTarget;

    const cardEl =
      button.closest(".card.active");

    const slug =
      cardEl?.dataset.slug;

    const item =
      state.cards.find(card => card.slug === slug);

    if (!item) {
      console.log("⛔ save item not found:", slug);
      return;
    }

    const ok =
      await toggleSaved(item);

    if (!ok) return;

    window.updateAvatarStats?.();

    renderCards();
  });

activeCard?.addEventListener("click", (event) => {
  console.log("🃏 card clicked");

  openCardDetail(
    event.currentTarget
  );
});

}

export function nextCard(){

  if (!state.cards.length) {
    console.log("⛔ no cards");
    return;
  }

  console.log("➡️ nextCard()");
  console.log("before currentIndex:", state.currentIndex);

  if (state.isAnimating) {
    console.log("⛔ blocked: animating");
    return;
  }

  state.isAnimating = true;

  state.currentIndex =
    (state.currentIndex + 1) %
    state.cards.length;

  console.log("after currentIndex:", state.currentIndex);

  renderCards();

  setTimeout(() => {
    state.isAnimating = false;
    console.log("✅ animation finished");
  }, 300);
}

export function prevCard(){

  if (!state.cards.length) {
    console.log("⛔ no cards");
    return;
  }

  console.log("⬅️ prevCard()");
  console.log("before currentIndex:", state.currentIndex);

  if (state.isAnimating) {
    console.log("⛔ blocked: animating");
    return;
  }

  state.isAnimating = true;

  state.currentIndex =
    (
      state.currentIndex - 1 +
      state.cards.length
    ) % state.cards.length;

  console.log("after currentIndex:", state.currentIndex);

  renderCards();

  setTimeout(() => {
    state.isAnimating = false;
    console.log("✅ animation finished");
  }, 300);
}
