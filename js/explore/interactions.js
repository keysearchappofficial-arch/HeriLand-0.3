// explore/interactions.js

import { state } from "./state.js";
import { renderCards } from "./cards.js";
import { toggleSaved } from "./saved.js";

console.log("✅ interactions.js loaded");

const stage =
  document.getElementById("exploreStage");

console.log(
  "✅ exploreStage:",
  !!stage
);

export function bindEvents(){

  console.log("🔄 bindEvents()");

  const nextBtn =
    document.querySelector(".nav-next");

  const prevBtn =
    document.querySelector(".nav-prev");

  const activeCard =
    document.querySelector(".card.active");

  console.log(
    "➡️ next button:",
    !!nextBtn
  );

  console.log(
    "⬅️ prev button:",
    !!prevBtn
  );

  console.log(
    "🃏 active card:",
    !!activeCard
  );

  nextBtn?.addEventListener("click", () => {

    console.log("➡️ next clicked");

    nextCard();

  });

  prevBtn?.addEventListener("click", () => {

    console.log("⬅️ prev clicked");

    prevCard();

  });

const saveBtn =
  document.querySelector(".card.active .save");

console.log("❤️ save button:", !!saveBtn);

saveBtn?.addEventListener("click", async (event) => {
  event.preventDefault();
  event.stopPropagation();

  console.log("❤️ save clicked");

  const loggedIn =
    await window.requireLogin?.("save places");

  if (!loggedIn) {
    console.log("⛔ save blocked: not logged in");
    return;
  }

  const cardEl =
    saveBtn.closest(".card.active");

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

    openDetailPage(
      event.currentTarget
    );

  });

}

export function nextCard(){

  console.log("➡️ nextCard()");

  console.log(
    "before currentIndex:",
    state.currentIndex
  );

  if (state.isAnimating) {

    console.log(
      "⛔ blocked: animating"
    );

    return;
  }

  state.isAnimating = true;

  state.currentIndex =
    (state.currentIndex + 1)
    % state.cards.length;

  console.log(
    "after currentIndex:",
    state.currentIndex
  );

  renderCards();

  setTimeout(() => {

    state.isAnimating = false;

    console.log(
      "✅ animation finished"
    );

  }, 300);

}

export function prevCard(){

  console.log("⬅️ prevCard()");

  console.log(
    "before currentIndex:",
    state.currentIndex
  );

  if (state.isAnimating) {

    console.log(
      "⛔ blocked: animating"
    );

    return;
  }

  state.isAnimating = true;

  state.currentIndex =
    (
      state.currentIndex - 1 +
      state.cards.length
    ) % state.cards.length;

  console.log(
    "after currentIndex:",
    state.currentIndex
  );

  renderCards();

  setTimeout(() => {

    state.isAnimating = false;

    console.log(
      "✅ animation finished"
    );

  }, 300);

}

function openDetailPage(cardEl){

  console.log(
    "📄 openDetailPage()"
  );

  const slug =
    cardEl?.dataset.slug;

  const type =
    cardEl?.dataset.type;

  console.log(
    "slug:",
    slug
  );

  console.log(
    "type:",
    type
  );

  if (!slug) {

    console.log(
      "⛔ no slug"
    );

    return;
  }

  if (type === "event") {

    console.log(
      "🎉 openEventDetail"
    );

    window.openEventDetail?.(slug);

    return;
  }

  if (type === "culture") {

    console.log(
      "🏺 openCultureDetail"
    );

    window.openCultureDetail?.(slug);

    return;
  }

  console.log(
    "📍 openDetail"
  );

  window.openDetail?.(slug);

}
