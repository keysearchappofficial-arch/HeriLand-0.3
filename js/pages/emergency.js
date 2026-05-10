import { emergencyData } from "../data/emergency.js";

/* =========================
   Elements
========================= */

const citySelect =
  document.getElementById("citySelect");

const typeSelect =
  document.getElementById("typeSelect");

const emergencyList =
  document.getElementById("emergencyList");

/* =========================
   Render
========================= */

function renderEmergencyList() {

  if (!emergencyList) return;

  const city =
    citySelect?.value || "all";

  const type =
    typeSelect?.value || "all";

  const filtered =
    emergencyData.filter(item => {

      const cityMatch =
        city === "all" ||
        item.city === city;

      const typeMatch =
        type === "all" ||
        item.type === type;

      return cityMatch && typeMatch;
    });

  emergencyList.innerHTML = "";

  if (!filtered.length) {

    emergencyList.innerHTML = `
      <div class="emergency-empty">
        沒有找到相關資訊
      </div>
    `;

    return;
  }

  filtered.forEach(item => {

    const card =
      document.createElement("article");

    card.className =
  "emergency-row";

card.innerHTML = `

  <div class="emergency-row-top">

    <small>
      ${item.typeLabel}
    </small>

    <span>・</span>

    <small>
      ${item.cityLabel}
    </small>

    <span>・</span>

    <a
      class="emergency-map-link"
      href="${item.map}"
      target="_blank"
    >
      Map
    </a>

  </div>

  <div class="emergency-row-bottom">

    <strong>
      ${item.name}
    </strong>

    <a
      class="emergency-phone-link"
      href="tel:${item.phone}"
    >
      ${item.phone}
    </a>

  </div>

`;

    emergencyList.appendChild(card);

  });

}

/* =========================
   Filters
========================= */

function bindFilters() {

  citySelect?.addEventListener(
    "change",
    renderEmergencyList
  );

  typeSelect?.addEventListener(
    "change",
    renderEmergencyList
  );

}

/* =========================
   Mobile Menu
========================= */

function bindMobileMenu() {

  const menu =
    document.querySelector(".mobile-menu");

  const openBtn =
    document.getElementById("mobileMenuBtn");

  const closeBtn =
    document.getElementById("mobileMenuClose");

  if (!menu || !openBtn || !closeBtn) return;

  openBtn.addEventListener("click", () => {

    menu.classList.add("show");

    document.body.style.overflow =
      "hidden";

  });

  closeBtn.addEventListener("click", () => {

    menu.classList.remove("show");

    document.body.style.overflow =
      "";

  });

  menu.addEventListener("click", e => {

    if (e.target === menu) {

      menu.classList.remove("show");

      document.body.style.overflow =
        "";

    }

  });

}

/* =========================
   Init
========================= */

function initEmergencyPage() {

  bindFilters();

  bindMobileMenu();

  renderEmergencyList();

}

/* =========================
   Start
========================= */

let pageStarted = false;

function startPage() {

  if (pageStarted) return;

  pageStarted = true;

  console.log("[emergency] init");

  initEmergencyPage();

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