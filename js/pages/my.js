/* =========================
   Mock Data
========================= */

const savedPlaces = [

  {
    title: "Kuching Waterfront",
    desc: "適合傍晚慢慢散步和看河景。",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
  },

  {
    title: "Santubong Beach",
    desc: "比較安靜的海邊，很適合放空。",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
  },

  {
    title: "Old Town Street",
    desc: "適合慢慢逛和拍照的老街。",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80"
  },

  {
    title: "Sarawak River",
    desc: "晚上氣氛很舒服的河邊。",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
  }

];

const tripPlans = [

  {
    title: "Kuching Weekend",
    desc:
      "河邊散步、美食和比較慢的週末節奏。",

    meta:
      ["2 Days", "Food", "Relax"]
  },

  {
    title: "Miri Sunset Trip",
    desc:
      "看海、夕陽和比較自然的旅行方式。",

    meta:
      ["3 Days", "Beach", "Sunset"]
  },

  {
    title: "Sarawak Food Route",
    desc:
      "專門找 Laksa、Kolo Mee 和在地早餐。",

    meta:
      ["Food", "Local", "Cafe"]
  }

];

const recentViews = [

  {
    title: "Borneo Cultures Museum",
    desc: "Kuching",

    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80"
  },

  {
    title: "Satok Weekend Market",
    desc: "Local Market",

    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
  },

  {
    title: "Damai Beach",
    desc: "Santubong",

    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
  }

];

/* =========================
   Init
========================= */

function init() {
  bindMobileMenu();
  bindMyViews();

  renderSavedSheet();
  renderTripSheet();
  renderRecentSheet();
}

function bindMyViews() {

  const mainView =
    document.getElementById(
      "myMainView"
    );

  const allViews =
    document.querySelectorAll(
      ".my-view-sub"
    );

  let viewStack = [];

  /* =========================
     Open
  ========================= */

  document
    .querySelectorAll("[data-open-view]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const targetId =
            button.dataset.openView;

          const target =
            document.getElementById(
              targetId
            );

          if (!target) return;

          /* Current active */

          const current =
            document.querySelector(
              ".my-view-sub.active"
            );

          if (current) {
            viewStack.push(current.id);
          }

          else {
            viewStack.push("main");
          }

          /* Push main */

          mainView.classList.add(
            "is-pushed"
          );

          /* Hide current */

          allViews.forEach(view => {
            view.classList.remove("active");
          });

          /* Show target */

          target.classList.add("active");

          window.scrollTo({
            top: 0
          });

        }
      );

    });

  /* =========================
     Back
  ========================= */

  document
    .querySelectorAll("[data-back-view]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const current =
            button.closest(".my-view-sub");

          if (!current) return;

          current.classList.remove(
            "active"
          );

          const prev =
            viewStack.pop();

          /* Back to main */

          if (
            !prev ||
            prev === "main"
          ) {

            mainView.classList.remove(
              "is-pushed"
            );

            return;

          }

          /* Back to previous sub */

          const prevView =
            document.getElementById(
              prev
            );

          if (prevView) {

            prevView.classList.add(
              "active"
            );

          }

        }
      );

    });

}

/* =========================
   Mobile Menu
========================= */

function bindMobileMenu() {

  const menu =
    document.querySelector(
      ".mobile-menu"
    );

  const openBtn =
    document.getElementById(
      "mobileMenuBtn"
    );

  const closeBtn =
    document.getElementById(
      "mobileMenuClose"
    );

  if (
    !menu ||
    !openBtn ||
    !closeBtn
  ) return;

  openBtn.addEventListener(
    "click",
    () => {

      menu.classList.add(
        "show"
      );

      document.body.style.overflow =
        "hidden";

    }
  );

  closeBtn.addEventListener(
    "click",
    () => {

      menu.classList.remove(
        "show"
      );

      document.body.style.overflow =
        "";

    }
  );

  menu.addEventListener(
    "click",
    e => {

      if (e.target === menu) {

        menu.classList.remove(
          "show"
        );

        document.body.style.overflow =
          "";

      }

    }
  );

}

/* =========================
   My Sheet
========================= */

/* =========================
   Open
========================= */

/* =========================
   Close
========================= */

/* =========================
   Saved Sheet
========================= */

function renderSavedSheet() {

  const grid =
    document.getElementById(
      "savedSheetGrid"
    );

  if (!grid) return;

  grid.innerHTML = "";

  savedPlaces.forEach(place => {

    const card =
      document.createElement(
        "article"
      );

    card.className =
      "saved-card";

    card.innerHTML = `
      <img
        src="${place.image}"
        alt="${place.title}"
      >

      <div class="saved-card-body">

        <h3>
          ${place.title}
        </h3>

        <p>
          ${place.desc}
        </p>

      </div>
    `;

    grid.appendChild(card);

  });

}

/* =========================
   Trip Sheet
========================= */

function renderTripSheet() {

  const grid =
    document.getElementById(
      "tripSheetGrid"
    );

  if (!grid) return;

  grid.innerHTML = "";

  tripPlans.forEach(plan => {

    const card =
      document.createElement(
        "article"
      );

    card.className =
      "trip-card";

    card.innerHTML = `
      <small>
        HeriLand Trip
      </small>

      <h3>
        ${plan.title}
      </h3>

      <p>
        ${plan.desc}
      </p>

      <div class="trip-meta">
        ${plan.meta.map(item => `
          <span>${item}</span>
        `).join("")}
      </div>
    `;

    grid.appendChild(card);

  });

}

/* =========================
   Recent Sheet
========================= */

function renderRecentSheet() {

  const list =
    document.getElementById(
      "recentSheetList"
    );

  if (!list) return;

  list.innerHTML = "";

  recentViews.forEach(item => {

    const row =
      document.createElement(
        "article"
      );

    row.className =
      "recent-item";

    row.innerHTML = `
      <img
        src="${item.image}"
        alt="${item.title}"
      >

      <div>

        <h3>
          ${item.title}
        </h3>

        <p>
          ${item.desc}
        </p>

      </div>
    `;

    list.appendChild(row);

  });

}

/* =========================
   Start
========================= */

let appStarted = false;

function startPage() {

  if (appStarted) return;

  appStarted = true;

  console.log(
    "[my] init"
  );

  init();

}

if (window.componentsLoaded) {

  startPage();

}
else {

  window.addEventListener(
    "componentsReady",
    startPage
  );

}
