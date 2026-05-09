const emergencyData = [
  {
    city: "kuching",
    cityLabel: "Kuching",
    type: "police",
    typeLabel: "警察局",
    name: "Kuching Central Police Station",
    phone: "082-244444",
    desc: "旅途中若遇到遺失、報案或突發事件，可聯絡當地警察局。"
  },

  {
    city: "kuching",
    cityLabel: "Kuching",
    type: "fire",
    typeLabel: "消防局",
    name: "Kuching Fire & Rescue",
    phone: "082-123456",
    desc: "緊急火災、救援或事故支援。"
  },

  {
    city: "kuching",
    cityLabel: "Kuching",
    type: "hospital",
    typeLabel: "醫院",
    name: "Sarawak General Hospital",
    phone: "082-276666",
    desc: "主要大型醫療中心。"
  },

  {
    city: "sibu",
    cityLabel: "Sibu",
    type: "fire",
    typeLabel: "消防局",
    name: "Sibu Fire Station",
    phone: "084-123456",
    desc: "提供當地緊急救援服務。"
  },

  {
    city: "sibu",
    cityLabel: "Sibu",
    type: "hospital",
    typeLabel: "醫院",
    name: "Sibu Hospital",
    phone: "084-343333",
    desc: "24 小時醫療支援。"
  },

  {
    city: "miri",
    cityLabel: "Miri",
    type: "tourism",
    typeLabel: "旅遊中心",
    name: "Miri Visitor Info Center",
    phone: "085-434343",
    desc: "旅遊協助、活動資訊與在地交通。"
  },

  {
    city: "bintulu",
    cityLabel: "Bintulu",
    type: "police",
    typeLabel: "警察局",
    name: "Bintulu Police HQ",
    phone: "086-333222",
    desc: "緊急協助與安全支援。"
  }
];

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
  <div class="emergency-name">

    <small>
      ${item.typeLabel}・${item.cityLabel}
    </small>

    <strong>
      ${item.name}
    </strong>

  </div>

  <div class="emergency-actions">

    <a
      class="emergency-phone-link"
      href="tel:${item.phone}"
    >
      ${item.phone}
    </a>

    <a
      class="emergency-map-link"
      href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}"
      target="_blank"
    >
      導航
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