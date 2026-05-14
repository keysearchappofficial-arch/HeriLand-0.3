import { supabase } from "../supabase-client.js";

const MEDIA_API =
  "https://heriland-media.keysearch-app.com";

import {
  initDetail
} from "../detail.js";

import {
  initEventDetail
} from "../event-detail.js";

/* =========================
   Local Component Loader
========================= */

async function loadComponent(selector, file) {
  const target =
    document.querySelector(selector);

  if (!target) return;

  const response =
    await fetch(file);

  const html =
    await response.text();

  target.innerHTML = html;
}

/* =========================
   Elements
========================= */

const formType =
  document.getElementById("contentType");

const formArea =
  document.getElementById("dynamicFormArea");

const imageGrid =
  document.getElementById("studioImageGrid");

const uploadInput =
  document.getElementById("studioImageUpload");

const submitBtn =
  document.getElementById("studioSubmitBtn");

const previewBtn =
  document.getElementById("studioPreviewBtn");

const adminManageTable =
  document.getElementById("adminManageTable");

const adminRefreshBtn =
  document.getElementById("adminRefreshBtn");

const adminExcelTable =
  document.getElementById("adminExcelTable");

let uploadedImages = [];
let featureTags = [];

/* =========================
   Manage Table Config
========================= */

const manageConfigs = {
  attractions: {
    label: "Attractions",
    table: "places",
    primaryKey: "id",
    filter: {
      column: "type",
      value: "attraction"
    },
    orderBy: "created_at",
    columns: [
      "id",
      "type",
      "status",
      "name",
      "city",
      "area",
      "address",
      "short_description",
      "full_description",
      "hero_image_url",
      "card_image_url",
      "gallery_urls",
      "tags",
      "opening_hours",
      "phone",
      "website_url",
      "google_map_url",
      "price_level",
      "is_featured",
      "created_at",
      "updated_at"
    ],
    readonly: [
      "id",
      "type",
      "created_at",
      "updated_at"
    ],
    jsonFields: [
      "gallery_urls",
      "tags",
      "opening_hours"
    ],
    booleanFields: [
      "is_featured"
    ]
  },

  restaurants: {
    label: "Restaurants",
    table: "places",
    primaryKey: "id",
    filter: {
      column: "type",
      value: "restaurant"
    },
    orderBy: "created_at",
    columns: [
      "id",
      "type",
      "status",
      "name",
      "city",
      "area",
      "address",
      "short_description",
      "full_description",
      "hero_image_url",
      "card_image_url",
      "gallery_urls",
      "tags",
      "opening_hours",
      "phone",
      "website_url",
      "google_map_url",
      "price_level",
      "is_featured",
      "created_at",
      "updated_at"
    ],
    readonly: [
      "id",
      "type",
      "created_at",
      "updated_at"
    ],
    jsonFields: [
      "gallery_urls",
      "tags",
      "opening_hours"
    ],
    booleanFields: [
      "is_featured"
    ]
  },

  events: {
    label: "Events",
    table: "events",
    primaryKey: "id",
    orderBy: "created_at",
    columns: [
      "id",
      "status",
      "title",
      "city",
      "area",
      "venue_name",
      "address",
      "summary",
      "content",
      "start_date",
      "end_date",
      "time_rule",
      "hero_image_url",
      "card_image_url",
      "gallery_urls",
      "organizer",
      "ticket_url",
      "google_map_url",
      "tags",
      "is_featured",
      "created_at",
      "updated_at"
    ],
    readonly: [
      "id",
      "created_at",
      "updated_at"
    ],
    jsonFields: [
      "gallery_urls",
      "tags",
      "time_rule"
    ],
    booleanFields: [
      "is_featured"
    ]
  },

  emergency_contacts: {
    label: "Emergency Contacts",
    table: "emergency_contacts",
    primaryKey: "id",
    orderBy: "created_at",
    columns: [
      "id",
      "status",
      "unit_type",
      "area",
      "name",
      "address",
      "phone",
      "created_at",
      "updated_at"
    ],
    readonly: [
      "id",
      "created_at",
      "updated_at"
    ],
    jsonFields: [],
    booleanFields: []
  },

  government_contacts: {
    label: "Government Contacts",
    table: "government_contacts",
    primaryKey: "id",
    orderBy: "created_at",
    columns: [
      "id",
      "status",
      "unit_type",
      "area",
      "name",
      "address",
      "phone",
      "website",
      "created_at",
      "updated_at"
    ],
    readonly: [
      "id",
      "created_at",
      "updated_at"
    ],
    jsonFields: [],
    booleanFields: []
  }
};

/* =========================
   Weekly Hours Template
========================= */

function weeklyHoursTemplate(prefix) {
  const days = [
    ["Mon", "Monday"],
    ["Tue", "Tuesday"],
    ["Wed", "Wednesday"],
    ["Thu", "Thursday"],
    ["Fri", "Friday"],
    ["Sat", "Saturday"],
    ["Sun", "Sunday"]
  ];

  return `
    <div class="studio-field studio-hours-field">
      <span>Opening Hours</span>

      <div class="studio-week-hours">
        ${days.map(([key, label]) => `
          <div class="studio-day-row">
            <label class="studio-day-check">
              <input type="checkbox" id="${prefix}${key}Closed">
              <span>${label}</span>
            </label>

            <input type="time" id="${prefix}${key}Open">

            <span class="studio-time-separator">-</span>

            <input type="time" id="${prefix}${key}Close">
          </div>
        `).join("")}
      </div>

      <small>
        Tick the day if closed.
      </small>
    </div>
  `;
}

/* =========================
   Templates
========================= */

const formTemplates = {
  attraction: `
    <div class="studio-card">
      <div class="studio-card-head">
        <small>Attraction</small>
        <h2>Place Information</h2>
      </div>

      <div class="studio-grid two">
        <label class="studio-field">
          <span>Place Name</span>
          <input type="text" id="placeName">
        </label>

        <label class="studio-field">
          <span>City</span>
          <select id="placeCity">
            <option value="kuching">Kuching</option>
            <option value="sibu">Sibu</option>
            <option value="miri">Miri</option>
            <option value="bintulu">Bintulu</option>
          </select>
        </label>

        <label class="studio-field">
          <span>Category</span>
          <input type="text" id="placeCategory">
        </label>

        <div class="studio-field">
          <span>Feature Tags</span>

          <div class="studio-tag-box">
            <div class="studio-tag-list" id="featureTagList"></div>

            <input
              type="text"
              id="featureTagInput"
              placeholder="Type tag and press Enter"
            >
          </div>

          <small>Max 5 tags. Press Enter or comma to add.</small>
        </div>

        ${weeklyHoursTemplate("place")}

        <label class="studio-field">
          <span>Phone</span>
          <input type="text" id="placePhone" placeholder="+60 12-345 6789">
        </label>
      </div>

      <div class="studio-grid one">
        <label class="studio-field">
          <span>Address</span>
          <input type="text" id="placeAddress">
        </label>

        <label class="studio-field">
          <span>Description</span>
          <textarea id="placeDescription"></textarea>
        </label>
      </div>
    </div>
  `,

  restaurant: `
    <div class="studio-card">
      <div class="studio-card-head">
        <small>Restaurant</small>
        <h2>Restaurant Information</h2>
      </div>

      <div class="studio-grid two">
        <label class="studio-field">
          <span>Restaurant Name</span>
          <input type="text" id="restaurantName">
        </label>

        <label class="studio-field">
          <span>City</span>
          <select id="restaurantCity">
            <option value="kuching">Kuching</option>
            <option value="sibu">Sibu</option>
            <option value="miri">Miri</option>
            <option value="bintulu">Bintulu</option>
          </select>
        </label>

        <label class="studio-field">
          <span>Food Type</span>
          <input type="text" id="restaurantFood">
        </label>

        <div class="studio-field">
          <span>Feature Tags</span>

          <div class="studio-tag-box">
            <div class="studio-tag-list" id="featureTagList"></div>

            <input
              type="text"
              id="featureTagInput"
              placeholder="Type tag and press Enter"
            >
          </div>

          <small>Max 5 tags. Press Enter or comma to add.</small>
        </div>

        ${weeklyHoursTemplate("restaurant")}

        <label class="studio-field">
          <span>Phone</span>
          <input type="text" id="restaurantPhone" placeholder="+60 12-345 6789">
        </label>
      </div>

      <div class="studio-grid one">
        <label class="studio-field">
          <span>Address</span>
          <input type="text" id="restaurantAddress">
        </label>

        <label class="studio-field">
          <span>Description</span>
          <textarea id="restaurantDescription"></textarea>
        </label>
      </div>
    </div>
  `,

  event: `
    <div class="studio-card">
      <div class="studio-card-head">
        <small>Event</small>
        <h2>Event Information</h2>
      </div>

      <div class="studio-grid two">
        <label class="studio-field">
          <span>Event Title</span>
          <input type="text" id="eventTitle">
        </label>

        <label class="studio-field">
          <span>City</span>
          <select id="eventCity">
            <option value="kuching">Kuching</option>
            <option value="sibu">Sibu</option>
            <option value="miri">Miri</option>
            <option value="bintulu">Bintulu</option>
          </select>
        </label>

        <label class="studio-field">
          <span>Area</span>
          <input type="text" id="eventArea" placeholder="Optional area">
        </label>

        <label class="studio-field">
          <span>Venue Name</span>
          <input type="text" id="eventVenue" placeholder="Venue / Place name">
        </label>

        <label class="studio-field">
          <span>Start Time</span>
          <input type="datetime-local" id="eventStart">
        </label>

        <label class="studio-field">
          <span>End Time</span>
          <input type="datetime-local" id="eventEnd">
        </label>

        <label class="studio-field">
          <span>Date Display</span>
          <label>
            <input type="checkbox" id="eventNoEndDate">
            No end date
          </label>
        </label>

        <label class="studio-field">
          <span>Time Display</span>
          <label>
            <input type="checkbox" id="eventNoEndTime">
            No end time
          </label>
        </label>

        <label class="studio-field">
          <span>Organizer</span>
          <input type="text" id="eventOrganizer" placeholder="Optional">
        </label>

        <label class="studio-field">
          <span>Ticket URL</span>
          <input type="url" id="eventTicketUrl" placeholder="https://...">
        </label>

        <label class="studio-field">
          <span>Google Map URL</span>
          <input type="url" id="eventGoogleMapUrl" placeholder="https://...">
        </label>

        <div class="studio-field">
          <span>Tags</span>

          <div class="studio-tag-box">
            <div class="studio-tag-list" id="featureTagList"></div>

            <input
              type="text"
              id="featureTagInput"
              placeholder="Type tag and press Enter"
            >
          </div>

          <small>Max 5 tags. Press Enter or comma to add.</small>
        </div>
      </div>

      <div class="studio-grid one">
        <label class="studio-field">
          <span>Address</span>
          <input type="text" id="eventAddress" placeholder="Full address">
        </label>

        <label class="studio-field">
          <span>Summary</span>
          <textarea id="eventSummary" placeholder="Short event intro"></textarea>
        </label>

        <label class="studio-field">
          <span>Content</span>
          <textarea id="eventContent" placeholder="Full event description"></textarea>
        </label>
      </div>
    </div>
  `,

  emergency: `
    <div class="studio-card">
      <div class="studio-card-head">
        <small>Emergency Contact</small>
        <h2>Emergency Unit</h2>
      </div>

      <div class="studio-grid two">
        <label class="studio-field">
          <span>Unit Type</span>
          <select id="emergencyType">
            <option value="hospital">Hospital</option>
            <option value="police">Police</option>
            <option value="fire">Fire Department</option>
            <option value="embassy">Embassy</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label class="studio-field">
          <span>Area</span>
          <select id="emergencyArea">
            <option value="kuching">Kuching</option>
            <option value="sibu">Sibu</option>
            <option value="miri">Miri</option>
            <option value="bintulu">Bintulu</option>
            <option value="sarikei">Sarikei</option>
          </select>
        </label>
      </div>

      <div class="studio-grid one">
        <label class="studio-field">
          <span>Unit Name</span>
          <input type="text" id="emergencyName" placeholder="Sibu Hospital">
        </label>

        <label class="studio-field">
          <span>Address</span>
          <input type="text" id="emergencyAddress" placeholder="Full address">
        </label>

        <label class="studio-field">
          <span>Phone</span>
          <input type="text" id="emergencyPhone" placeholder="084-343333">
        </label>
      </div>
    </div>
  `,

  government: `
    <div class="studio-card">
      <div class="studio-card-head">
        <small>Government Contact</small>
        <h2>Government Unit</h2>
      </div>

      <div class="studio-grid two">
        <label class="studio-field">
          <span>Unit Type</span>
          <select id="governmentType">
            <option value="tourism">Tourism Office</option>
            <option value="immigration">Immigration</option>
            <option value="cityhall">City Hall</option>
            <option value="transport">Transport Office</option>
            <option value="police">Police</option>
            <option value="health">Health Department</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label class="studio-field">
          <span>Area</span>
          <select id="governmentArea">
            <option value="kuching">Kuching</option>
            <option value="sibu">Sibu</option>
            <option value="miri">Miri</option>
            <option value="bintulu">Bintulu</option>
            <option value="sarikei">Sarikei</option>
          </select>
        </label>
      </div>

      <div class="studio-grid one">
        <label class="studio-field">
          <span>Unit Name</span>
          <input type="text" id="governmentName" placeholder="Sarawak Tourism Board">
        </label>

        <label class="studio-field">
          <span>Address</span>
          <input type="text" id="governmentAddress" placeholder="Full address">
        </label>

        <label class="studio-field">
          <span>Phone</span>
          <input type="text" id="governmentPhone" placeholder="+60...">
        </label>

        <label class="studio-field">
          <span>Website</span>
          <input type="url" id="governmentWebsite" placeholder="https://...">
        </label>
      </div>
    </div>
  `
};

/* =========================
   Init
========================= */

async function loadPreviewComponents() {
  await loadComponent(
    "#detailContainer",
    "./components/detail.html"
  );

  await loadComponent(
    "#eventDetailContainer",
    "./components/event-detail.html"
  );

  const detailPage =
    document.getElementById("detailPage");

  const eventDetailPage =
    document.getElementById("eventDetailPage");

  if (detailPage) {
    document.body.appendChild(detailPage);
  }

  if (eventDetailPage) {
    document.body.appendChild(eventDetailPage);
  }

  initDetail();
  initEventDetail();
}

async function initStudio() {
  await loadPreviewComponents();

  renderForm(formType.value);

  bindEvents();

  initStudioTabs();
}

initStudio();

/* =========================
   Events
========================= */

function bindEvents() {
  formType?.addEventListener("change", e => {
    renderForm(e.target.value);
    resetImages();
  });

  uploadInput?.addEventListener(
    "change",
    handleImageUpload
  );

  submitBtn?.addEventListener(
    "click",
    handleSubmit
  );

  previewBtn?.addEventListener(
    "click",
    handlePreview
  );

  adminManageTable?.addEventListener(
    "change",
    loadAdminManageTable
  );

  adminRefreshBtn?.addEventListener(
    "click",
    loadAdminManageTable
  );
}

/* =========================
   Studio Tabs
========================= */

function initStudioTabs() {
  const tabs =
    document.querySelectorAll(".studio-tab");

  const submitPanel =
    document.getElementById("studioSubmitPanel");

  const managePanel =
    document.getElementById("studioManagePanel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target =
        tab.dataset.studioTab;

      tabs.forEach(item => {
        item.classList.remove("active");
      });

      tab.classList.add("active");

      submitPanel?.classList.toggle(
        "active",
        target === "submit"
      );

      managePanel?.classList.toggle(
        "active",
        target === "manage"
      );

      if (target === "manage") {
        loadAdminManageTable();
      }
    });
  });
}

/* =========================
   Admin Manage Table
========================= */

async function loadAdminManageTable() {
  if (!adminManageTable || !adminExcelTable) return;

  const key =
    adminManageTable.value;

  const config =
    manageConfigs[key];

  if (!config) return;

  setAdminTableLoading(config);

  let query =
    supabase
      .from(config.table)
      .select(config.columns.join(","));

  if (config.filter) {
    query =
      query.eq(
        config.filter.column,
        config.filter.value
      );
  }

  if (config.orderBy) {
    query =
      query.order(
        config.orderBy,
        {
          ascending: false
        }
      );
  }

  const { data, error } =
    await query;

  if (error) {
    console.error(error);

    setAdminTableError(
      config,
      error.message
    );

    return;
  }

  renderAdminManageTable(
    data || [],
    config
  );
}

function setAdminTableLoading(config) {
  const thead =
    adminExcelTable.querySelector("thead");

  const tbody =
    adminExcelTable.querySelector("tbody");

  thead.innerHTML = `
    <tr>
      <th>${config.label}</th>
    </tr>
  `;

  tbody.innerHTML = `
    <tr>
      <td>Loading data...</td>
    </tr>
  `;
}

function setAdminTableError(config, message) {
  const thead =
    adminExcelTable.querySelector("thead");

  const tbody =
    adminExcelTable.querySelector("tbody");

  thead.innerHTML = `
    <tr>
      <th>${config.label}</th>
    </tr>
  `;

  tbody.innerHTML = `
    <tr>
      <td class="error">
        Load failed: ${escapeHtml(message)}
      </td>
    </tr>
  `;
}

function renderAdminManageTable(rows, config) {
  const thead =
    adminExcelTable.querySelector("thead");

  const tbody =
    adminExcelTable.querySelector("tbody");

  thead.innerHTML = `
    <tr>
      ${config.columns.map(column => `
        <th>${column}</th>
      `).join("")}
    </tr>
  `;

  if (!rows.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="${config.columns.length}">
          No data yet.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML =
    rows.map(row => {
      const rowId =
        row[config.primaryKey];

      return `
        <tr data-id="${escapeHtml(rowId)}">
          ${config.columns.map(column => {
            const readonly =
              config.readonly.includes(column);

            const rawValue =
              row[column];

            const displayValue =
              formatCellValue(rawValue);

            return `
              <td
                class="${readonly ? "readonly" : ""}"
                data-column="${column}"
                data-original="${escapeHtml(displayValue)}"
                ${readonly ? "" : `contenteditable="true"`}
              >${escapeHtml(displayValue)}</td>
            `;
          }).join("")}
        </tr>
      `;
    }).join("");

  bindAdminEditableCells(config);
}

function bindAdminEditableCells(config) {
  const cells =
    adminExcelTable.querySelectorAll(
      `td[contenteditable="true"]`
    );

  cells.forEach(cell => {
    cell.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        cell.blur();
      }
    });

    cell.addEventListener("blur", async () => {
      const column =
        cell.dataset.column;

      const oldValue =
        cell.dataset.original || "";

      const newDisplayValue =
        cell.innerText.trim();

      if (newDisplayValue === oldValue) {
        return;
      }

      const row =
        cell.closest("tr");

      const id =
        row?.dataset.id;

      if (!id || !column) return;

      const parsedValue =
        parseCellValue(
          newDisplayValue,
          column,
          config
        );

      if (parsedValue.__error) {
        alert(parsedValue.message);
        cell.innerText = oldValue;
        return;
      }

      await updateAdminCell({
        config,
        id,
        column,
        value: parsedValue.value,
        displayValue: newDisplayValue,
        oldValue,
        cell
      });
    });
  });
}

function parseCellValue(value, column, config) {
  if (value === "") {
    return {
      value: null
    };
  }

  if (config.booleanFields.includes(column)) {
    const normalized =
      value.toLowerCase();

    if (
      ["true", "1", "yes", "y"].includes(normalized)
    ) {
      return {
        value: true
      };
    }

    if (
      ["false", "0", "no", "n"].includes(normalized)
    ) {
      return {
        value: false
      };
    }

    return {
      __error: true,
      message: `${column} only accepts true / false`
    };
  }

  if (config.jsonFields.includes(column)) {
    try {
      return {
        value: JSON.parse(value)
      };
    }
    catch {
      if (
        column === "tags" ||
        column === "gallery_urls"
      ) {
        return {
          value: value
            .split(",")
            .map(item => item.trim())
            .filter(Boolean)
        };
      }

      return {
        __error: true,
        message: `${column} must be valid JSON`
      };
    }
  }

  return {
    value
  };
}

async function updateAdminCell({
  config,
  id,
  column,
  value,
  displayValue,
  oldValue,
  cell
}) {
  cell.classList.remove(
    "saved",
    "error"
  );

  cell.classList.add("saving");

  const payload = {
    [column]: value
  };

  if (
    config.columns.includes("updated_at") &&
    column !== "updated_at"
  ) {
    payload.updated_at =
      new Date().toISOString();
  }

  const { error } =
    await supabase
      .from(config.table)
      .update(payload)
      .eq(config.primaryKey, id);

  cell.classList.remove("saving");

  if (error) {
    console.error(error);

    cell.classList.add("error");
    cell.innerText = oldValue;

    setTimeout(() => {
      cell.classList.remove("error");
    }, 1200);

    return;
  }

  cell.dataset.original =
    displayValue;

  cell.classList.add("saved");

  setTimeout(() => {
    cell.classList.remove("saved");
  }, 1000);
}

function formatCellValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (
    typeof value === "object"
  ) {
    return JSON.stringify(value);
  }

  return String(value);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================
   Render Form
========================= */

function renderForm(type) {
  formArea.innerHTML =
    formTemplates[type] || "";

  toggleImageSection(type);

  featureTags = [];

  renderFeatureTags();

  bindFeatureTags();
}

function bindFeatureTags() {
  const input =
    document.getElementById(
      "featureTagInput"
    );

  if (!input) return;

  input.addEventListener("keydown", e => {
    const value =
      input.value.trim();

    const isCreateKey =
      e.key === "Enter" ||
      e.key === ",";

    if (!isCreateKey) return;

    e.preventDefault();

    if (!value) return;

    if (featureTags.length >= 5) {
      alert("Maximum 5 tags");
      return;
    }

    if (
      featureTags.includes(value)
    ) {
      input.value = "";
      return;
    }

    featureTags.push(value);

    input.value = "";

    renderFeatureTags();
  });
}

function renderFeatureTags() {
  const list =
    document.getElementById(
      "featureTagList"
    );

  if (!list) return;

  list.innerHTML = "";

  featureTags.forEach(tag => {
    const item =
      document.createElement("div");

    item.className =
      "studio-tag-item";

    item.innerHTML = `
      <span>${escapeHtml(tag)}</span>
      <button type="button">×</button>
    `;

    item
      .querySelector("button")
      ?.addEventListener("click", () => {
        featureTags =
          featureTags.filter(
            t => t !== tag
          );

        renderFeatureTags();
      });

    list.appendChild(item);
  });
}

/* =========================
   Toggle Image
========================= */

function toggleImageSection(type) {
  const imageSection =
    document.getElementById(
      "studioImageSection"
    );

  if (!imageSection) return;

  imageSection.style.display =
    type === "event" ||
    type === "restaurant" ||
    type === "attraction"
      ? "block"
      : "none";
}

/* =========================
   Upload Images
========================= */

function handleImageUpload(e) {
  const files =
    Array.from(
      e.target.files || []
    );

  files.forEach(file => {
    const reader =
      new FileReader();

    reader.onload = event => {
      uploadedImages.push({
        id: crypto.randomUUID(),
        file,
        url: event.target.result,
        thumbnail: false
      });

      if (uploadedImages.length === 1) {
        uploadedImages[0].thumbnail = true;
      }

      renderImages();
    };

    reader.readAsDataURL(file);
  });

  e.target.value = "";
}

/* =========================
   Preview
========================= */

function handlePreview() {
  const type =
    formType.value;

  if (type === "event") {
    const start =
      getValue("eventStart");

    const end =
      getValue("eventEnd");

    const data = {
      title:
        getValue("eventTitle"),

      location:
        getValue("eventVenue") ||
        getValue("eventAddress"),

      address:
        getValue("eventAddress"),

      date:
        formatEventDateRange(
          start,
          end
        ),

      timeText:
        formatEventTimeRange(
          start,
          end
        ),

      desc:
        getValue("eventSummary"),

      content:
        getValue("eventContent"),

      image:
        getPreviewImage(),

      images:
        getPreviewImages(),

      type: "Event",

      aiNote:
        "Perfect for anyone who wants to experience the city slowly.",

      tags:
        featureTags.length
          ? featureTags
          : ["Relaxing", "Local Vibes"],

      suggestedExperience:
        getSuggestedExperience()
    };

    window.openEventDetail(data);

    return;
  }

  const isRestaurant =
    type === "restaurant";

  const hoursData =
    isRestaurant
      ? getWeeklyHours("restaurant")
      : getWeeklyHours("place");

  const hoursText =
    formatWeeklyHoursPreview(hoursData);

  const data = {
    name:
      isRestaurant
        ? getValue("restaurantName")
        : getValue("placeName"),

    title:
      isRestaurant
        ? getValue("restaurantName")
        : getValue("placeName"),

    address:
      isRestaurant
        ? getValue("restaurantAddress")
        : getValue("placeAddress"),

    intro:
      isRestaurant
        ? getValue("restaurantDescription")
        : getValue("placeDescription"),

    description:
      isRestaurant
        ? getValue("restaurantDescription")
        : getValue("placeDescription"),

    image:
      getPreviewImage(),

    images:
      getPreviewImages(),

    hours:
      hoursText || "Check Before Visiting",

    hoursData,

    phone:
      isRestaurant
        ? getValue("restaurantPhone")
        : getValue("placePhone"),

    type:
      isRestaurant
        ? "Restaurant"
        : "Attraction",

    score: "4.8",

    reviewCount: "128",

    tags:
      featureTags.length
        ? featureTags
        : [
            isRestaurant
              ? getValue("restaurantFood")
              : getValue("placeCategory")
          ].filter(Boolean),

    services:
      featureTags.length
        ? featureTags
        : [
            isRestaurant
              ? getValue("restaurantFood")
              : getValue("placeCategory")
          ].filter(Boolean),

    aiNote:
      "A place made for slowing down and staying awhile."
  };

  window.openDetail(data);
}

/* =========================
   Render Images
========================= */

function renderImages() {
  if (!imageGrid) return;

  imageGrid.innerHTML = "";

  uploadedImages.forEach(image => {
    const card =
      document.createElement("article");

    card.className =
      `
      studio-image-card
      ${image.thumbnail ? "selected" : ""}
      `;

    card.innerHTML = `
      <div class="studio-image-preview">
        <img src="${image.url}" alt="">
      </div>

      <label>
        <input
          type="radio"
          name="thumbnail"
          ${image.thumbnail ? "checked" : ""}
        >
        Use as Thumbnail
      </label>

      <button type="button">
        Remove
      </button>
    `;

    const radio =
      card.querySelector("input");

    radio?.addEventListener("change", () => {
      uploadedImages =
        uploadedImages.map(item => ({
          ...item,
          thumbnail:
            item.id === image.id
        }));

      renderImages();
    });

    const removeBtn =
      card.querySelector("button");

    removeBtn?.addEventListener("click", () => {
      uploadedImages =
        uploadedImages.filter(
          item => item.id !== image.id
        );

      if (
        uploadedImages.length &&
        !uploadedImages.some(item => item.thumbnail)
      ) {
        uploadedImages[0].thumbnail = true;
      }

      renderImages();
    });

    imageGrid.appendChild(card);
  });
}

/* =========================
   Submit
========================= */

async function handleSubmit() {
  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "Uploading...";

    const type =
      formType.value;

    const processedImages =
      await uploadImagesToBackend();

    const formData =
      collectFormData();

    const imageData =
      normalizeImageUrls(processedImages);

    let error;

    if (
      type === "attraction" ||
      type === "restaurant"
    ) {
      const placePayload =
        buildPlacePayload(
          type,
          formData,
          imageData
        );

      const result =
        await supabase
          .from("places")
          .insert(placePayload);

      error = result.error;
    }

    if (type === "event") {
      const eventPayload =
        buildEventPayload(
          formData,
          imageData
        );

      const result =
        await supabase
          .from("events")
          .insert(eventPayload);

      error = result.error;
    }

    if (type === "emergency") {
      const emergencyPayload =
        buildEmergencyPayload(formData);

      const result =
        await supabase
          .from("emergency_contacts")
          .insert(emergencyPayload);

      error = result.error;
    }

    if (type === "government") {
      const governmentPayload =
        buildGovernmentPayload(formData);

      const result =
        await supabase
          .from("government_contacts")
          .insert(governmentPayload);

      error = result.error;
    }

    if (error) {
      console.error(error);
      alert("Upload Failed: " + error.message);
      return;
    }

    alert("Upload Success");

    document
      .getElementById("studioForm")
      ?.reset();

    resetImages();

    featureTags = [];
    renderFeatureTags();

    if (
      document
        .getElementById("studioManagePanel")
        ?.classList
        .contains("active")
    ) {
      loadAdminManageTable();
    }
  }
  catch (error) {
    console.error(error);

    alert("Upload Failed");
  }
  finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Content";
  }
}

function buildPlacePayload(type, data, images) {
  const isPublished =
    document.getElementById("isPublished")
      ?.checked || false;

  const isFeatured =
    document.getElementById("isFeatured")
      ?.checked || false;

  const name =
    data.name || "untitled-place";

  return {
    type,
    slug:
      createSlug(`${data.city}-${name}`),

    name,
    city:
      data.city || "",

    area:
      null,

    address:
      data.address || "",

    short_description:
      data.description || "",

    full_description:
      data.description || "",

    hero_image_url:
      images.hero_image_url,

    card_image_url:
      images.card_image_url,

    gallery_urls:
      images.gallery_urls,

    tags:
      data.featureTags || [],

    opening_hours:
      data.hoursData || [],

    phone:
      data.phone || "",

    website_url:
      null,

    google_map_url:
      null,

    price_level:
      null,

    is_featured:
      isFeatured,

    status:
      isPublished ? "published" : "draft"
  };
}

function buildEventPayload(data, images) {
  const isPublished =
    document.getElementById("isPublished")
      ?.checked || false;

  const isFeatured =
    document.getElementById("isFeatured")
      ?.checked || false;

  const title =
    data.title || "untitled-event";

  return {
    slug:
      createSlug(`${data.city}-${title}`),

    title,
    city:
      data.city || "",

    area:
      data.area || null,

    venue_name:
      data.venueName || null,

    address:
      data.address || "",

    summary:
      data.summary || "",

    content:
      data.content || data.summary || "",

    start_date:
      data.start || null,

    end_date:
      data.end || null,

    time_rule: {
      noEndDate:
        data.noEndDate,

      noEndTime:
        data.noEndTime
    },

    hero_image_url:
      images.hero_image_url,

    card_image_url:
      images.card_image_url,

    gallery_urls:
      images.gallery_urls,

    organizer:
      data.organizer || null,

    ticket_url:
      data.ticketUrl || null,

    google_map_url:
      data.googleMapUrl || null,

    tags:
      data.featureTags || [],

    is_featured:
      isFeatured,

    status:
      isPublished ? "published" : "draft"
  };
}

function buildEmergencyPayload(data) {
  const isPublished =
    document.getElementById("isPublished")
      ?.checked || false;

  return {
    status:
      isPublished ? "published" : "draft",

    unit_type:
      data.unitType || "",

    area:
      data.area || "",

    name:
      data.name || "",

    address:
      data.address || "",

    phone:
      data.phone || ""
  };
}

function buildGovernmentPayload(data) {
  const isPublished =
    document.getElementById("isPublished")
      ?.checked || false;

  return {
    status:
      isPublished ? "published" : "draft",

    unit_type:
      data.unitType || "",

    area:
      data.area || "",

    name:
      data.name || "",

    address:
      data.address || "",

    phone:
      data.phone || "",

    website:
      data.website || ""
  };
}

function normalizeImageUrls(results) {
  if (
    !Array.isArray(results) ||
    !results.length
  ) {
    return {
      hero_image_url: "",
      card_image_url: "",
      gallery_urls: []
    };
  }

  const API_ORIGIN =
    MEDIA_API;

  const toFullUrl = path => {
    if (!path) return "";

    if (
      path.startsWith("http://") ||
      path.startsWith("https://")
    ) {
      return path;
    }

    return `${API_ORIGIN}${path}`;
  };

  const selectedThumbnail =
    uploadedImages.find(
      image => image.thumbnail
    );

  let selectedIndex = 0;

  if (selectedThumbnail) {
    selectedIndex =
      uploadedImages.findIndex(
        image =>
          image.id === selectedThumbnail.id
      );
  }

  const selected =
    results[selectedIndex] || results[0];

  return {
    hero_image_url:
      toFullUrl(
        selected.hero ||
        selected.detail ||
        selected.url
      ),

    card_image_url:
      toFullUrl(
        selected.card ||
        selected.square ||
        selected.url
      ),

    gallery_urls:
      results
        .map(item =>
          toFullUrl(
            item.detail ||
            item.hero ||
            item.url
          )
        )
        .filter(Boolean)
  };
}

function createSlug(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) + "-" + Date.now();
}

/* =========================
   Collect Data
========================= */

function collectFormData() {
  const type =
    formType.value;

  if (type === "attraction") {
    return {
      name:
        getValue("placeName"),

      city:
        getValue("placeCity"),

      category:
        getValue("placeCategory"),

      hoursData:
        getWeeklyHours("place"),

      hours:
        formatWeeklyHoursPreview(
          getWeeklyHours("place")
        ),

      phone:
        getValue("placePhone"),

      address:
        getValue("placeAddress"),

      description:
        getValue("placeDescription"),

      featureTags
    };
  }

  if (type === "restaurant") {
    return {
      name:
        getValue("restaurantName"),

      city:
        getValue("restaurantCity"),

      food:
        getValue("restaurantFood"),

      hoursData:
        getWeeklyHours("restaurant"),

      hours:
        formatWeeklyHoursPreview(
          getWeeklyHours("restaurant")
        ),

      phone:
        getValue("restaurantPhone"),

      address:
        getValue("restaurantAddress"),

      description:
        getValue("restaurantDescription"),

      featureTags
    };
  }

  if (type === "event") {
    return {
      title:
        getValue("eventTitle"),

      city:
        getValue("eventCity"),

      area:
        getValue("eventArea"),

      venueName:
        getValue("eventVenue"),

      address:
        getValue("eventAddress"),

      summary:
        getValue("eventSummary"),

      content:
        getValue("eventContent"),

      start:
        getValue("eventStart"),

      end:
        getValue("eventEnd"),

      noEndDate:
        document.getElementById("eventNoEndDate")
          ?.checked || false,

      noEndTime:
        document.getElementById("eventNoEndTime")
          ?.checked || false,

      organizer:
        getValue("eventOrganizer"),

      ticketUrl:
        getValue("eventTicketUrl"),

      googleMapUrl:
        getValue("eventGoogleMapUrl"),

      featureTags
    };
  }

  if (type === "emergency") {
    return {
      unitType:
        getValue("emergencyType"),

      area:
        getValue("emergencyArea"),

      name:
        getValue("emergencyName"),

      address:
        getValue("emergencyAddress"),

      phone:
        getValue("emergencyPhone")
    };
  }

  if (type === "government") {
    return {
      unitType:
        getValue("governmentType"),

      area:
        getValue("governmentArea"),

      name:
        getValue("governmentName"),

      address:
        getValue("governmentAddress"),

      phone:
        getValue("governmentPhone"),

      website:
        getValue("governmentWebsite")
    };
  }

  return {};
}

/* =========================
   Helpers
========================= */

function formatEventDateRange(start, end) {
  const startText =
    formatDateTimeDate(start);

  const endText =
    formatDateTimeDate(end);

  if (
    startText &&
    endText &&
    startText !== endText
  ) {
    return `${startText} - ${endText}`;
  }

  return startText || endText || "";
}

function getSuggestedExperience() {
  return {
    before:
      "Grab a bite before heading over.",

    during:
      "Take your time and explore slowly.",

    after:
      "Take a walk nearby after the event."
  };
}

function getWeeklyHours(prefix) {
  const days = [
    ["Mon", "Monday"],
    ["Tue", "Tuesday"],
    ["Wed", "Wednesday"],
    ["Thu", "Thursday"],
    ["Fri", "Friday"],
    ["Sat", "Saturday"],
    ["Sun", "Sunday"]
  ];

  return days.map(([key, label]) => {
    const isClosed =
      document.getElementById(
        `${prefix}${key}Closed`
      )?.checked || false;

    return {
      key,
      label,
      closed:
        isClosed,

      open:
        getValue(`${prefix}${key}Open`),

      close:
        getValue(`${prefix}${key}Close`)
    };
  });
}

function formatWeeklyHoursPreview(hoursData) {
  if (!hoursData || !hoursData.length) {
    return "";
  }

  const filled =
    hoursData.filter(day =>
      day.closed ||
      day.open ||
      day.close
    );

  if (!filled.length) {
    return "";
  }

  return filled
    .map(day => {
      if (day.closed) {
        return `${day.key} Closed`;
      }

      if (day.open && day.close) {
        return `${day.key} ${day.open}-${day.close}`;
      }

      return `${day.key} ${day.open || day.close}`;
    })
    .join(" · ");
}

function getValue(id) {
  const el =
    document.getElementById(id);

  return el?.value?.trim() || "";
}

function getPreviewImage() {
  const thumb =
    uploadedImages.find(
      image => image.thumbnail
    );

  if (thumb) {
    return thumb.url;
  }

  return uploadedImages[0]?.url || "";
}

function getPreviewImages() {
  return uploadedImages.map(
    image => image.url
  );
}

function formatDateTimeDate(value) {
  if (!value) return "";

  const date =
    new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-MY",
    {
      year: "numeric",
      month: "short",
      day: "numeric"
    }
  );
}

function formatEventTimeRange(start, end) {
  if (!start && !end) return "";

  const startText =
    formatDateTimeTime(start);

  const endText =
    formatDateTimeTime(end);

  if (startText && endText) {
    return `${startText} - ${endText}`;
  }

  return startText || endText || "";
}

function formatDateTimeTime(value) {
  if (!value) return "";

  const date =
    new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString(
    "en-MY",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}

function resetImages() {
  uploadedImages = [];
  renderImages();
}

async function uploadImagesToBackend() {
  if (!uploadedImages.length) {
    return [];
  }

  const formData =
    new FormData();

  uploadedImages.forEach(image => {
    formData.append(
      "images",
      image.file
    );
  });

  const response =
    await fetch(
      `${MEDIA_API}/api/media/upload`,
      {
        method: "POST",
        body: formData
      }
    );

  if (!response.ok) {
    throw new Error(
      "Media upload failed"
    );
  }

  const data =
    await response.json();

  return data.results || [];
}