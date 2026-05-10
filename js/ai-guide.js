import {
  places,
  restaurants
} from "../data.js";

export function initAiGuide() {

  const host =
    document.getElementById("aiGuide");

  if (!host) return;

  const fab =
    host.querySelector("#aiGuideFab");

  const sheet =
    host.querySelector("#aiGuideSheet");

  if (fab)
    document.body.appendChild(fab);

  if (sheet)
    document.body.appendChild(sheet);

  const closeBtn =
    document.getElementById(
      "aiGuideClose"
    );

  const backdrop =
    document.getElementById(
      "aiGuideBackdrop"
    );

  const content =
    document.getElementById(
      "aiGuideContent"
    );

  const resultWrap =
    document.getElementById(
      "aiGuideResults"
    );

  const chips =
    document.querySelectorAll(
      ".guide-chip-group button"
    );

  /* =========================
     Toggle
  ========================= */

  function toggleGuide() {

    const isOpen =
      sheet.classList.contains("show");

    if (isOpen) {

      sheet.classList.remove("show");

      document.body.style.overflow =
        "";

    }

    else {

      sheet.classList.add("show");

      document.body.style.overflow =
        "hidden";

      renderGuide("restaurant");

    }

  }

  /* =========================
     Close
  ========================= */

  function closeGuide() {

    sheet.classList.remove("show");

    document.body.style.overflow =
      "";

  }

  /* =========================
     Render
  ========================= */

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

      items =
        shuffleArray(restaurants)
          .slice(0, 3);

    }

    else if (type === "view") {

      items =
        shuffleArray(
          places.filter(place =>
            place.mood === "view"
          )
        ).slice(0, 3);

    }

    else if (type === "relax") {

      items =
        shuffleArray(
          places.filter(place =>
            place.mood === "relax"
          )
        ).slice(0, 3);

    }

    else if (type === "culture") {

      items =
        shuffleArray(
          places.filter(place =>
            place.category === "culture"
          )
        ).slice(0, 3);

    }

    resultWrap.innerHTML = "";

    if (!items.length) {

      resultWrap.innerHTML = `
        <div class="guide-message">
          目前還沒有推薦內容。
        </div>
      `;

      return;

    }

    items.forEach(item => {

      const card =
        document.createElement("article");

      card.className =
        "ai-guide-result-card";

      card.innerHTML = `
        <img
          src="${item.image}"
          alt="${item.name}"
        >

        <div>

          <small>
            ${item.city || "Sarawak"}
          </small>

          <h3>
            ${item.name}
          </h3>

          <p>
            ${
              truncateText(
                item.intro ||
                item.desc ||
                "適合慢慢探索的地方。",
                52
              )
            }
          </p>

        </div>
      `;

      card.addEventListener(
        "click",
        () => {

          if (window.openDetail) {

            window.openDetail(item);

          }

        }
      );

      resultWrap.appendChild(card);

    });

  }

  /* =========================
     Chips
  ========================= */

  chips.forEach(chip => {

    chip.addEventListener(
      "click",
      () => {

        renderGuide(
          chip.dataset.guide
        );

      }
    );

  });

  /* =========================
     Events
  ========================= */

  fab?.addEventListener(
    "click",
    toggleGuide
  );

  closeBtn?.addEventListener(
    "click",
    closeGuide
  );

  backdrop?.addEventListener(
    "click",
    closeGuide
  );

  console.log("[ai-guide] ready");

}

/* =========================
   Utils
========================= */

function truncateText(text, max) {

  if (!text) return "";

  if (text.length <= max)
    return text;

  return text.slice(0, max) + "...";

}

function shuffleArray(array) {

  return [...array].sort(
    () => Math.random() - 0.5
  );

}