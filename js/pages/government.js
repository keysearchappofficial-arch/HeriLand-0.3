import { governmentData } from "../data/government.js";

/* =========================
   Elements
========================= */

const citySelect =
  document.getElementById(
    "governmentCitySelect"
  );

const typeSelect =
  document.getElementById(
    "governmentTypeSelect"
  );

const governmentList =
  document.getElementById(
    "governmentList"
  );

/* =========================
   Render
========================= */

function renderGovernmentList() {

  if (!governmentList) return;

  const city =
    citySelect?.value || "all";

  const type =
    typeSelect?.value || "all";

  const filtered =
    governmentData.filter(item => {

      const cityMatch =
        city === "all" ||
        item.city === city;

      const typeMatch =
        type === "all" ||
        item.type === type;

      return cityMatch && typeMatch;

    });

  governmentList.innerHTML = "";

  if (!filtered.length) {

governmentList.innerHTML = `
  <div class="government-empty">
    No information found.
  </div>
`;

    return;
  }

  filtered.forEach(item => {

    const row =
      document.createElement("article");

    row.className =
      "government-row";

    row.innerHTML = `

      <!-- Top -->
      <div class="government-row-top">

        <div>
          ${item.typeLabel}
        </div>

        <span>•</span>

        <div>
          ${item.cityLabel}
        </div>

        <span>•</span>

<a
  class="government-map-link"
  href="${
    item.map ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      item.name + " " + item.cityLabel
    )}`
  }"
  target="_blank"
  rel="noopener noreferrer"
>
  Map
</a>

${
  item.website
    ? `
      <span>•</span>
      <a
        class="government-website-link"
        href="${item.website}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Website
      </a>
    `
    : ""
}

      </div>

      <!-- Bottom -->
      <div class="government-row-bottom">

        <div>

          <strong>
            ${item.name}
          </strong>

          <div class="government-meta">
            ${item.hours}
          </div>

        </div>

        <div class="government-actions">

          <a
            class="government-phone-link"
            href="tel:${item.phone}"
          >
            ${item.phone}
          </a>

        </div>

      </div>
    `;

    governmentList.appendChild(row);

  });

}

/* =========================
   Bind
========================= */

function bindFilters() {

  citySelect?.addEventListener(
    "change",
    renderGovernmentList
  );

  typeSelect?.addEventListener(
    "change",
    renderGovernmentList
  );

}

/* =========================
   Mobile Menu
========================= */

function bindMobileMenu() {

  const menu =
    document.querySelector(".mobile-menu");

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

      menu.classList.add("show");

      document.body.style.overflow =
        "hidden";

    }
  );

  closeBtn.addEventListener(
    "click",
    () => {

      menu.classList.remove("show");

      document.body.style.overflow =
        "";

    }
  );

  menu.addEventListener(
    "click",
    e => {

      if (e.target === menu) {

        menu.classList.remove("show");

        document.body.style.overflow =
          "";

      }

    }
  );

}

/* =========================
   Init
========================= */

function initGovernmentPage() {

  bindFilters();

  bindMobileMenu();

  renderGovernmentList();

}

/* =========================
   Start
========================= */

let pageStarted = false;

function startPage() {
  if (pageStarted) return;

  pageStarted = true;

  console.log("[government] init");

  initGovernmentPage();
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
