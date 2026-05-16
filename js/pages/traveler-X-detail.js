const travelerDetailPage =
  document.getElementById("travelerDetailPage");

/* =========================
   Open
========================= */

window.openTravelerDetail = async function (slug) {

  if (!travelerDetailPage) return;

  travelerDetailPage.classList.add("is-open");

  document.body.classList.add("no-scroll");

  await loadTravelerDetail(slug);

  syncTravelerSaveButton();

};

/* =========================
   Close
========================= */

window.closeTravelerDetail = function () {

  travelerDetailPage.classList.remove("is-open");

  document.body.classList.remove("no-scroll");

};

/* =========================
   Helpers
========================= */

function normalizeTravelerTags(tags){
  if (Array.isArray(tags)) return tags;

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map(tag => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function formatTravelerLocation(data){
  return `${data.city || "Sarawak"}${data.area ? " · " + data.area : ""}`;
}

/* =========================
   Load
========================= */

async function loadTravelerDetail(slug){

  const { data, error } = await supabase
    .from("heriland_traveler_stories")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("load traveler detail failed:", error);

    renderTravelerDetail({
      kicker: "Traveler Experience",
      name: "Experience not found",
      achievement: "Sarawak ・ Shared by traveler",
      guide: "This traveler experience may not be available yet.",
      title: "Experience not found",
      story: "",
      tags: [],
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

  renderTravelerDetail({
    kicker:
      "Traveler Experience",

    name:
      data.title || "Traveler Experience",

    achievement:
      `${formatTravelerLocation(data)} ・ Travel Tip`,

    guide:
      data.short_description ||
      data.why_recommend ||
      "A slower way to experience Sarawak.",

    title:
      data.title || "Traveler Experience",

    story:
      data.story ||
      data.why_recommend ||
      data.short_description ||
      "No traveler experience yet.",

    tags:
      normalizeTravelerTags(data.tags),

    images
  });

}

/* =========================
   Render
========================= */

function renderTravelerDetail(data) {

  const kicker =
    document.getElementById("travelerDetailKicker");

  const name =
    document.getElementById("travelerDetailName");

  const achievement =
    document.getElementById("travelerDetailAchievement");

  const guide =
    document.getElementById("travelerDetailGuide");

  const title =
    document.getElementById("travelerDetailTitle");

  const story =
    document.getElementById("travelerDetailStory");

  if (kicker) {
    kicker.textContent =
      data.kicker || "Traveler Experience";
  }

  if (name) {
    name.textContent =
      data.name || "Traveler Experience";
  }

  if (achievement) {
    achievement.textContent =
      data.achievement || "Sarawak ・ Shared by traveler";
  }

  if (guide) {
    guide.textContent =
      data.guide || "";
  }

  if (title) {
    title.textContent =
      data.title || "";
  }

  if (story) {
    story.textContent =
      data.story || "";
  }

  renderTravelerTags(data.tags || []);
  renderTravelerGallery(data.images || []);

}

/* =========================
   Gallery
========================= */

function renderTravelerGallery(images) {

  const fallbackImages = [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"
  ];

  images =
    images && images.length
      ? images
      : fallbackImages;

  const slider =
    document.getElementById("travelerDetailSlider");

  const dots =
    document.getElementById("travelerDetailDots");

  if (!slider || !dots) return;

  slider.innerHTML =
    images.map((image) => {

      return `
        <div class="traveler-detail-slide">
          <img src="${image}" alt="">
        </div>
      `;

    }).join("");

  dots.innerHTML =
    images.map((_, index) => {

      return `
        <div class="
          traveler-detail-dot
          ${index === 0 ? "active" : ""}
        "></div>
      `;

    }).join("");

  setupTravelerSlider(images.length);
}

/* =========================
   Tags
========================= */

function renderTravelerTags(tags) {

  const el =
    document.getElementById("travelerDetailTags");

  if (!el) return;

  el.innerHTML =
    tags.map(tag => {

      const label =
        String(tag).startsWith("#")
          ? tag
          : `#${tag}`;

      return `<span>${label}</span>`;

    }).join("");
}

/* =========================
   Save
========================= */

function syncTravelerSaveButton(){
  const saveBtn =
    document.getElementById("travelerDetailSaveBtn");

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
  .getElementById("travelerDetailSaveBtn")
  ?.addEventListener("click", async () => {

    const item =
      window.currentOpenedItem;

    if (!item) return;

    const ok =
      await toggleSaved(item);

    if (!ok) return;

    updateAvatarStats();
    renderCards();
    syncTravelerSaveButton();

  });

/* =========================
   More
========================= */

document
  .getElementById("travelerDetailMoreBtn")
  ?.addEventListener("click", () => {

    document
      .getElementById("travelerMoreLayer")
      ?.classList.add("is-open");
  });

document
  .getElementById("travelerMoreBackdrop")
  ?.addEventListener("click", () => {

    document
      .getElementById("travelerMoreLayer")
      ?.classList.remove("is-open");
  });

/* =========================
   Placeholder Actions
========================= */

window.saveTravelerStory = async function () {
  const item = window.currentOpenedItem;

  if (!item) return;

  const ok =
    await toggleSaved(item);

  if (!ok) return;

  updateAvatarStats();
  renderCards();
  syncTravelerSaveButton();

  document
    .getElementById("travelerMoreLayer")
    ?.classList.remove("is-open");
};

window.saveTravelerRoute = function () {
  const item = window.currentOpenedItem;

  if (!item) return;

  addToTrip(item);
  updateAvatarStats();

  document
    .getElementById("travelerMoreLayer")
    ?.classList.remove("is-open");

  alert("Added to My Trip");
};

window.shareTravelerStory = function () {
  console.log("share traveler story");
};

window.openTravelerMap = function () {
  console.log("open traveler map");
};

window.continueTravelerAiGuide = function () {
  console.log("continue traveler ai guide");
};

/* =========================
   Slider
========================= */

let currentTravelerSlide = 0;
let travelerSliderReady = false;

function setupTravelerSlider(total) {
  const slider = document.getElementById("travelerDetailSlider");
  const dots = document.querySelectorAll(".traveler-detail-dot");

  if (!slider || !total) return;

  currentTravelerSlide = 0;
  travelerSliderReady = false;

  function updateSlider(index) {
    currentTravelerSlide = Math.max(0, Math.min(index, total - 1));

    slider.style.transition =
      "transform .35s cubic-bezier(.22,.9,.28,1)";

    slider.style.transform =
      `translateX(-${currentTravelerSlide * 100}%)`;

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle(
        "active",
        dotIndex === currentTravelerSlide
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
      `translateX(calc(-${currentTravelerSlide * 100}% + ${diffX}px))`;
  };

  slider.ontouchend = () => {
    if (!isDragging) return;

    isDragging = false;

    const diffX = currentX - startX;

    if (diffX < -60) {
      updateSlider(currentTravelerSlide + 1);
      return;
    }

    if (diffX > 60) {
      updateSlider(currentTravelerSlide - 1);
      return;
    }

    updateSlider(currentTravelerSlide);
  };

  updateSlider(0);
}