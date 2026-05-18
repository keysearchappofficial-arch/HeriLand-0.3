// explore/avatar-place-actions.js

import {
  removeSaved
} from "./saved.js";

import {
  removeFromTrip
} from "./trip.js";

console.log("✅ avatar-place-actions.js loaded");

export function bindAvatarPlaceActions(){

  console.log("🧩 bindAvatarPlaceActions()");

  bindSavedDelete();
  bindTripDelete();
  bindOpenCard();

  console.log("✅ avatar place actions bound");
}

function bindSavedDelete(){

  document
    .querySelectorAll("[data-remove-saved]")
    .forEach((button) => {

      console.log(
        "❤️ remove saved button:",
        button.dataset.removeSaved
      );

      button.addEventListener("click", (event) => {

        event.preventDefault();
        event.stopPropagation();

        const slug =
          button.dataset.removeSaved;

        console.log(
          "❤️ removing saved:",
          slug
        );

        removeSaved(slug);

        const row =
          button.closest(".traveler-place-row");

        row?.remove();

        window.updateAvatarStats?.();

      });

    });

}

function bindTripDelete(){

  document
    .querySelectorAll("[data-remove-trip]")
    .forEach((button) => {

      console.log(
        "🧳 remove trip button:",
        button.dataset.removeTrip
      );

      button.addEventListener("click", (event) => {

        event.preventDefault();
        event.stopPropagation();

        const slug =
          button.dataset.removeTrip;

        console.log(
          "🧳 removing trip:",
          slug
        );

        removeFromTrip(slug);

        const row =
          button.closest(".traveler-place-row");

        row?.remove();

        window.updateAvatarStats?.();

      });

    });

}

function bindOpenCard(){

  document
    .querySelectorAll("[data-open-slug]")
    .forEach((row) => {

      row.addEventListener("click", () => {

        const slug =
          row.dataset.openSlug;

        console.log(
          "📄 avatar open slug:",
          slug
        );

        if (!slug) return;

        const type =
          row.dataset.type;

        if (type === "event") {
          window.openEventDetail?.(slug);
          return;
        }

        if (type === "culture") {
          window.openCultureDetail?.(slug);
          return;
        }

        window.openDetail?.(slug);

      });

    });

}