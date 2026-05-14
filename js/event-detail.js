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

  const normalized =
    normalizeEventDetail(event);

  currentEventItem = normalized;

  renderEventDetailSlider(
    normalized.images,
    normalized.title
  );

  setText("eventDetailTitle", normalized.title);
  setText("eventDetailType", normalized.type);
  setText("eventDetailLocation", normalized.location);
  setText("eventDetailDate", normalized.date);
  setText("eventDetailTime", normalized.timeText);
  setText("eventDetailAiNote", normalized.summary);
  setText("eventDetailDesc", normalized.content || normalized.summary);

  setText("eventDetailVenue", normalized.venue);
  setText("eventDetailAddress", normalized.address);
  setText("eventDetailOrganizer", normalized.organizer);

  setText("eventDetailNearby", normalized.nearby);

  renderEventTags(normalized.tags);
  renderEventLinks(normalized);

  bindEventSaveButton(normalized);

  detail.classList.add("show");

  document.documentElement.classList.add("modal-lock");
  document.body.classList.add("modal-lock");
}

function normalizeEventDetail(event) {
  const images = [
    event.hero_image_url || event.image,
    ...(Array.isArray(event.gallery_urls)
      ? event.gallery_urls
      : []),
    ...(Array.isArray(event.images)
      ? event.images
      : [])
  ]
    .filter(Boolean)
    .filter((value, index, array) =>
      array.indexOf(value) === index
    );

  return {
    ...event,

    id:
      event.id ||
      event.slug ||
      event.title ||
      "event-detail",

    title:
      event.title ||
      "Untitled Event",

    type:
      "Event",

    image:
      event.hero_image_url ||
      event.image ||
      "",

    images,

    city:
      event.city ||
      "Sarawak",

    area:
      event.area ||
      "",

    venue:
      event.venue_name ||
      event.location ||
      "Venue TBC",

    address:
      event.address ||
      event.venue_name ||
      event.location ||
      "Address TBC",

    location:
      event.venue_name ||
      event.address ||
      event.city ||
      "Sarawak",

    date:
      formatEventDateRange(
        event.start_date || event.start,
        event.end_date || event.end
      ) || event.date || "Upcoming",

    timeText:
      formatEventTimeRange(
        event.start_date || event.start,
        event.end_date || event.end
      ) || event.timeText || "Time TBC",

    summary:
      event.summary ||
      event.desc ||
      event.description ||
      "An event worth exploring slowly.",

    content:
      event.content ||
      event.description ||
      event.summary ||
      "",

    organizer:
      event.organizer ||
      "HeriLand",

    ticketUrl:
      event.ticket_url ||
      event.ticketUrl ||
      "",

    mapUrl:
      event.google_map_url ||
      event.mapUrl ||
      "",

    tags:
      Array.isArray(event.tags) && event.tags.length
        ? event.tags
        : ["Event", "Local Experience"],

    nearby:
      event.nearby ||
      "Explore nearby restaurants, river walks, or local places around this event."
  };
}

function renderEventLinks(event) {
  const ticketLink =
    document.getElementById("eventTicketLink");

  const mapLink =
    document.getElementById("eventMapLink");

  if (ticketLink) {
    if (event.ticketUrl) {
      ticketLink.href = event.ticketUrl;
      ticketLink.style.display = "inline-flex";
    }
    else {
      ticketLink.style.display = "none";
    }
  }

  if (mapLink) {
    const mapUrl =
      event.mapUrl ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        event.address || event.venue || event.title || "Sarawak"
      )}`;

    mapLink.href = mapUrl;
    mapLink.style.display = "inline-flex";
  }
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

function renderEventTags(tags) {
  const tagWrap =
    document.getElementById("eventDetailTags");

  if (!tagWrap) return;

  tagWrap.innerHTML =
    (Array.isArray(tags) ? tags : [])
      .slice(0, 5)
      .map(tag => `<span>${escapeHtml(tag)}</span>`)
      .join("");
}

function renderEventDetailSlider(images, altText) {
  const slider =
    document.getElementById("eventDetailSlider");

  const dots =
    document.getElementById("eventDetailDots");

  if (!slider || !dots) return;

  const fallback =
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

  const list =
    images && images.length
      ? images
      : [fallback];

  slider.innerHTML = "";
  dots.innerHTML = "";

  list.forEach((src, index) => {
    const slide =
      document.createElement("div");

    slide.className =
      "event-detail-slide";

    slide.innerHTML = `
      <img src="${escapeHtml(src)}" alt="${escapeHtml(altText)}">
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

  if (detail?.classList.contains("show")) {
    document.documentElement.classList.add("modal-lock");
    document.body.classList.add("modal-lock");
  }
}

window.addEventToTrip = function() {
  if (!currentEventItem) return;

  saveItem("trip", currentEventItem);

  closeEventMoreMenu();

  alert("Added to My Trip");
};

window.openEventMap = function() {
  if (!currentEventItem) return;

  const url =
    currentEventItem.mapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      currentEventItem.address ||
      currentEventItem.venue ||
      currentEventItem.title ||
      "Sarawak"
    )}`;

  window.open(url, "_blank");

  closeEventMoreMenu();
};

window.shareEvent = async function() {
  if (!currentEventItem) return;

  const title =
    currentEventItem.title ||
    "HeriLand Event";

  const text =
    currentEventItem.summary ||
    currentEventItem.content ||
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

function formatEventDateRange(start, end) {
  const startText =
    formatDateOnly(start);

  const endText =
    formatDateOnly(end);

  if (
    startText &&
    endText &&
    startText !== endText
  ) {
    return `${startText} - ${endText}`;
  }

  return startText || endText || "";
}

function formatEventTimeRange(start, end) {
  const startText =
    formatTimeOnly(start);

  const endText =
    formatTimeOnly(end);

  if (startText && endText) {
    return `${startText} - ${endText}`;
  }

  return startText || endText || "";
}

function formatDateOnly(value) {
  if (!value) return "";

  const date =
    new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function formatTimeOnly(value) {
  if (!value) return "";

  const date =
    new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function setText(id, value) {
  const el =
    document.getElementById(id);

  if (el) {
    el.textContent = value || "";
  }
}

function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
