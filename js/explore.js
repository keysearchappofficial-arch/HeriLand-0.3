const cards = [
  {
    city: "KUCHING",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    title: "Evenings hit different here.",
    desc:
      "Locals come here to slow down. Good food, river breeze, and the city lights.",
    place: "Kuching Waterfront",
    tags: "Riverside · Sunset · Local Life",
    loved: "Loved by 342 travelers"
  },
  {
    city: "NATURE",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
    title: "The rain makes everything quieter.",
    desc:
      "A quiet escape for travelers who want mist, trees, and slower mornings.",
    place: "Borneo Rainforest",
    tags: "Nature · Hiking · Quiet",
    loved: "Loved by 218 travelers"
  },
  {
    city: "FOOD",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    title: "Small bowls. Big memories.",
    desc:
      "Start your morning like a local with warm food and old conversations.",
    place: "Sarawak Laksa Spot",
    tags: "Breakfast · Local Food · Classic",
    loved: "Loved by 489 travelers"
  },
  {
    city: "CULTURE",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    title: "Some stories are older than roads.",
    desc:
      "A slower journey into longhouse life, river culture, and Sarawak memory.",
    place: "Longhouse Experience",
    tags: "Culture · River · Local Story",
    loved: "Loved by 156 travelers"
  }
];

const stage = document.getElementById("exploreStage");

let currentIndex = 0;

function getCard(index) {
  return cards[(index + cards.length) % cards.length];
}

function renderCards() {
  const active = getCard(currentIndex);
  const second = getCard(currentIndex + 1);
  const third = getCard(currentIndex + 2);

  stage.innerHTML = `
    ${renderActiveCard(active, currentIndex)}
    ${renderBackCard(second, "second", currentIndex + 1)}
    ${renderBackCard(third, "third", currentIndex + 2)}

    <button class="nav-arrow nav-prev" type="button" aria-label="Previous">‹</button>
    <button class="nav-arrow nav-next" type="button" aria-label="Next">›</button>
  `;

  bindEvents();
}

function renderActiveCard(item, index) {
  return `
    <article class="card active">
      <img src="${item.image}" alt="${item.place}" />

      <div class="overlay"></div>

      <div class="card-top">
        <div class="pill">⌖ ${item.city}</div>
        <div class="index">${index + 1}/${cards.length}</div>
      </div>

      <div class="copy">
        <h2>${item.title}</h2>
        <div class="line"></div>
        <p>${item.desc}</p>
      </div>

      <div class="card-bottom">
        <div class="place">
          <h3>≋ ${item.place}</h3>
          <div class="tags">${item.tags}</div>
        </div>

        <div class="footer-row">
          <div class="loved">${item.loved}</div>
          <button class="save" type="button">♡</button>
        </div>
      </div>
    </article>
  `;
}

function renderBackCard(item, className, index) {
  return `
    <article class="card ${className}">
      <img src="${item.image}" alt="${item.place}" />
      <div class="overlay"></div>
      <div class="back-index">${(index % cards.length) + 1}/${cards.length}</div>
      <div class="back-title">${item.title}</div>
    </article>
  `;
}

function nextCard() {
  currentIndex = (currentIndex + 1) % cards.length;
  renderCards();
}

function prevCard() {
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  renderCards();
}

function bindEvents() {
  document.querySelector(".nav-next")?.addEventListener("click", nextCard);
  document.querySelector(".nav-prev")?.addEventListener("click", prevCard);

  document.querySelector(".save")?.addEventListener("click", (event) => {
    event.stopPropagation();
    event.currentTarget.classList.toggle("is-saved");
    event.currentTarget.textContent =
      event.currentTarget.classList.contains("is-saved") ? "♥" : "♡";
  });

  document.querySelector(".card.active")?.addEventListener("click", () => {
    const item = getCard(currentIndex);
    console.log("open detail:", item.place);
  });
}

/* Mobile swipe left / right */
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener("touchend", (event) => {
  touchEndX = event.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const distance = touchStartX - touchEndX;

  if (Math.abs(distance) < 50) return;

  // 向左滑：下一張
  if (distance > 0) {
    nextCard();
  }

  // 向右滑：上一張
  if (distance < 0) {
    prevCard();
  }
}

/* Desktop keyboard */
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowUp") {
    nextCard();
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
    prevCard();
  }
});

renderCards();
