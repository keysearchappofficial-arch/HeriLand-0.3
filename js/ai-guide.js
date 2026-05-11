import {
  places,
  restaurants
} from "./data.js";

export function initAiGuide() {
  const host = document.getElementById("aiGuide");
  if (!host) return;

  const fab = host.querySelector("#aiGuideFab");
  const sheet = host.querySelector("#aiGuideSheet");

  if (fab) document.body.appendChild(fab);
  if (sheet) document.body.appendChild(sheet);

  const closeBtn = document.getElementById("aiGuideClose");
  const backdrop = document.getElementById("aiGuideBackdrop");
  const resultWrap = document.getElementById("aiGuideResults");
  const chips = document.querySelectorAll(".guide-chip-group button");
  const input = document.getElementById("aiGuideInput");
  const sendBtn = document.getElementById("aiGuideSend");

  function toggleGuide() {
    const isOpen = sheet.classList.contains("show");

    if (isOpen) {
      closeGuide();
      return;
    }

    sheet.classList.add("show");
    document.body.style.overflow = "hidden";

    renderGuide("restaurant");
  }

  function closeGuide() {
    sheet.classList.remove("show");
    document.body.style.overflow = "";
  }

  function renderGuide(type) {
    if (!resultWrap) return;

    chips.forEach(chip => {
      chip.classList.toggle(
        "active",
        chip.dataset.guide === type
      );
    });

    let items = [];

    if (type === "restaurant") {
      items = shuffleArray(restaurants).slice(0, 8);
    }
    else if (type === "view") {
      items = shuffleArray(
        places.filter(place => place.mood === "view")
      ).slice(0, 8);
    }
    else if (type === "relax") {
      items = shuffleArray(
        places.filter(place => place.mood === "relax")
      ).slice(0, 8);
    }
    else if (type === "culture") {
      items = shuffleArray(
        places.filter(place =>
          place.category === "culture" ||
          place.tags?.some(tag =>
            tag.toLowerCase().includes("culture") ||
            tag.includes("文化")
          )
        )
      ).slice(0, 8);
    }

    renderCards(items, "No recommendations yet.");
  }

  function searchGuide(keyword) {
    if (!keyword) return;

    clearChipActive();

    const lower = keyword.toLowerCase();

    const searchableItems = [
      ...places,
      ...restaurants
    ];

    const results = searchableItems.filter(item => {
      return (
        item.name?.toLowerCase().includes(lower) ||
        item.title?.toLowerCase().includes(lower) ||
        item.food?.toLowerCase().includes(lower) ||
        item.category?.toLowerCase().includes(lower) ||
        item.moodLabel?.toLowerCase().includes(lower) ||
        item.intro?.toLowerCase().includes(lower) ||
        item.desc?.toLowerCase().includes(lower) ||
        item.city?.toLowerCase().includes(lower) ||
        item.tags?.some(tag =>
          String(tag).toLowerCase().includes(lower)
        )
      );
    });

renderCards(
  results.slice(0, 10),
  `No recommendations found for “${keyword}”.`
);
  }

  function renderCards(items, emptyText) {
    if (!resultWrap) return;

    resultWrap.innerHTML = "";

    if (!items.length) {
      resultWrap.innerHTML = `
        <div class="guide-message">
          ${emptyText}
        </div>
      `;
      return;
    }

    items.forEach(item => {
      const card = document.createElement("article");
      card.className = "ai-guide-result-card";

      card.innerHTML = `
        <img
          src="${item.image || ""}"
          alt="${item.name || "HeriLand"}"
        >

        <div>
          <small>
            ${formatMeta(item)}
          </small>

          <h3>
            ${item.name || "Untitled Recommendation"}
          </h3>

          <p>
            ${truncateText(
item.intro ||
item.desc ||
item.title ||
"A place worth exploring slowly.",
              58
            )}
          </p>
        </div>
      `;

      card.addEventListener("click", () => {
        if (window.openDetail) {
          window.openDetail(item);
        }
      });

      resultWrap.appendChild(card);
    });
  }

  function clearChipActive() {
    chips.forEach(chip => {
      chip.classList.remove("active");
    });
  }

  function handleSearch() {
    const keyword = input?.value?.trim();

    if (!keyword) {
      renderGuide("restaurant");
      return;
    }

    searchGuide(keyword);
  }

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      renderGuide(chip.dataset.guide);
    });
  });

  sendBtn?.addEventListener("click", handleSearch);

  input?.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });

  fab?.addEventListener("click", toggleGuide);
  closeBtn?.addEventListener("click", closeGuide);
  backdrop?.addEventListener("click", closeGuide);

  console.log("[ai-guide] ready");
}

function formatMeta(item) {
  const city = item.city || "Sarawak";
const type =
  item.food ||
  item.moodLabel ||
  item.category ||
  item.tags?.[0] ||
  "Recommended";

  return `${city} · ${type}`;
}

function truncateText(text, max) {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max) + "...";
}

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}
