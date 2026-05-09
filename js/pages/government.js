const governmentData = [

  {
    city: "kuching",
    cityLabel: "Kuching",

    type: "immigration",
    typeLabel: "Immigration",

    name: "Sarawak Immigration Office",

    hours:
      "Mon – Fri · 8:00 AM – 5:00 PM",

    phone:
      "082-242133",

    website:
      "https://imi.gov.my",

    map:
      "https://maps.google.com/?q=Sarawak+Immigration+Office+Kuching"
  },

  {
    city: "kuching",
    cityLabel: "Kuching",

    type: "jpj",
    typeLabel: "JPJ",

    name: "JPJ Kuching",

    hours:
      "Mon – Fri · 8:00 AM – 4:30 PM",

    phone:
      "082-259900",

    website:
      "https://www.jpj.gov.my",

    map:
      "https://maps.google.com/?q=JPJ+Kuching"
  },

  {
    city: "sibu",
    cityLabel: "Sibu",

    type: "hospital",
    typeLabel: "Hospital",

    name: "Sibu Hospital",

    hours:
      "24 Hours",

    phone:
      "084-343333",

    website:
      "",

    map:
      "https://maps.google.com/?q=Sibu+Hospital"
  },

  {
    city: "miri",
    cityLabel: "Miri",

    type: "tourism",
    typeLabel: "Tourism",

    name: "Miri Visitor Information Centre",

    hours:
      "Daily · 9:00 AM – 5:00 PM",

    phone:
      "085-434343",

    website:
      "https://sarawaktourism.com",

    map:
      "https://maps.google.com/?q=Miri+Visitor+Information+Centre"
  }

];

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
        沒有找到相關資訊
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
          href="${item.map}"
          target="_blank"
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

window.addEventListener(
  "componentsReady",
  () => {

    console.log(
      "[government] init"
    );

    initGovernmentPage();

  }
);