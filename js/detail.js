import { supabase } from "./supabase-client.js";

import {
  saveItem,
  removeItem,
  isSaved,
  addRecent
} from "./storage.js";

let currentDetailItem = null;
let selectedReviewRating = 5;

export function initDetail() {

  bindDetailMoreMenu();
  bindReviewSheet();
  bindReviewMore();

  window.openDetail = openDetail;
  window.closeDetail = closeDetail;
}

export async function openDetail(place) {
  if (!place) return;

  const detailPage =
    document.getElementById("detailPage");

  if (!detailPage) return;

  addRecent(place);

  const normalized = {
    ...place,
    name: place.name || place.title || "Untitled Place",
    image:
      place.image ||
      place.card_image_url ||
      place.hero_image_url ||
      "",
    address: place.address || place.location || place.meta || "Sarawak",
    phone: place.phone || "Not Available",
    hours: "Check Before Visiting",
    hoursData:place.hoursData || [],
    contactName: place.contactName || "HeriLand Guide",
    short_description:
      place.short_description || "",
    
    description:
      place.description ||
      place.full_description ||
      "",
    
    aiNote:
      place.aiNote ||
      place.short_description ||
      place.full_description ||
      "",
    
    reviews:
      Array.isArray(place.reviews)
        ? place.reviews
        : [],
    contactImage: place.contactImage || place.image || "",
images: [

  place.hero_image_url ||

  place.image ||

  place.card_image_url,

  ...(Array.isArray(place.gallery_urls)
    ? place.gallery_urls
    : []),

  ...(place.images || [])

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
      Number(place.score || 0)
        .toFixed(1),
    
reviewCount:
  Number(
    place.reviewCount ||
    place.review_count ||
    0
  ),
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
  window.currentDetailItem = normalized;

  setText("detailTitle", normalized.name);
  setText("detailAddress", normalized.address);
  setText("detailPhone", normalized.phone);
setText(
  "detailHours",
  getPrimaryHoursText(normalized)
);

renderWeeklyHours(normalized.hoursData);
  setText("detailContactName", normalized.contactName);
  setText("detailIntro", normalized.intro);
  setText("detailType", normalized.type);
  setText("detailArea", normalized.area);
  setText("detailScore", normalized.score);
  setText(
    "detailReviewCount",
    Number(normalized.reviewCount) > 0
      ? `${normalized.reviewCount} Reviews`
      : "No Reviews Yet"
  );
setText(
  "reviewListTitle",

  Number(normalized.reviewCount) > 0
    ? `${normalized.score} · ${normalized.reviewCount} Reviews`
    : "0.0 · No Reviews Yet"
);
  setText(
    "detailAiNote",
  
    normalized.aiNote ||
    normalized.short_description ||
    normalized.intro ||
    normalized.description ||
    "A place worth slowing down for."
  );

  renderDetailSlider(
    normalized.images || [normalized.image].filter(Boolean),
    normalized.name
  );

const serviceList =
  document.getElementById("detailServices");

if (serviceList) {
  const featureList =
    normalized.services?.length
      ? normalized.services
      : normalized.tags;

  serviceList.innerHTML =
    featureList
      .slice(0, 8)
      .map(service => `<li>${escapeHtml(service)}</li>`)
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

const detailReviewList =
  document.getElementById("detailReviewList");

if (detailReviewList) {
  detailReviewList.innerHTML = "";
} 

  bindSaveButton(normalized);

await reloadReviews();

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

const reviewSheet =
  document.getElementById("reviewSheetLayer");

const reviewList =
  document.getElementById("reviewListLayer");

const moreSheet =
  document.getElementById("detailMoreLayer");

const stillLocked =
  reviewSheet?.classList.contains("show") ||
  reviewList?.classList.contains("show") ||
  moreSheet?.classList.contains("show");

if (!stillLocked) {

  document.documentElement.classList.remove("modal-lock");
  document.body.classList.remove("modal-lock");

}
}

function getPrimaryHoursText(place) {

  if (
    place.hoursData &&
    Array.isArray(place.hoursData)
  ) {
    const today =
      getTodayOpeningHours(place.hoursData);

    if (today) return today;
  }

  return place.hours || "Check Before Visiting";
}

function getTodayOpeningHours(hoursData) {

  const dayKeys = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ];

  const todayKey =
    dayKeys[new Date().getDay()];

  const today =
    hoursData.find(item =>
      item.key === todayKey
    );

  if (!today) return "";

  if (today.closed) {
    return `${today.key} Closed`;
  }

  if (today.open && today.close) {
    return `${today.key} ${today.open}-${today.close}`;
  }

  return "";
}

function renderWeeklyHours(hoursData) {

  const wrap =
    document.getElementById("detailWeekHours");

  if (!wrap) return;

  if (
    !hoursData ||
    !Array.isArray(hoursData) ||
    !hoursData.length
  ) {
    wrap.innerHTML = "";
    return;
  }

  const rows =
    hoursData
      .filter(day =>
        day.closed ||
        day.open ||
        day.close
      )
      .map(day => {
        const timeText =
          day.closed
            ? "Closed"
            : `${day.open || "--:--"} - ${day.close || "--:--"}`;

        return `
          <div class="detail-week-row">
            <span>${day.label || day.key}</span>
            <strong>${timeText}</strong>
          </div>
        `;
      })
      .join("");

  if (!rows) {
    wrap.innerHTML = "";
    return;
  }

  wrap.innerHTML = `
    <button
      class="detail-week-toggle"
      type="button"
      id="detailWeekToggle">
      View weekly hours
    </button>

    <div
      class="detail-week-panel"
      id="detailWeekPanel">
      ${rows}
    </div>
  `;

  const toggle =
    document.getElementById("detailWeekToggle");

  const panel =
    document.getElementById("detailWeekPanel");

  toggle?.addEventListener("click", () => {
    panel?.classList.toggle("show");

    toggle.textContent =
      panel?.classList.contains("show")
        ? "Hide weekly hours"
        : "View weekly hours";
  });
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

function bindReviewSheet() {
  const openBtn =
    document.getElementById("detailWriteReviewBtn");

  const layer =
    document.getElementById("reviewSheetLayer");

  const backdrop =
    document.getElementById("reviewSheetBackdrop");

  const closeBtn =
    document.getElementById("reviewSheetClose");

  const submitBtn =
    document.getElementById("reviewSubmitBtn");

  const ratingButtons =
    document.querySelectorAll("#reviewRating button");
    
const imageInput =
  document.getElementById("reviewImageInput");

const imagePreview =
  document.getElementById("reviewUploadPreview");

  if (!openBtn || !layer) return;

  /* 關鍵：把 sheet 移到 body，避免被 detailPage scroll 影響 */
  if (layer.parentElement !== document.body) {
    document.body.appendChild(layer);
  }

  openBtn.addEventListener("click", () => {
    selectedReviewRating = 5;

    updateReviewStars();

    layer.classList.add("show");

    const detailPage =
      document.getElementById("detailPage");

    detailPage?.classList.add("sheet-open");

    document.documentElement.classList.add("modal-lock");
    document.body.classList.add("modal-lock");
  });

  backdrop?.addEventListener("click", closeReviewSheet);
  closeBtn?.addEventListener("click", closeReviewSheet);

  ratingButtons.forEach(button => {
    button.addEventListener("click", () => {
      selectedReviewRating =
        Number(button.dataset.rate) || 5;

      updateReviewStars();
    });
  });
  
imageInput?.addEventListener("change", () => {
  if (!imagePreview) return;

  imagePreview.innerHTML = "";

  [...imageInput.files].forEach(file => {
    const reader =
      new FileReader();

    reader.onload = e => {
      const img =
        document.createElement("img");

      img.src = e.target.result;

      imagePreview.appendChild(img);
    };

    reader.readAsDataURL(file);
  });
});

  submitBtn?.addEventListener("click", submitReview);
}

function closeReviewSheet() {

  const layer =
    document.getElementById("reviewSheetLayer");

  const detailPage =
    document.getElementById("detailPage");

  const moreSheet =
    document.getElementById("detailMoreLayer");

  const reviewList =
    document.getElementById("reviewListLayer");

  if (!layer) return;

  layer.classList.remove("show");

  detailPage?.classList.remove("sheet-open");

  const stillLocked =
    detailPage?.classList.contains("show") ||
    moreSheet?.classList.contains("show") ||
    reviewList?.classList.contains("show");

  if (!stillLocked) {

    document.documentElement.classList.remove("modal-lock");
    document.body.classList.remove("modal-lock");

  }
}

function updateReviewStars() {
  document
    .querySelectorAll("#reviewRating button")
    .forEach(button => {
      const rate =
        Number(button.dataset.rate);

      button.classList.toggle(
        "active",
        rate <= selectedReviewRating
      );
    });
}

async function submitReview() {
  const comment =
    document.getElementById("reviewComment");

  const list =
    document.getElementById("detailReviewList");

  if (!comment || !list) return;

  const text =
    comment.value.trim();

  if (!text) {
    alert("Please write a short comment.");
    return;
  }

const { error } =
  await supabase
    .from("reviews")
    .insert({
      place_id:
        currentDetailItem.id,

      reviewer_name:
        "Guest Traveler",

      rating:
        Number(selectedReviewRating),

      comment:
        text,

      status:
        "published"
    });

if (error) {

  console.error(error);

  alert("Failed to submit review");

  return;

}

await reloadReviews();

closeReviewSheet();
  
comment.value = "";

if (imagePreview) {
  imagePreview.innerHTML = "";
}

const imageInput =
  document.getElementById("reviewImageInput");

if (imageInput) {
  imageInput.value = "";
}

  alert("Thanks for sharing your experience.");
}

async function reloadReviews() {

  if (!currentDetailItem?.id) {
    return;
  }

  const {
    data,
    error
  } = await supabase
    .from("reviews")
    .select("*")
    .eq(
      "place_id",
      currentDetailItem.id
    )
    .eq(
      "status",
      "published"
    )
    .order(
      "created_at",
      {
        ascending: false
      }
    );

  if (error) {

    console.error(error);

    return;

  }

  const reviews =
    data || [];

  currentDetailItem.reviews =
    reviews;

  const total =
    reviews.reduce(
      (sum, review) =>
        sum + Number(review.rating || 0),
      0
    );

  const avg =
    reviews.length
      ? (total / reviews.length)
          .toFixed(1)
      : "0.0";

  currentDetailItem.score =
    avg;

  currentDetailItem.reviewCount =
    reviews.length;

  setText(
    "detailScore",
    avg
  );

  setText(
    "detailReviewCount",

    reviews.length
      ? `${reviews.length} Reviews`
      : "No Reviews Yet"
  );

  setText(
    "reviewListTitle",

    reviews.length
      ? `${avg} · ${reviews.length} Reviews`
      : "0.0 · No Reviews Yet"
  );

renderInlineReviews();
renderReviewList();

}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function bindReviewMore() {

  const moreBtn =
    document.querySelector(".detail-review-more");

  const layer =
    document.getElementById("reviewListLayer");

  const backdrop =
    document.getElementById("reviewListBackdrop");

  const closeBtn =
    document.getElementById("reviewListClose");

  if (!moreBtn || !layer) return;

  if (layer.parentElement !== document.body) {
    document.body.appendChild(layer);
  }

moreBtn.addEventListener("click", async () => {

  await reloadReviews();

  renderReviewList();

  layer.classList.add("show");

  document.documentElement.classList.add("modal-lock");
  document.body.classList.add("modal-lock");

});

  backdrop?.addEventListener(
    "click",
    closeReviewList
  );

  closeBtn?.addEventListener(
    "click",
    closeReviewList
  );
}

function closeReviewList() {

  const layer =
    document.getElementById("reviewListLayer");

  layer?.classList.remove("show");

  const reviewSheet =
    document.getElementById("reviewSheetLayer");

  const moreSheet =
    document.getElementById("detailMoreLayer");

  const detailPage =
    document.getElementById("detailPage");

  const stillLocked =
    detailPage?.classList.contains("show") ||
    reviewSheet?.classList.contains("show") ||
    moreSheet?.classList.contains("show");

  if (!stillLocked) {

    document.documentElement.classList.remove("modal-lock");
    document.body.classList.remove("modal-lock");

  }
}

function renderReviewList() {

  const content =
    document.getElementById("reviewListContent");

  if (!content) return;

  const reviews =
    currentDetailItem?.reviews || [];

  if (!reviews.length) {

    content.innerHTML = `
      <div class="review-empty">
        No traveler experiences yet.
      </div>
    `;

    return;
  }

  content.innerHTML =
    reviews.map(review => {

      const stars =
        Number(review.rating || 0);

const avatarId =
  (review.reviewer_name || "Traveler")
    .length % 60;

      const createdAt =
        review.created_at
          ? new Date(review.created_at)
              .toLocaleDateString("en-MY", {
                year: "numeric",
                month: "short",
                day: "numeric"
              })
          : "Recently";

      return `
        <article class="review-list-card">

          <div class="detail-review-user">

            <img
              src="https://i.pravatar.cc/120?img=${avatarId}"
              alt="${escapeHtml(review.reviewer_name || "Traveler")}"
            >

            <div>

              <strong>
                ${escapeHtml(review.reviewer_name || "Traveler")}
              </strong>

              <div class="detail-review-meta">

                <span class="review-stars">
                  ${"★".repeat(stars)}
                </span>

                <span class="review-time">
                  ${createdAt}
                </span>

              </div>

            </div>

          </div>

          <p>
            ${escapeHtml(review.comment || "")}
          </p>

          <div class="review-helpful">

            <button type="button">
              👍 Helpful
            </button>

            <span>
              ${review.helpful_count || 0}
            </span>

          </div>

        </article>
      `;

    }).join("");
}

function renderInlineReviews() {

  const list =
    document.getElementById("detailReviewList");

  if (!list) return;

  const reviews =
    currentDetailItem?.reviews || [];

  if (!reviews.length) {
    list.innerHTML = "";
    return;
  }

  list.innerHTML =
    reviews
      .slice(0, 4)
      .map(review => {

        const stars =
          Number(review.rating || 0);

        const createdAt =
          review.created_at
            ? new Date(review.created_at)
                .toLocaleDateString("en-MY", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })
            : "Recently";

        const avatarId =
          (review.reviewer_name || "Traveler")
            .length % 60;

        return `
          <article class="detail-review-card">

            <div class="detail-review-user">

              <img
                src="https://i.pravatar.cc/120?img=${avatarId}"
                alt="${escapeHtml(review.reviewer_name || "Traveler")}"
              >

              <div>
                <strong>
                  ${escapeHtml(review.reviewer_name || "Traveler")}
                </strong>

                <div class="detail-review-meta">
                  <span class="review-stars">
                    ${"★".repeat(stars)}
                  </span>

                  <span class="review-time">
                    ${createdAt}
                  </span>
                </div>
              </div>

            </div>

            <p>
              ${escapeHtml(review.comment || "")}
            </p>

          </article>
        `;
      })
      .join("");

}
