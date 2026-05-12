import { state } from "./state.js";
import { dom } from "./dom.js";

import {
  saveItem,
  removeItem,
  isSaved,
  addRecent
} from "./storage.js";

let currentDetailItem = null;

export function initDetail() {
  bindDetailMoreMenu();

  window.openDetail = openDetail;
  window.closeDetail = closeDetail;
}

export function openDetail(place) {
  if (!place) return;

  const detailPage =
    document.getElementById("detailPage");

  if (!detailPage) return;

  addRecent(place);

  const normalized = {
    ...place,
    name: place.name || place.title || "Untitled Place",
    image: place.image || "",
    address: place.address || place.location || place.meta || "Sarawak",
    phone: place.phone || "Not Available",
    hours: place.hours || "Check Before Visiting",
    contactName: place.contactName || "HeriLand Guide",
    contactImage: place.contactImage || place.image || "",
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
    score: place.score || "4.8",
    reviewCount: place.reviewCount || "128",
    tags:
      place.tags ||
      ["Slow Travel", "Photo Friendly", "Recommended"],
    services:
      place.services ||
      [
        "Good for photos and slow visits",
        "Can be added to your trip",
        "Navigation available"
      ]
  };

  currentDetailItem = normalized;

  setText("detailTitle", normalized.name);
  setText("detailAddress", normalized.address);
  setText("detailPhone", normalized.phone);
  setText("detailHours", normalized.hours);
  setText("detailContactName", normalized.contactName);
  setText("detailIntro", normalized.intro);
  setText("detailType", normalized.type);
  setText("detailArea", normalized.area);
  setText("detailScore", normalized.score);
  setText("detailReviewCount", `${normalized.reviewCount} Reviews`);
  setText("detailAiNote", normalized.intro);

  renderDetailSlider(
    normalized.images || [normalized.image].filter(Boolean),
    normalized.name
  );

  const serviceList =
    document.getElementById("detailServices");

  if (serviceList) {
    serviceList.innerHTML =
      normalized.services
        .map(service => `<li>${service}</li>`)
        .join("");
  }

  const aiTags =
    document.getElementById("detailAiTags");

  if (aiTags) {
    aiTags.innerHTML =
      normalized.tags
        .slice(0, 5)
        .map(tag => `<span>${tag}</span>`)
        .join("");
  }

  bindSaveButton(normalized);

  detailPage.classList.add("show");

  document.documentElement.classList.add("modal-lock");
  document.body.classList.add("modal-lock");
}

export function closeDetail() {
  const detailPage =
    document.getElementById("detailPage");

  if (!detailPage) return;

  detailPage.classList.remove("show");

  closeDetailMoreMenu();

  document.documentElement.classList.remove("modal-lock");
  document.body.classList.remove("modal-lock");
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

function bindSaveButton(place) {
  const detailSaveBtn =
    document.getElementById("detailSaveBtn");

  if (!detailSaveBtn) return;

  updateSaveButton(detailSaveBtn, place.id);

  detailSaveBtn.onclick = () => {
    if (isSaved("saved", place.id)) {
      removeItem("saved", place.id);
    }
    else {
      saveItem("saved", place);
    }

    updateSaveButton(detailSaveBtn, place.id);
    updateCardSaveButtons(place.id);
  };
}

function updateSaveButton(button, id) {
  const saved =
    isSaved("saved", id);

  button.textContent =
    saved ? "♥" : "♡";

  button.classList.toggle(
    "active",
    saved
  );
}

function updateCardSaveButtons(id) {
  document
    .querySelectorAll(".business-save-btn")
    .forEach(btn => {
      const onclick =
        btn.getAttribute("onclick") || "";

      if (!onclick.includes(id)) return;

      btn.textContent =
        isSaved("saved", id) ? "♥" : "♡";
    });
}

function bindDetailMoreMenu() {
  const moreBtn =
    document.getElementById("detailMoreBtn");

  const layer =
    document.getElementById("detailMoreLayer");

  const backdrop =
    document.getElementById("detailMoreBackdrop");

  if (!moreBtn || !layer) return;

  moreBtn.addEventListener("click", e => {
    e.stopPropagation();

    layer.classList.add("show");

    const detailPage =
      document.getElementById("detailPage");

    detailPage?.classList.add("sheet-open");

    document.documentElement.classList.add("modal-lock");
    document.body.classList.add("modal-lock");
  });

  backdrop?.addEventListener("click", () => {
    closeDetailMoreMenu();
  });
}

function closeDetailMoreMenu() {
  const layer =
    document.getElementById("detailMoreLayer");

  const detailPage =
    document.getElementById("detailPage");

  layer?.classList.remove("show");
  detailPage?.classList.remove("sheet-open");
}

window.addPlaceToTrip = function() {
  if (!currentDetailItem) return;

  saveItem("trip", currentDetailItem);

  closeDetailMoreMenu();

  alert("Added to My Trip");
};

window.openPlaceMap = function() {
  if (!currentDetailItem) return;

  const query =
    currentDetailItem.address ||
    currentDetailItem.name ||
    currentDetailItem.title ||
    "Sarawak";

  const url =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  window.open(url, "_blank");

  closeDetailMoreMenu();
};

window.sharePlace = async function() {
  if (!currentDetailItem) return;

  const title =
    currentDetailItem.name ||
    currentDetailItem.title ||
    "HeriLand Place";

  const text =
    currentDetailItem.intro ||
    currentDetailItem.desc ||
    "Found this place on HeriLand.";

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

  closeDetailMoreMenu();
};

window.showNearbyPlaces = function() {
  closeDetailMoreMenu();

  alert("Nearby Places is coming soon");
};

window.continueWithAiGuide = function() {
  closeDetailMoreMenu();

  const fab =
    document.getElementById("aiGuideFab");

  setTimeout(() => {
    if (fab) {
      fab.click();
    }
  }, 120);
};

function setText(id, value) {
  const el =
    document.getElementById(id);

  if (el) {
    el.textContent = value || "";
  }
}