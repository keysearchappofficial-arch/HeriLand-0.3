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

/* =========================
   Review Sheet
========================= */

let selectedReviewRating = 0;
let localReviews = [];

const writeReviewBtn = document.getElementById("detailWriteReviewBtn");
const reviewSheetLayer = document.getElementById("reviewSheetLayer");
const reviewSheetBackdrop = document.getElementById("reviewSheetBackdrop");
const reviewSheetClose = document.getElementById("reviewSheetClose");
const reviewRating = document.getElementById("reviewRating");
const reviewComment = document.getElementById("reviewComment");
const reviewSubmitBtn = document.getElementById("reviewSubmitBtn");
const reviewImageInput = document.getElementById("reviewImageInput");
const reviewUploadPreview = document.getElementById("reviewUploadPreview");
const reviewPlaceName = document.getElementById("reviewPlaceName");

writeReviewBtn?.addEventListener("click", () => {
  reviewSheetLayer?.classList.add("is-open");

  const title =
    document.getElementById("detailTitle")?.textContent || "";

  if (reviewPlaceName) {
    reviewPlaceName.textContent = title;
  }
});

reviewSheetBackdrop?.addEventListener("click", closeReviewSheet);
reviewSheetClose?.addEventListener("click", closeReviewSheet);

function closeReviewSheet(){
  reviewSheetLayer?.classList.remove("is-open");
}

reviewRating?.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    selectedReviewRating = Number(button.dataset.rate);

    reviewRating
      .querySelectorAll("button")
      .forEach((btn) => {
        btn.classList.toggle(
          "is-active",
          Number(btn.dataset.rate) <= selectedReviewRating
        );
      });
  });
});

reviewImageInput?.addEventListener("change", () => {
  if (!reviewUploadPreview) return;

  reviewUploadPreview.innerHTML = "";

  [...reviewImageInput.files].forEach((file) => {
    const url = URL.createObjectURL(file);

    reviewUploadPreview.innerHTML += `
      <img src="${url}" alt="">
    `;
  });
});

reviewSubmitBtn?.addEventListener("click", () => {
  const comment = reviewComment?.value.trim();

  if (!selectedReviewRating || !comment) {
    alert("Please add a rating and comment.");
    return;
  }

  const review = {
    rating: selectedReviewRating,
    comment,
    name: "Traveler"
  };

  localReviews.unshift(review);

  renderDetailReviews();

  reviewComment.value = "";
  selectedReviewRating = 0;

  reviewRating
    ?.querySelectorAll("button")
    .forEach((btn) => btn.classList.remove("is-active"));

  if (reviewUploadPreview) {
    reviewUploadPreview.innerHTML = "";
  }

  closeReviewSheet();
});

function renderDetailReviews(){
  const list = document.getElementById("detailReviewList");

  if (!list) return;

  list.innerHTML = localReviews
    .slice(0, 2)
    .map((review) => {
      return `
        <div class="detail-review-card">
          <strong>${"★".repeat(review.rating)}</strong>
          <p>${review.comment}</p>
        </div>
      `;
    })
    .join("");
}

window.addPlaceToTrip = function () {
  console.log("Add to trip");
};

window.openPlaceMap = function () {
  console.log("Open map");
};

window.sharePlace = function () {
  console.log("Share place");
};

window.showNearbyPlaces = function () {
  console.log("Show nearby places");
};

window.continueWithAiGuide = function () {
  console.log("Continue with AI Guide");
};

/* =========================
   Review List Sheet
========================= */

const detailReviewMoreBtn =
  document.getElementById("detailReviewMoreBtn");

const reviewListLayer =
  document.getElementById("reviewListLayer");

const reviewListBackdrop =
  document.getElementById("reviewListBackdrop");

const reviewListClose =
  document.getElementById("reviewListClose");

detailReviewMoreBtn?.addEventListener("click", () => {
  renderAllDetailReviews();
  reviewListLayer?.classList.add("is-open");
});

reviewListBackdrop?.addEventListener("click", closeReviewList);
reviewListClose?.addEventListener("click", closeReviewList);

function closeReviewList(){
  reviewListLayer?.classList.remove("is-open");
}

function renderAllDetailReviews(){
  const list =
    document.getElementById("reviewListContent");

  const title =
    document.getElementById("reviewListTitle");

  if (!list) return;

  if (title) {
    title.textContent =
      localReviews.length
        ? `${getAverageRating()} · ${localReviews.length} Reviews`
        : "0.0 · No Reviews Yet";
  }

  if (!localReviews.length) {
    list.innerHTML = `
      <div class="detail-review-card">
        <strong>No reviews yet</strong>
        <p>Be the first traveler to share your experience.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = localReviews
    .map((review) => {
      return `
        <div class="detail-review-card">
          <strong>${"★".repeat(review.rating)}</strong>
          <p>${review.comment}</p>
        </div>
      `;
    })
    .join("");
}

function getAverageRating(){
  if (!localReviews.length) return "0.0";

  const total = localReviews.reduce((sum, review) => {
    return sum + review.rating;
  }, 0);

  return (total / localReviews.length).toFixed(1);
}
