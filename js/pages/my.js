import { initDetail } from "../detail.js";
import { initEventDetail } from "../event-detail.js";
import { initTravelerDetail } from "../traveler-detail.js";

import {
  loadMarkdownContent
} from "../md-loader.js";

import {
  getItems,
  saveItem,
  removeItem,
  isSaved,
  addRecent
} from "../storage.js";

import {
  places,
  restaurants
} from "../data.js";

function findFullItem(item) {
  const allItems = [
    ...places,
    ...restaurants
  ];

  return (
    allItems.find(source => source.id === item.id) ||
    item
  );
}

function openStoredItem(item) {

  const fullItem =
    findFullItem(item);

  window.openDetail(fullItem);
}

function getSavedPlaces() {
  return getItems("saved");
}

function getMyTrip() {
  return getItems("trip");
}

function getRecentlyViewed() {
  return getItems("recent");
}

function updateMyCounts() {
  const savedCount = getSavedPlaces().length;
  const tripCount = getMyTrip().length;
  const recentCount = getRecentlyViewed().length;

  setText("savedCount", savedCount);
  setText("tripCount", tripCount);
  setText("recentCount", recentCount);
}

function setText(id, value) {
  const el = document.getElementById(id);

  if (el) {
    el.textContent = value;
  }
}

/* =========================
   Init
========================= */

function init() {

initDetail();
initEventDetail();
initTravelerDetail();

  bindMobileMenu();
  bindMyViews();
  bindFeedbackButton();

  renderSavedSheet();
  renderTripSheet();
  renderRecentSheet();

  updateMyCounts();

  loadMarkdownContent();
}

function bindMyViews() {

  const mainView =
    document.getElementById(
      "myMainView"
    );

  const allViews =
    document.querySelectorAll(
      ".my-view-sub"
    );

  let viewStack = [];

  /* =========================
     Open View
  ========================= */

  document
    .querySelectorAll("[data-open-view]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const targetId =
            button.dataset.openView;

          const target =
            document.getElementById(
              targetId
            );

          if (!target) return;

          /* Current active */

          const current =
            document.querySelector(
              ".my-view-sub.active"
            );

          if (current) {
            viewStack.push(current.id);
          }

          else {
            viewStack.push("main");
          }

          /* Push main */

          mainView.classList.add(
            "is-pushed"
          );

          /* Hide all */

          allViews.forEach(view => {
            view.classList.remove(
              "active"
            );
          });

          /* Show target */

          target.classList.add(
            "active"
          );

          /* Lock body */

          document.body.style.overflow =
            "hidden";

          /* Scroll top */

          target.scrollTo({
            top: 0
          });

        }
      );

    });

  /* =========================
     Back View
  ========================= */

  document
    .querySelectorAll("[data-back-view]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const current =
            button.closest(
              ".my-view-sub"
            );

          if (!current) return;

          /* Hide current */

          current.classList.remove(
            "active"
          );

          /* Previous */

          const prev =
            viewStack.pop();

          /* Back to main */

          if (
            !prev ||
            prev === "main"
          ) {

            mainView.classList.remove(
              "is-pushed"
            );

            document.body.style.overflow =
              "";

            window.scrollTo({
              top: 0
            });

            return;

          }

          /* Back to previous sub */

          const prevView =
            document.getElementById(
              prev
            );

          if (prevView) {

            prevView.classList.add(
              "active"
            );

            prevView.scrollTo({
              top: 0
            });

          }

        }
      );

    });

}

/* =========================
   Mobile Menu
========================= */

function bindMobileMenu() {

  const menu =
    document.querySelector(
      ".mobile-menu"
    );

  const openBtn =
    document.getElementById(
      "mobileMenuBtn"
    );

  const closeBtn =
    document.getElementById(
      "mobileMenuClose"
    );

  if (
    !menu ||
    !openBtn ||
    !closeBtn
  ) return;

  openBtn.addEventListener(
    "click",
    () => {

      menu.classList.add(
        "show"
      );

      document.body.style.overflow =
        "hidden";

    }
  );

  closeBtn.addEventListener(
    "click",
    () => {

      menu.classList.remove(
        "show"
      );

      document.body.style.overflow =
        "";

    }
  );

  menu.addEventListener(
    "click",
    e => {

      if (e.target === menu) {

        menu.classList.remove(
          "show"
        );

        document.body.style.overflow =
          "";

      }

    }
  );

}

/* =========================
   My Sheet
========================= */

/* =========================
   Open
========================= */

/* =========================
   Close
========================= */

/* =========================
   Saved Sheet
========================= */

function renderSavedSheet() {
  const grid =
    document.getElementById("savedSheetGrid");

  if (!grid) return;

  const savedPlaces = getSavedPlaces();

  grid.innerHTML = "";

  if (!savedPlaces.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No Saved Places Yet</h3>
        <p>
          Start exploring Sarawak and save places or restaurants you love.
        </p>
      </div>
    `;

    return;
  }

  savedPlaces.forEach(place => {
    const card =
      document.createElement("article");

    card.className = "saved-card";

    card.innerHTML = `
      <img
        src="${place.image}"
        alt="${place.title || place.name}"
      >

      <div class="saved-card-body">

        <small>
          ${getItemLabel(place)}
        </small>

        <h3>
          ${place.title || place.name}
        </h3>

        <p>
          ${place.address || place.type || ""}
        </p>

      </div>
    `;

    card.addEventListener("click", () => {
  openStoredItem(place);
});

    grid.appendChild(card);
  });
}

/* =========================
   Trip Sheet
========================= */

function renderTripSheet() {
  const grid =
    document.getElementById("tripSheetGrid");

  if (!grid) return;

  const myTrip = getMyTrip();

  grid.innerHTML = "";

  if (!myTrip.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No Trip Plans Yet</h3>
        <p>
          Add places or restaurants into My Trip to build your Sarawak journey.
        </p>
      </div>
    `;

    return;
  }

  myTrip.forEach(plan => {
    const card =
      document.createElement("article");

    card.className = "trip-card";

    card.innerHTML = `
      <small>
        ${getItemLabel(plan)}
      </small>

      <h3>
        ${plan.title || plan.name}
      </h3>

      <p>
        ${plan.address || plan.type || ""}
      </p>
    `;

    card.addEventListener("click", () => {
  openStoredItem(plan);
});

    grid.appendChild(card);
  });
}

function bindFeedbackButton() {
  const button =
    document.getElementById("feedbackBtn");

  if (!button) return;

  button.addEventListener("click", () => {
    window.location.href = "./feedback.html";
  });
}

/* =========================
   Recent Sheet
========================= */

function renderRecentSheet() {
  const list =
    document.getElementById("recentSheetList");

  if (!list) return;

  const recentlyViewed = getRecentlyViewed();

  list.innerHTML = "";

  if (!recentlyViewed.length) {
    list.innerHTML = `
      <div class="empty-state">
        <h3>No Recently Viewed</h3>
        <p>
          Places and restaurants you open will appear here.
        </p>
      </div>
    `;

    return;
  }

  recentlyViewed.forEach(item => {
    const row =
      document.createElement("article");

    row.className = "recent-item";

    row.innerHTML = `
      <img
        src="${item.image}"
        alt="${item.title || item.name}"
      >

      <div>
        <small>
          ${getItemLabel(item)}
        </small>

        <h3>
          ${item.title || item.name}
        </h3>

        <p>
          ${item.address || item.type || ""}
        </p>
      </div>
    `;

    row.addEventListener("click", () => {
  openStoredItem(item);
});

    list.appendChild(row);
  });
}

function getItemLabel(item) {

  if (
    item.food ||
    item.category === "restaurant"
  ) {
    return "Restaurant";
  }

  if (
    item.type
  ) {
    return item.type;
  }

  return "Place";

}

/* =========================
   Start
========================= */

let appStarted = false;

function startPage() {

  if (appStarted) return;

  appStarted = true;

  console.log(
    "[my] init"
  );

  init();

}

if (window.componentsLoaded) {

  startPage();

}
else {

  window.addEventListener(
    "componentsReady",
    startPage
  );

}
