// explore/swipe.js

import { state } from "./state.js";
import { renderCards } from "./cards.js";
import { nextCard, prevCard } from "./interactions.js";

console.log("✅ swipe.js loaded");

let startX = 0;
let currentX = 0;
let isDragging = false;
let hasMoved = false;

const SWIPE_THRESHOLD = 90;

function isInteractionLocked(){
  return (
    document.body.classList.contains("no-scroll") ||
    document.querySelector(".avatar-panel-layer.is-open") ||
    document.querySelector(".filter-panel.is-open") ||
    document.querySelector(".detail-page.is-open") ||
    document.querySelector(".event-detail-page.is-open") ||
    document.querySelector(".culture-detail-page.is-open") ||
    document.querySelector(".traveler-detail-page.is-open") ||
    document.querySelector(".review-sheet-layer.is-open") ||
    document.querySelector(".review-list-layer.is-open") ||
    document.querySelector(".detail-more-layer.is-open") ||
    document.querySelector(".event-more-layer.is-open") ||
    document.querySelector(".culture-more-layer.is-open") ||
    document.querySelector(".traveler-more-layer.is-open")
  );
}

export function bindSwipe(){

  console.log("👆 bindSwipe()");

  document.addEventListener("touchstart", (event) => {
    if (isInteractionLocked()) return;
    if (state.isAnimating) return;

    const activeCard =
      document.querySelector(".card.active");

    if (!activeCard) return;

    startX = event.touches[0].clientX;
    currentX = startX;
    isDragging = true;
    hasMoved = false;

    activeCard.style.transition = "none";

    console.log("👆 touchstart:", startX);
  });

  document.addEventListener("touchmove", (event) => {
    if (isInteractionLocked()) return;
    if (!isDragging || state.isAnimating) return;

    const activeCard =
      document.querySelector(".card.active");

    if (!activeCard) return;

    currentX = event.touches[0].clientX;

    const diffX =
      currentX - startX;

    if (Math.abs(diffX) > 8) {
      hasMoved = true;
    }

    const rotate =
      diffX * 0.06;

    const opacity =
      Math.max(
        1 - Math.abs(diffX) / 420,
        0.35
      );

    activeCard.style.transform = `
      translateX(calc(-50% + ${diffX}px))
      rotate(${rotate}deg)
      scale(1)
    `;

    activeCard.style.opacity = opacity;
  });

  document.addEventListener("touchend", (event) => {
    if (isInteractionLocked()) return;
    if (!isDragging || state.isAnimating) return;

    isDragging = false;

    const activeCard =
      document.querySelector(".card.active");

    const secondCard =
      document.querySelector(".card.second");

    const thirdCard =
      document.querySelector(".card.third");

    if (!activeCard) return;

    const diffX =
      currentX - startX;

    console.log("👆 touchend diff:", diffX);

    activeCard.style.transition =
      "transform .38s cubic-bezier(.22,.9,.28,1), opacity .38s ease";

    if (!hasMoved) {
      const target = event.target;

      if (
        target.closest("button") ||
        target.closest(".save") ||
        target.closest(".filter-panel") ||
        target.closest(".city")
      ) {
        return;
      }

      if (target.closest(".card.active")) {
        target.closest(".card.active").click();
      }

      return;
    }

    state.isAnimating = true;

    if (Math.abs(diffX) < SWIPE_THRESHOLD) {
      activeCard.style.transform = `
        translateX(-50%)
        rotate(0deg)
        scale(1)
      `;

      activeCard.style.opacity = "1";

      setTimeout(() => {
        state.isAnimating = false;
        console.log("✅ swipe cancelled");
      }, 380);

      return;
    }

    secondCard?.classList.add("promote");
    thirdCard?.classList.add("promote-second");

    if (diffX < 0) {
      activeCard.style.transform = `
        translateX(calc(-50% - 520px))
        rotate(-18deg)
        scale(.96)
      `;

      activeCard.style.opacity = "0";

      setTimeout(() => {
        state.currentIndex =
          (state.currentIndex + 1) %
          state.cards.length;

        renderCards();

        state.isAnimating = false;

        console.log("✅ swiped left");
      }, 380);

      return;
    }

    if (diffX > 0) {
      activeCard.style.transform = `
        translateX(calc(-50% + 520px))
        rotate(18deg)
        scale(.96)
      `;

      activeCard.style.opacity = "0";

      setTimeout(() => {
        state.currentIndex =
          (
            state.currentIndex - 1 +
            state.cards.length
          ) % state.cards.length;

        renderCards();

        state.isAnimating = false;

        console.log("✅ swiped right");
      }, 380);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (isInteractionLocked()) return;

    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowUp"
    ) {
      nextCard();
    }

    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowDown"
    ) {
      prevCard();
    }
  });

  console.log("✅ swipe events bound");
}
