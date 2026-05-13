import {
  saveItem,
  removeItem,
  isSaved
} from "./storage.js";

let currentTraveler = null;

export function initTravelerDetail() {
  bindTravelerMoreMenu();

  window.openTravelerDetail = openTravelerDetail;
  window.closeTravelerDetail = closeTravelerDetail;
}

export function openTravelerDetail(review) {
  const detail =
    document.getElementById("travelerDetailPage");

  if (!detail) return;

  const normalized = {
    ...review,

    id:
      review.id ||
      review.name ||
      review.title ||
      "traveler-story",

    name:
      review.name ||
      review.author ||
      "HeriLand Traveler",

    image:
      review.image || "",

    images:
      review.images ||
      [
        review.image,
        review.image2,
        review.image3,
        review.image4
      ].filter(Boolean),

    achievement:
      review.achievement ||
      `Explored ${review.cityCount || 12} Cities ・ ${review.storyCount || 28} Stories`,

    title:
      review.title ||
      "A Journey Taken Slowly",

    story:
      review.story ||
      review.description ||
      review.desc ||
      "This journey was never about rushing through attractions, but about feeling the rhythm of the city.",

    tags:
      review.tags ||
      [
        "SlowTravel",
        "Sarawak",
        "RiverWalk"
      ]
  };

  currentTraveler = normalized;

  renderTravelerSlider(
    normalized.images,
    normalized.name
  );

  setText(
    "travelerDetailName",
    normalized.name
  );

  setText(
    "travelerDetailAchievement",
    normalized.achievement
  );

  setText(
    "travelerDetailTitle",
    normalized.title
  );

  setText(
    "travelerDetailStory",
    normalized.story
  );

  const tagWrap =
    document.getElementById("travelerDetailTags");

  if (tagWrap) {
    tagWrap.innerHTML =
      normalized.tags
        .slice(0, 6)
        .map(tag => {
          const cleanTag =
            String(tag).replace(/^#/, "");

          return `<span>#${cleanTag}</span>`;
        })
        .join("");
  }

  bindTravelerSaveButton(normalized);

  detail.classList.add("show");

  document.documentElement.classList.add("modal-lock");
  document.body.classList.add("modal-lock");
}

export function closeTravelerDetail() {
  const detail =
    document.getElementById("travelerDetailPage");

  if (!detail) return;

  detail.classList.remove("show");

  closeTravelerMoreMenu();

  document.documentElement.classList.remove("modal-lock");
  document.body.classList.remove("modal-lock");
}

function renderTravelerSlider(images, altText) {
  const slider =
    document.getElementById("travelerDetailSlider");

  const dots =
    document.getElementById("travelerDetailDots");

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

    slide.className =
      "traveler-detail-slide";

    slide.innerHTML = `
      <img src="${src}" alt="${altText}">
    `;

    slider.appendChild(slide);

    const dot =
      document.createElement("button");

    dot.className =
      `traveler-dot ${index === 0 ? "active" : ""}`;

    dot.type = "button";

    dot.addEventListener("click", () => {
      slider.scrollTo({
        left: slider.clientWidth * index,
        behavior: "smooth"
      });
    });

    dots.appendChild(dot);
  });

  slider.onscroll = () => {
    const current =
      Math.round(
        slider.scrollLeft /
        slider.clientWidth
      );

    dots
      .querySelectorAll(".traveler-dot")
      .forEach((dot, i) => {
        dot.classList.toggle(
          "active",
          i === current
        );
      });
  };
}

function bindTravelerSaveButton(traveler) {

  const saveBtn =
    document.getElementById("travelerDetailSaveBtn");

  if (!saveBtn) return;

  updateTravelerSaveButton(
    saveBtn,
    traveler.id
  );

  saveBtn.onclick = () => {

    if (isSaved("stories", traveler.id)) {

      removeItem(
        "stories",
        traveler.id
      );

    }

    else {

      saveItem(
        "stories",
        traveler
      );

    }

    updateTravelerSaveButton(
      saveBtn,
      traveler.id
    );

  };
}

function updateTravelerSaveButton(button, id) {

  const saved =
    isSaved("stories", id);

  button.textContent =
    saved ? "♥" : "♡";

  button.classList.toggle(
    "active",
    saved
  );
}

function bindTravelerMoreMenu() {
  const moreBtn =
    document.getElementById("travelerDetailMoreBtn");

  const layer =
    document.getElementById("travelerMoreLayer");

  const backdrop =
    document.getElementById("travelerMoreBackdrop");

  if (!moreBtn || !layer) return;

  if (layer.parentElement !== document.body) {
    document.body.appendChild(layer);
  }

  moreBtn.addEventListener("click", e => {
    e.stopPropagation();

    layer.classList.add("show");

    document.documentElement.classList.add("modal-lock");
    document.body.classList.add("modal-lock");
  });

  backdrop?.addEventListener(
    "click",
    closeTravelerMoreMenu
  );
}

function closeTravelerMoreMenu() {
  const layer =
    document.getElementById("travelerMoreLayer");

  layer?.classList.remove("show");

  const detail =
    document.getElementById("travelerDetailPage");

  if (!detail?.classList.contains("show")) {
    document.documentElement.classList.remove("modal-lock");
    document.body.classList.remove("modal-lock");
  }
}

window.saveTravelerStory = function() {

  if (!currentTraveler) return;

  saveItem(
    "stories",
    currentTraveler
  );

  closeTravelerMoreMenu();

  alert("Story saved");
};

window.saveTravelerRoute = function() {

  if (!currentTraveler) return;

  saveItem(
    "trip",
    currentTraveler
  );

  closeTravelerMoreMenu();

  alert("Route saved");
};

window.shareTravelerStory = async function() {
  if (!currentTraveler) return;

  const title =
    currentTraveler.title ||
    currentTraveler.name ||
    "HeriLand Traveler Story";

  const text =
    currentTraveler.story ||
    "Found this traveler story on HeriLand.";

  const url =
    window.location.href;

  if (navigator.share) {
    await navigator.share({
      title,
      text,
      url
    });
  }
  else {
    await navigator.clipboard.writeText(
      `${title}\n${url}`
    );

    alert("Link copied");
  }

  closeTravelerMoreMenu();
};

window.openTravelerMap = function() {
  if (!currentTraveler) return;

  const query =
    currentTraveler.area ||
    currentTraveler.place ||
    currentTraveler.name ||
    "Sarawak";

  const url =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  window.open(url, "_blank");

  closeTravelerMoreMenu();
};

window.continueTravelerAiGuide = function() {
  closeTravelerMoreMenu();

  const fab =
    document.getElementById("aiGuideFab");

  setTimeout(() => {
    fab?.click();
  }, 120);
};

function setText(id, value) {
  const el =
    document.getElementById(id);

  if (el) {
    el.textContent = value || "";
  }
}