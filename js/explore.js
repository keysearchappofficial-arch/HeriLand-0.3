const cards = [

  {
    contentType: "place",

    city: "KUCHING",

    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",

    place: "Kuching Waterfront",

    subtitle:
      "Where the river slows the city down.",

    tags:
      "Riverside · Sunset · Local Life",

    loved:
      "Loved by 342 travelers",

    slug:
      "kuching-waterfront"
  },

  {
    contentType: "event",

    city: "KUCHING",

    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",

    place:
      "Rainforest World Music Festival",

    subtitle:
      "Music, culture, and Borneo nights.",

    tags:
      "Festival · Music · Culture",

    loved:
      "12 Jul 2026",

    slug:
      "rainforest-world-music-festival"
  },

  {
    contentType: "place",

    city: "NATURE",

    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",

    place:
      "Borneo Rainforest",

    subtitle:
      "A quiet escape into mist and trees.",

    tags:
      "Nature · Hiking · Quiet",

    loved:
      "Loved by 218 travelers",

    slug:
      "borneo-rainforest"
  },

  {
    contentType: "place",

    city: "FOOD",

    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",

    place:
      "Sarawak Laksa Spot",

    subtitle:
      "Start your morning like a local.",

    tags:
      "Breakfast · Local Food · Classic",

    loved:
      "Loved by 489 travelers",

    slug:
      "sarawak-laksa-spot"
  },

  {
    contentType: "place",

    city: "CULTURE",

    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",

    place:
      "Longhouse Experience",

    subtitle:
      "Some stories are older than roads.",

    tags:
      "Culture · River · Local Story",

    loved:
      "Loved by 156 travelers",

    slug:
      "longhouse-experience"
  }

];

const stage =
  document.getElementById("exploreStage");

const filterToggle =
  document.getElementById("filterToggle");

const filterPanel =
  document.getElementById("filterPanel");

const currentFilterLabel =
  document.getElementById("currentFilterLabel");

let currentIndex = 0;
let isAnimating = false;

/* =========================
   Helpers
========================= */

function getCard(index) {
  return cards[
    (index + cards.length) % cards.length
  ];
}

/* =========================
   Filter
========================= */

filterToggle?.addEventListener(
  "click",
  (event) => {

    event.stopPropagation();

    const isOpen =
      filterPanel.classList.toggle("is-open");

    document.body.classList.toggle(
      "no-scroll",
      isOpen
    );
  }
);

document.addEventListener(
  "click",
  (event) => {

    if (
      filterPanel &&
      filterToggle &&
      !filterPanel.contains(event.target) &&
      !filterToggle.contains(event.target)
    ) {

      filterPanel.classList.remove("is-open");

      document.body.classList.remove("no-scroll");
    }
  }
);

document
  .querySelectorAll(".filter-grid button")
  .forEach((button) => {

    button.addEventListener("click", () => {

      document
        .querySelectorAll(".filter-grid button")
        .forEach((btn) => {
          btn.classList.remove("active");
        });

      button.classList.add("active");

      const label =
        button.textContent.trim();

      currentFilterLabel.textContent =
        label;

      filterPanel.classList.remove("is-open");

      document.body.classList.remove(
        "no-scroll"
      );

    });

  });

/* =========================
   Render
========================= */

function renderCards() {

  const active =
    getCard(currentIndex);

  const second =
    getCard(currentIndex + 1);

  const third =
    getCard(currentIndex + 2);

  stage.innerHTML = `
    ${renderActiveCard(active, currentIndex)}

    ${renderBackCard(
      second,
      "second",
      currentIndex + 1
    )}

    ${renderBackCard(
      third,
      "third",
      currentIndex + 2
    )}

    <button
      class="nav-arrow nav-prev"
      type="button"
      aria-label="Previous"
    >
      ‹
    </button>

    <button
      class="nav-arrow nav-next"
      type="button"
      aria-label="Next"
    >
      ›
    </button>
  `;

  bindEvents();
}

function renderActiveCard(item, index) {

  return `
    <article class="card active">

      <img
        src="${item.image}"
        alt="${item.place}"
      />

      <div class="overlay"></div>

      <div class="card-top">

        <div class="pill">
          ${item.contentType.toUpperCase()}
          ·
          ${item.city}
        </div>

        <div class="index">
          ${index + 1}/${cards.length}
        </div>

      </div>

      <div class="card-bottom">

        <div class="place">

          <h3>${item.place}</h3>

          <p class="subtitle">
            ${item.subtitle || ""}
          </p>

          <div class="tags">
            ${item.tags}
          </div>

        </div>

        <div class="footer-row">

          <div class="loved">
            ${item.loved}
          </div>

          <button
            class="save"
            type="button"
          >
            ♡
          </button>

        </div>

      </div>

    </article>
  `;
}

function renderBackCard(
  item,
  className,
  index
) {

  return `
    <article class="card ${className}">

      <img
        src="${item.image}"
        alt="${item.place}"
      />

      <div class="overlay"></div>

      <div class="card-top">

        <div class="pill">
          ${item.contentType.toUpperCase()}
          ·
          ${item.city}
        </div>

        <div class="index">
          ${(index % cards.length) + 1}/${cards.length}
        </div>

      </div>

      <div class="card-bottom">

        <div class="place">

          <h3>${item.place}</h3>

          <p class="subtitle">
            ${item.subtitle || ""}
          </p>

          <div class="tags">
            ${item.tags}
          </div>

        </div>

        <div class="footer-row">

          <div class="loved">
            ${item.loved}
          </div>

          <button
            class="save"
            type="button"
          >
            ♡
          </button>

        </div>

      </div>

    </article>
  `;
}

/* =========================
   Open Detail
========================= */

function openDetailPage() {

  const item =
    getCard(currentIndex);

  if (!item.slug) return;

  if (
    item.contentType === "event"
  ) {

    window.openEventDetail?.(
      item.slug
    );

    return;
  }

  window.openDetail?.(
    item.slug
  );
}

/* =========================
   Navigation
========================= */

function nextCard() {

  if (isAnimating) return;

  isAnimating = true;

  const activeCard =
    document.querySelector(".card.active");

  const secondCard =
    document.querySelector(".card.second");

  const thirdCard =
    document.querySelector(".card.third");

  activeCard?.classList.add(
    "swipe-left"
  );

  secondCard?.classList.add(
    "promote"
  );

  thirdCard?.classList.add(
    "promote-second"
  );

  setTimeout(() => {

    currentIndex =
      (currentIndex + 1) % cards.length;

    renderCards();

    isAnimating = false;

  }, 420);
}

function prevCard() {

  if (isAnimating) return;

  isAnimating = true;

  const activeCard =
    document.querySelector(".card.active");

  const secondCard =
    document.querySelector(".card.second");

  const thirdCard =
    document.querySelector(".card.third");

  activeCard?.classList.add(
    "swipe-right"
  );

  secondCard?.classList.add(
    "promote"
  );

  thirdCard?.classList.add(
    "promote-second"
  );

  setTimeout(() => {

    currentIndex =
      (currentIndex - 1 + cards.length)
      % cards.length;

    renderCards();

    isAnimating = false;

  }, 420);
}

/* =========================
   Bind
========================= */

function bindEvents() {

  document
    .querySelector(".nav-next")
    ?.addEventListener(
      "click",
      nextCard
    );

  document
    .querySelector(".nav-prev")
    ?.addEventListener(
      "click",
      prevCard
    );

  document
    .querySelector(".save")
    ?.addEventListener(
      "click",
      (event) => {

        event.stopPropagation();

        event.currentTarget.classList.toggle(
          "is-saved"
        );

        event.currentTarget.textContent =
          event.currentTarget.classList.contains(
            "is-saved"
          )
            ? "♥"
            : "♡";
      }
    );

  document
    .querySelector(".card.active")
    ?.addEventListener(
      "click",
      () => {

        openDetailPage();

      }
    );
}

/* =========================
   Mobile Drag Swipe
========================= */

let startX = 0;
let currentX = 0;
let isDragging = false;
let hasMoved = false;

const SWIPE_THRESHOLD = 90;

document.addEventListener(
  "touchstart",
  (event) => {

    if (isAnimating) return;

    const activeCard =
      document.querySelector(".card.active");

    if (!activeCard) return;

    startX =
      event.touches[0].clientX;

    currentX = startX;

    isDragging = true;
    hasMoved = false;

    activeCard.style.transition =
      "none";
  }
);

document.addEventListener(
  "touchmove",
  (event) => {

    if (
      !isDragging ||
      isAnimating
    ) return;

    const activeCard =
      document.querySelector(".card.active");

    if (!activeCard) return;

    currentX =
      event.touches[0].clientX;

    const diffX =
      currentX - startX;

    if (Math.abs(diffX) > 8) {
      hasMoved = true;
    }

    const rotate =
      diffX * 0.06;

    const opacity =
      Math.max(
        1 - Math.abs(diffX) / 420,
        0.35
      );

    activeCard.style.transform = `
      translateX(calc(-50% + ${diffX}px))
      rotate(${rotate}deg)
      scale(1)
    `;

    activeCard.style.opacity =
      opacity;
  }
);

document.addEventListener(
  "touchend",
  (event) => {

    if (
      !isDragging ||
      isAnimating
    ) return;

    isDragging = false;

    const activeCard =
      document.querySelector(".card.active");

    const secondCard =
      document.querySelector(".card.second");

    const thirdCard =
      document.querySelector(".card.third");

    if (!activeCard) return;

    const diffX =
      currentX - startX;

    activeCard.style.transition =
      "transform .38s cubic-bezier(.22,.9,.28,1), opacity .38s ease";

    if (!hasMoved) {

      const target =
        event.target;

      if (
        target.closest("button") ||
        target.closest(".save") ||
        target.closest(".filter-panel") ||
        target.closest(".city")
      ) {
        return;
      }

      if (
        target.closest(".card.active")
      ) {

        openDetailPage();

      }

      return;
    }

    isAnimating = true;

    if (
      Math.abs(diffX)
      < SWIPE_THRESHOLD
    ) {

      activeCard.style.transform = `
        translateX(-50%)
        rotate(0deg)
        scale(1)
      `;

      activeCard.style.opacity = "1";

      setTimeout(() => {

        isAnimating = false;

      }, 380);

      return;
    }

    secondCard?.classList.add(
      "promote"
    );

    thirdCard?.classList.add(
      "promote-second"
    );

    if (diffX < 0) {

      activeCard.style.transform = `
        translateX(calc(-50% - 520px))
        rotate(-18deg)
        scale(.96)
      `;

      activeCard.style.opacity = "0";

      setTimeout(() => {

        currentIndex =
          (currentIndex + 1)
          % cards.length;

        renderCards();

        isAnimating = false;

      }, 380);

      return;
    }

    if (diffX > 0) {

      activeCard.style.transform = `
        translateX(calc(-50% + 520px))
        rotate(18deg)
        scale(.96)
      `;

      activeCard.style.opacity = "0";

      setTimeout(() => {

        currentIndex =
          (
            currentIndex - 1 +
            cards.length
          ) % cards.length;

        renderCards();

        isAnimating = false;

      }, 380);
    }
  }
);

/* =========================
   Keyboard
========================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowUp"
    ) {
      nextCard();
    }

    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowDown"
    ) {
      prevCard();
    }
  }
);

renderCards();
