import { state } from "./state.js";
import { renderCards } from "./cards.js";

const stage =
  document.getElementById("exploreStage");

export function bindEvents(){

  document
    .querySelector(".nav-next")
    ?.addEventListener("click", nextCard);

  document
    .querySelector(".nav-prev")
    ?.addEventListener("click", prevCard);

  document
    .querySelector(".card.active")
    ?.addEventListener("click", (event) => {

      openDetailPage(
        event.currentTarget
      );

    });

}

export function nextCard(){

  if (state.isAnimating) return;

  state.isAnimating = true;

  state.currentIndex =
    (state.currentIndex + 1)
    % state.cards.length;

  renderCards();

  setTimeout(() => {
    state.isAnimating = false;
  }, 300);

}

export function prevCard(){

  if (state.isAnimating) return;

  state.isAnimating = true;

  state.currentIndex =
    (
      state.currentIndex - 1 +
      state.cards.length
    ) % state.cards.length;

  renderCards();

  setTimeout(() => {
    state.isAnimating = false;
  }, 300);

}

function openDetailPage(cardEl){

  const slug =
    cardEl?.dataset.slug;

  const type =
    cardEl?.dataset.type;

  console.log(
    "open detail:",
    slug,
    type
  );

  if (!slug) return;

  if (type === "event") {
    window.openEventDetail?.(slug);
    return;
  }

  if (type === "culture") {
    window.openCultureDetail?.(slug);
    return;
  }

  window.openDetail?.(slug);

}
