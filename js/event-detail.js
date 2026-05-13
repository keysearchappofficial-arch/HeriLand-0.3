import {
  saveItem,
  removeItem,
  isSaved
} from "./storage.js";

let currentEventItem = null;

export function initEventDetail() {
  bindEventMoreMenu();

  window.openEventDetail = openEventDetail;
  window.closeEventDetail = closeEventDetail;
}

export function openEventDetail(event) {
  const detail =
    document.getElementById("eventDetailPage");

  if (!detail || !event) return;

  const normalized = {
    ...event,

    id:
      event.id ||
      event.title ||
      "event-detail",

    title:
      event.title ||
      "Untitled Event",

    image:
      event.image || "",

    images:
      event.images ||
      [
        event.image,
        event.image2,
        event.image3,
        event.image4
      ].filter(Boolean),

    location:
      event.location ||
      "Sarawak",

    date:
      event.date ||
      event.day ||
      "Upcoming Event",

    timeText:
      event.timeText ||
      event.hour ||
      "",

    desc:
      event.desc ||
      "An event worth exploring slowly.",

    type:
      event.type ||
      "Event",

    aiNote:
      event.aiNote ||
      event.guide ||
      "Perfect for anyone who wants to experience the city atmosphere slowly.",

    tags:
      event.tags ||
      [
        "Relaxing",
        "Local Vibes",
        "Photo Friendly"
      ],

    nearby:
      event.nearby ||
      "Explore nearby restaurants, river walks, or night markets."
  };

  currentEventItem = normalized;

  renderEventDetailSlider(
    normalized.images || [normalized.image].filter(Boolean),
    normalized.title
  );

  setText("eventDetailTitle", normalized.title);
  setText("eventDetailType", normalized.type);
  setText("eventDetailLocation", normalized.location);
  setText("eventDetailDate", normalized.date);
  setText("eventDetailTime", normalized.timeText || normalized.location);
  setText("eventDetailDesc", normalized.desc);
  setText("eventDetailAiNote", normalized.aiNote);
  setText("eventDetailNearby", normalized.nearby);

  const tags =
    document.getElementById("eventDetailTags");

  if (tags) {
    tags.innerHTML =
      normalized.tags
        .slice(0, 5)
        .map(tag => `<span>${tag}</span>`)
        .join("");
  }

  bindEventSaveButton(normalized);

  detail.classList.add("show");

  document.documentElement.classList.add("modal-lock");
  document.body.classList.add("modal-lock");
}

export function closeEventDetail() {
  const detail =
    document.getElementById("eventDetailPage");

  if (!detail) return;

  detail.classList.remove("show");

  closeEventMoreMenu();

  document.documentElement.classList.remove("modal-lock");
  document.body.classList.remove("modal-lock");
}

function renderEventDetailSlider(images, altText) {
  const slider =
    document.getElementById("eventDetailSlider");

  const dots =
    document.getElementById("eventDetailDots");

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
      "event-detail-slide";

    slide.innerHTML = `
      <img src="${src}" alt="${altText}">
    `;

    slider.appendChild(slide);

    const dot =
      document.createElement("button");

    dot.className =
      `event-dot ${index === 0 ? "active" : ""}`;

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
      .querySelectorAll(".event-dot")
      .forEach((dot, i) => {
        dot.classList.toggle(
          "active",
          i === current
        );
      });
  };
}

function bindEventSaveButton(event) {
  const saveBtn =
    document.getElementById("eventDetailSaveBtn");

  if (!saveBtn) return;

  updateEventSaveButton(saveBtn, event.id);

  saveBtn.onclick = () => {
    if (isSaved("savedEvents", event.id)) {
      removeItem("savedEvents", event.id);
    }
    else {
      saveItem("savedEvents", event);
    }

    updateEventSaveButton(saveBtn, event.id);
  };
}

function updateEventSaveButton(button, id) {
  const saved =
    isSaved("savedEvents", id);

  button.textContent =
    saved ? "♥" : "♡";

  button.classList.toggle(
    "active",
    saved
  );
}

function bindEventMoreMenu() {
  const moreBtn =
    document.getElementById("eventDetailMoreBtn");

  const layer =
    document.getElementById("eventMoreLayer");

  const backdrop =
    document.getElementById("eventMoreBackdrop");

  if (!moreBtn || !layer) return;

  if (layer.parentElement !== document.body) {
    document.body.appendChild(layer);
  }

  moreBtn.addEventListener("click", e => {
    e.stopPropagation();

    layer.classList.add("show");

    const detail =
      document.getElementById("eventDetailPage");

    detail?.classList.add("sheet-open");

    document.documentElement.classList.add("modal-lock");
    document.body.classList.add("modal-lock");
  });

  backdrop?.addEventListener(
    "click",
    closeEventMoreMenu
  );
}

function closeEventMoreMenu() {
  const layer =
    document.getElementById("eventMoreLayer");

  const detail =
    document.getElementById("eventDetailPage");

  layer?.classList.remove("show");
  detail?.classList.remove("sheet-open");
}

window.addEventToTrip = function() {
  if (!currentEventItem) return;

  saveItem("trip", currentEventItem);

  closeEventMoreMenu();

  alert("Added to My Trip");
};

window.openEventMap = function() {
  if (!currentEventItem) return;

  const query =
    currentEventItem.location ||
    currentEventItem.title ||
    "Sarawak";

  const url =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  window.open(url, "_blank");

  closeEventMoreMenu();
};

window.shareEvent = async function() {
  if (!currentEventItem) return;

  const title =
    currentEventItem.title ||
    "HeriLand Event";

  const text =
    currentEventItem.desc ||
    "Found this event on HeriLand.";

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

  closeEventMoreMenu();
};

window.saveEventReminder = function() {
  if (!currentEventItem) return;

  saveItem("eventReminders", currentEventItem);

  closeEventMoreMenu();

  alert("Reminder saved");
};

window.continueEventAiGuide = function() {
  closeEventMoreMenu();

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
