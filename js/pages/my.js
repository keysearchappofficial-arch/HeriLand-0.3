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
  const fullItem = findFullItem(item);
  openDetail(fullItem);
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
  bindMobileMenu();
  bindMyViews();
  bindFeedbackButton();

  renderSavedSheet();
  renderTripSheet();
  renderRecentSheet();

  updateMyCounts();

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

function openDetail(place) {
  addRecent(place);

  const detailPage =
    document.getElementById("detailPage");

  if (!place || !detailPage) return;

  const normalized = {
    ...place,

    name:
      place.name ||
      place.title ||
      "Untitled Place",

    image:
      place.image ||
      "",

    address:
      place.address ||
      place.location ||
      place.meta ||
      "Sarawak",

    phone:
      place.phone ||
      "Not Available",

    hours:
      place.hours ||
      "Check Before Visiting",

    contactName:
      place.contactName ||
      "HeriLand Guide",

    contactImage:
      place.contactImage ||
      place.image ||
      "",

    images:
      place.images ||
      [
        place.image,
        place.image2,
        place.image3,
        place.image4
      ].filter(Boolean),

    intro:
      place.intro ||
      place.desc ||
      place.reason ||
      place.guide ||
      "A place worth staying awhile.",

    type:
      place.type ||
      place.food ||
      place.tags?.[0] ||
      "Recommended Place",

    area:
      place.area ||
      place.city ||
      place.location ||
      place.meta ||
      "Sarawak",

    score:
      place.score ||
      "4.8",

    reviewCount:
      place.reviewCount ||
      "128",

    tags:
      place.tags ||
      [
        "Slow Travel",
        "Photo Friendly",
        "Recommended"
      ],

    services:
      place.services ||
      [
        "Good for photos and slow visits",
        "Can be added to your trip",
        "Navigation available"
      ]
  };

  setText("detailTitle", normalized.name);
  setText("detailAddress", normalized.address);
  setText("detailPhone", normalized.phone);
  setText("detailHours", normalized.hours);
  setText("detailIntro", normalized.intro);

  setText("detailType", normalized.type);
  setText("detailArea", normalized.area);
  setText("detailScore", normalized.score);
  setText(
    "detailReviewCount",
    `${normalized.reviewCount} Reviews`
  );
  setText("detailAiNote", normalized.intro);

  renderDetailSlider(
    normalized.images ||
    [normalized.image].filter(Boolean),
    normalized.name
  );

  const list =
    document.getElementById("detailServices");

  if (list) {
    list.innerHTML =
      normalized.services
        .map(service => `<li>${service}</li>`)
        .join("");
  }

  bindDetailActions(normalized);

  detailPage.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeDetail() {
  const detailPage =
    document.getElementById("detailPage");

  if (!detailPage) return;

  detailPage.classList.remove("show");
  document.body.style.overflow = "";
}

function renderDetailSlider(images, altText) {
  const slider =
    document.getElementById("detailSlider");

  const dots =
    document.getElementById("detailDots");

  if (!slider || !dots) return;

  const list =
    images && images.length
      ? images
      : [
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
        ];

  slider.innerHTML = "";
  dots.innerHTML = "";

  list.forEach((src, index) => {
    const slide =
      document.createElement("div");

    slide.className = "detail-slide";

    slide.innerHTML = `
      <img src="${src}" alt="${altText}">
    `;

    slider.appendChild(slide);

    const dot =
      document.createElement("button");

    dot.className =
      `detail-dot ${index === 0 ? "active" : ""}`;

    dot.type = "button";

    dot.onclick = () => {
      slider.scrollTo({
        left: slider.clientWidth * index,
        behavior: "smooth"
      });
    };

    dots.appendChild(dot);
  });

  slider.onscroll = () => {
    const current =
      Math.round(
        slider.scrollLeft /
        slider.clientWidth
      );

    dots
      .querySelectorAll(".detail-dot")
      .forEach((dot, i) => {
        dot.classList.toggle(
          "active",
          i === current
        );
      });
  };
}

function bindDetailActions(item) {
  const saveBtn =
    document.getElementById("detailSaveBtn");

  const addTripBtn =
    document.getElementById("addTripBtn");

  if (saveBtn) {
    saveBtn.textContent =
      isSaved("saved", item.id) ? "♥" : "♡";

    saveBtn.onclick = () => {
      if (isSaved("saved", item.id)) {
        removeItem("saved", item.id);
      }
      else {
        saveItem("saved", item);
      }

      saveBtn.textContent =
        isSaved("saved", item.id) ? "♥" : "♡";

      renderSavedSheet();
      updateMyCounts();
    };
  }

  if (addTripBtn) {
    addTripBtn.onclick = () => {
      saveItem("trip", item);

      renderTripSheet();
      updateMyCounts();

      alert("Added to My Trip");
    };
  }
}

window.closeDetail = closeDetail;

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
