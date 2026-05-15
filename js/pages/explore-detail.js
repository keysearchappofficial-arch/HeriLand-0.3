const detailPage =
  document.getElementById("detailPage");

/* =========================
   Open
========================= */

window.openDetail = async function (slug) {

  if (!detailPage) return;

  detailPage.classList.add("is-open");

  document.body.classList.add("no-scroll");

  await loadDetail(slug);

};

/* =========================
   Close
========================= */

window.closeDetail = function () {

  detailPage.classList.remove("is-open");

  document.body.classList.remove("no-scroll");

};

/* =========================
   Mock Data
========================= */

const detailData = {
  "kuching-waterfront": {
    type: "Recommended Place",
    area: "Kuching",

    title: "Kuching Waterfront",

    score: "4.8",
    reviews: "128 Reviews",

    address:
      "93000 Kuching Waterfront, Sarawak",

    phone:
      "+60 82-000000",

    hours:
      "Open Daily · 24 Hours",

    ai:
      "A place where the city slows down with the river.",

    intro:
      "Kuching Waterfront is one of the most loved public spaces in Sarawak. Travelers come here for riverside walks, local food, sunsets, and the quiet rhythm of the city.",

    services: [
      "Riverside Walking Area",
      "Local Food Nearby",
      "Sunset Spot",
      "Night View"
    ],

    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",

      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80",

      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80"
    ]
  },

  "borneo-rainforest": {
    type: "Nature",
    area: "Sarawak",

    title: "Borneo Rainforest",

    score: "4.9",
    reviews: "84 Reviews",

    address:
      "Borneo Rainforest Area, Sarawak",

    phone:
      "Not Available",

    hours:
      "Best Morning Visit",

    ai:
      "Mist, silence, and rainforest air that changes your pace.",

    intro:
      "A quieter side of Sarawak filled with rainforest sounds, morning fog, and slower trails made for travelers who want to disconnect.",

    services: [
      "Nature Trail",
      "Rainforest View",
      "Photography Spot",
      "Quiet Escape"
    ],

    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80",

      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80"
    ]
  }
};

/* =========================
   Load Detail
========================= */

async function loadDetail(slug) {

  const data = detailData[slug];

  if (!data) return;

  renderDetail(data);

}

/* =========================
   Render
========================= */

function renderDetail(data) {

  document.getElementById("detailType").textContent =
    data.type || "";

  document.getElementById("detailArea").textContent =
    data.area || "";

  document.getElementById("detailTitle").textContent =
    data.title || "";

  document.getElementById("detailScore").textContent =
    data.score || "0.0";

  document.getElementById("detailReviewCount").textContent =
    data.reviews || "0 Reviews";

  document.getElementById("detailAddress").textContent =
    data.address || "";

  document.getElementById("detailPhone").textContent =
    data.phone || "Not Available";

  document.getElementById("detailHours").textContent =
    data.hours || "";

  document.getElementById("detailAiNote").textContent =
    data.ai || "";

  document.getElementById("detailIntro").textContent =
    data.intro || "";

  renderServices(data.services || []);
  renderGallery(data.images || []);
}

/* =========================
   Services
========================= */

function renderServices(items) {

  const el =
    document.getElementById("detailServices");

  if (!el) return;

  el.innerHTML =
    items
      .map(item => `<li>${item}</li>`)
      .join("");
}

/* =========================
   Gallery
========================= */

function renderGallery(images) {

  const slider =
    document.getElementById("detailSlider");

  const dots =
    document.getElementById("detailDots");

  if (!slider || !dots) return;

  slider.innerHTML =
    images.map((image) => {
      return `
        <div class="detail-slide">
          <img src="${image}" alt="">
        </div>
      `;
    }).join("");

  dots.innerHTML =
    images.map((_, index) => {
      return `
        <div class="detail-dot ${
          index === 0 ? "active" : ""
        }"></div>
      `;
    }).join("");
}

/* =========================
   Save
========================= */

document
  .getElementById("detailSaveBtn")
  ?.addEventListener("click", (event) => {

    event.currentTarget.classList.toggle("is-saved");

    event.currentTarget.textContent =
      event.currentTarget.classList.contains("is-saved")
        ? "♥"
        : "♡";
  });

/* =========================
   More
========================= */

document
  .getElementById("detailMoreBtn")
  ?.addEventListener("click", () => {
    document
      .getElementById("detailMoreLayer")
      ?.classList.add("is-open");
  });

document
  .getElementById("detailMoreBackdrop")
  ?.addEventListener("click", () => {

    document
      .getElementById("detailMoreLayer")
      ?.classList.remove("is-open");
  });
