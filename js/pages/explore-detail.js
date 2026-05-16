let currentDetailSlug = null;
let currentDetailType = "place";

const detailPage =
  document.getElementById("detailPage");

/* =========================
   Open
========================= */

window.openDetail = async function (slug) {

  if (!detailPage) return;

  currentDetailSlug = slug;

  const item =
    window.currentOpenedItem;

  currentDetailType =
    item?.contentType === "restaurant"
      ? "restaurant"
      : "place";

  detailPage.classList.add("is-open");

  document.body.classList.add("no-scroll");

  await loadDetail(slug);
  await loadDetailReviews(slug);

  syncDetailSaveButton();

};

/* =========================
   Close
========================= */

window.closeDetail = function () {

  detailPage.classList.remove("is-open");

  document.body.classList.remove("no-scroll");

};

/* =========================
   Load Detail
========================= */

async function loadDetail(slug){

  const { data, error } = await supabase
    .from("heriland_places")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("load detail failed:", error);

    renderDetail({
      type: "Place",
      area: "Sarawak",
      title: "Place not found",
      score: "0.0",
      reviews: "0 Reviews",
      address: "Address not available",
      phone: "Not Available",
      hours: "Check Before Visiting",
      ai: "This place may not be available yet.",
      intro: "",
      services: [],
      images: []
    });

    return;
  }

  if (!data) return;

  const images = [
    data.hero_image_url,
    data.card_image_url,
    ...(Array.isArray(data.gallery_urls) ? data.gallery_urls : [])
  ].filter(Boolean);

  renderDetail({
    type: formatPlaceType(data.type),
    area: data.area || data.city || "Sarawak",

    title: data.title || "",

    score: "New",
    reviews: "0 Reviews",

    address: data.address || "Address not available",
    phone: data.phone || "Not Available",

    hours:
      data.opening_hours?.label ||
      "Check Before Visiting",

    ai:
      data.short_description ||
      "A local place shared by travelers.",

    intro:
      data.full_description ||
      data.short_description ||
      "No description yet.",

    services:
      Array.isArray(data.tags)
        ? data.tags
        : [],

    images
  });

}

function formatPlaceType(type){
  const map = {
    place: "Recommended Place",
    restaurant: "Restaurant"
  };

  return map[type] || "Recommended Place";
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

  const fallbackImages = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80"
  ];

  images =
    images && images.length
      ? images
      : fallbackImages;

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

  setupDetailSlider(images.length);
}

/* =========================
   Save
========================= */

function syncDetailSaveButton(){
  const saveBtn =
    document.getElementById("detailSaveBtn");

  const item =
    window.currentOpenedItem;

  if (!saveBtn || !item) return;

  const saved =
    isSaved(item.slug);

  saveBtn.classList.toggle("is-saved", saved);

  saveBtn.textContent =
    saved ? "♥" : "♡";
}

document
  .getElementById("detailSaveBtn")
  ?.addEventListener("click", async (event) => {
    
    const loggedIn = await requireLogin("save places");
if (!loggedIn) return;

    const item =
      window.currentOpenedItem;

    if (!item) return;

    const ok =
      await toggleSaved(item);

    if (!ok) return;

    updateAvatarStats();
    renderCards();
    syncDetailSaveButton();
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
let currentDetailSlide = 0;

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

reviewSubmitBtn?.addEventListener("click", async () => {
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

const ok =
  await submitDetailReviewToSupabase(review);

if (!ok) return;

await loadDetailReviews(currentDetailSlug);

addReview({
  title:
    document.getElementById("detailTitle")?.textContent || "",
  text:
    comment,
  rating:
    "★".repeat(selectedReviewRating),
  image:
    window.currentOpenedItem?.image || "",
  slug:
    window.currentOpenedItem?.slug || "",
  createdAt:
    Date.now()
});

updateAvatarStats();

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

  syncDetailReviewStats();
}

function syncDetailReviewStats(){

  const scoreEl =
    document.getElementById("detailScore");

  const countEl =
    document.getElementById("detailReviewCount");

  const count =
    localReviews.length;

  if (scoreEl) {
    scoreEl.textContent =
      count ? getAverageRating() : "0.0";
  }

  if (countEl) {
    countEl.textContent =
      count === 1
        ? "1 Review"
        : `${count} Reviews`;
  }
}

async function loadDetailReviews(slug){

  const { data, error } = await supabase
    .from("heriland_reviews")
    .select("*")
    .eq("target_slug", slug)
    .eq("status", "published")
    .order("created_at", { ascending:false });

  if (error) {
    console.error("load reviews failed:", error);
    localReviews = [];
    renderDetailReviews();
    return;
  }

  localReviews = (data || []).map(review => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    name: "Traveler",
    createdAt: review.created_at
  }));

  renderDetailReviews();
}

async function submitDetailReviewToSupabase(review){

  const user =
    await getCurrentUser?.();

  const { error } = await supabase
    .from("heriland_reviews")
    .insert({
      user_id: user?.id || null,
      target_slug: currentDetailSlug,
      target_type: currentDetailType,
      rating: review.rating,
      comment: review.comment,
      image_urls: [],
      status: "published"
    });

  if (error) {
    console.error("submit review failed:", error);
    alert("Review submit failed.");
    return false;
  }

  return true;
}

window.addPlaceToTrip = async function () {
  const loggedIn = await requireLogin("add places to your trip");
  if (!loggedIn) return;
  
  if (!currentOpenedItem) return;

  addToTrip(currentOpenedItem);
  updateAvatarStats();

  document
    .getElementById("detailMoreLayer")
    ?.classList.remove("is-open");

  alert("Added to My Trip");
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

function setupDetailSlider(total) {
  const slider = document.getElementById("detailSlider");
  const dots = document.querySelectorAll(".detail-dot");

  if (!slider || !total) return;

  currentDetailSlide = 0;

  function updateSlider(index) {
    currentDetailSlide = Math.max(0, Math.min(index, total - 1));

    slider.style.transition =
      "transform .35s cubic-bezier(.22,.9,.28,1)";

    slider.style.transform =
      `translateX(-${currentDetailSlide * 100}%)`;

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle(
        "active",
        dotIndex === currentDetailSlide
      );
    });
  }

  dots.forEach((dot, index) => {
    dot.onclick = () => {
      updateSlider(index);
    };
  });

  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  slider.ontouchstart = (event) => {
    startX = event.touches[0].clientX;
    currentX = startX;
    isDragging = true;

    slider.style.transition = "none";
  };

  slider.ontouchmove = (event) => {
    if (!isDragging) return;

    currentX = event.touches[0].clientX;

    const diffX = currentX - startX;

    slider.style.transform =
      `translateX(calc(-${currentDetailSlide * 100}% + ${diffX}px))`;
  };

  slider.ontouchend = () => {
    if (!isDragging) return;

    isDragging = false;

    const diffX = currentX - startX;

    if (diffX < -60) {
      updateSlider(currentDetailSlide + 1);
      return;
    }

    if (diffX > 60) {
      updateSlider(currentDetailSlide - 1);
      return;
    }

    updateSlider(currentDetailSlide);
  };

  updateSlider(0);
}
