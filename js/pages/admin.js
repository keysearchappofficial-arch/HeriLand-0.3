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

let uploadedImages = [];
let featureTags = [];

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
              <input
                type="checkbox"
                id="${prefix}${key}Closed"
              >
              <span>${label}</span>
            </label>

            <input
              type="time"
              id="${prefix}${key}Open"
            >

            <span class="studio-time-separator">-</span>

            <input
              type="time"
              id="${prefix}${key}Close"
            >

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
    <div
      class="studio-tag-list"
      id="featureTagList"
    ></div>

    <input
      type="text"
      id="featureTagInput"
      placeholder="Type tag and press Enter"
    >
  </div>

  <small>
    Max 5 tags. Press Enter or comma to add.
  </small>
</div>

${weeklyHoursTemplate("place")}
        
<label class="studio-field">
  <span>Phone</span>

  <input
    type="text"
    id="placePhone"
    placeholder="+60 12-345 6789"
  >
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
    <div
      class="studio-tag-list"
      id="featureTagList"
    ></div>

    <input
      type="text"
      id="featureTagInput"
      placeholder="Type tag and press Enter"
    >
  </div>

  <small>
    Max 5 tags. Press Enter or comma to add.
  </small>
</div>

${weeklyHoursTemplate("restaurant")}
        
<label class="studio-field">
  <span>Phone</span>

  <input
    type="text"
    id="restaurantPhone"
    placeholder="+60 12-345 6789"
  >
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
        
<div class="studio-field">
  <span>Feature Tags</span>

  <div class="studio-tag-box">
    <div
      class="studio-tag-list"
      id="featureTagList"
    ></div>

    <input
      type="text"
      id="featureTagInput"
      placeholder="Type tag and press Enter"
    >
  </div>

  <small>
    Max 5 tags. Press Enter or comma to add.
  </small>
</div>

 <label class="studio-field">
  <span>Start Time</span>

  <input
    type="datetime-local"
    id="eventStart"
  >
</label>

<label class="studio-field">
  <span>End Time</span>

  <input
    type="datetime-local"
    id="eventEnd"
  >
</label>

      </div>

      <div class="studio-grid one">

        <label class="studio-field">
          <span>Location</span>
          <input type="text" id="eventLocation">
        </label>

        <label class="studio-field">
          <span>Description</span>
          <textarea id="eventDescription"></textarea>
        </label>
        
<div class="studio-grid one">

  <label class="studio-field">
    <span>Before Event</span>
    <input
      type="text"
      id="eventBefore"
      placeholder="Grab a bite before heading over."
    >
  </label>

  <label class="studio-field">
    <span>During Event</span>
    <input
      type="text"
      id="eventDuring"
      placeholder="Take your time and explore slowly."
    >
  </label>

  <label class="studio-field">
    <span>After Event</span>
    <input
      type="text"
      id="eventAfter"
      placeholder="Take a walk nearby after the event."
    >
  </label>

</div>

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
          <input
            type="text"
            id="emergencyName"
            placeholder="Sibu Hospital"
          >
        </label>

        <label class="studio-field">
          <span>Address</span>
          <input
            type="text"
            id="emergencyAddress"
            placeholder="Full address"
          >
        </label>

        <label class="studio-field">
          <span>Phone</span>
          <input
            type="text"
            id="emergencyPhone"
            placeholder="084-343333"
          >
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
          <input
            type="text"
            id="governmentName"
            placeholder="Sarawak Tourism Board"
          >
        </label>

        <label class="studio-field">
          <span>Address</span>
          <input
            type="text"
            id="governmentAddress"
            placeholder="Full address"
          >
        </label>

        <label class="studio-field">
          <span>Phone</span>
          <input
            type="text"
            id="governmentPhone"
            placeholder="+60..."
          >
        </label>

        <label class="studio-field">
          <span>Website</span>
          <input
            type="url"
            id="governmentWebsite"
            placeholder="https://..."
          >
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

  /* =========================
     Move Preview To Body
  ========================= */

  const detailPage =
    document.getElementById("detailPage");

  const eventDetailPage =
    document.getElementById("eventDetailPage");

  if (detailPage) {
    document.body.appendChild(
      detailPage
    );
  }

  if (eventDetailPage) {
    document.body.appendChild(
      eventDetailPage
    );
  }

  /* =========================
     Init Detail
  ========================= */

  initDetail();
  initEventDetail();

}

async function initStudio() {

  await loadPreviewComponents();

  renderForm(
    formType.value
  );

  bindEvents();

}

initStudio();

/* =========================
   Events
========================= */

function bindEvents() {

  formType?.addEventListener(
    "change",
    e => {

      renderForm(
        e.target.value
      );

      resetImages();

    }
  );

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

  input.addEventListener(
    "keydown",
    e => {

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

    }
  );

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
      <span>${tag}</span>

      <button type="button">
        ×
      </button>
    `;

    item
      .querySelector("button")
      ?.addEventListener(
        "click",
        () => {

          featureTags =
            featureTags.filter(
              t => t !== tag
            );

          renderFeatureTags();

        }
      );

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

      renderImages();

    };

    reader.readAsDataURL(file);

  });

}

/* =========================
   Preview
========================= */

function handlePreview() {

  const type =
    formType.value;

  /* =========================
     Event
  ========================= */

  if (type === "event") {

    const data = {

      title:
        getValue("eventTitle"),

      location:
        getValue("eventLocation"),

date:
  formatEventDateRange(
    getValue("eventStart"),
    getValue("eventEnd")
  ),

timeText:
  formatEventTimeRange(
    getValue("eventStart"),
    getValue("eventEnd")
  ),

      desc:
        getValue("eventDescription"),

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
    
    suggestedExperience: getSuggestedExperience()

    };

    window.openEventDetail(data);

    return;

  }

  /* =========================
     Attraction / Restaurant
  ========================= */

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

    radio?.addEventListener(
      "change",
      () => {

        uploadedImages =
          uploadedImages.map(item => ({
            ...item,
            thumbnail:
              item.id === image.id
          }));

        renderImages();

      }
    );

    const removeBtn =
      card.querySelector("button");

    removeBtn?.addEventListener(
      "click",
      () => {

        uploadedImages =
          uploadedImages.filter(
            item => item.id !== image.id
          );

        renderImages();

      }
    );

    imageGrid.appendChild(card);

  });

}

/* =========================
   Submit
========================= */

async function handleSubmit() {

  try {

    const processedImages =
      await uploadImagesToBackend();

    const payload = {

      type:
        formType.value,

      data:
        collectFormData(),

      images:
        processedImages

    };

    console.log(
      "[submit]",
      payload
    );

    alert(
      "Upload Success"
    );

  }
  catch (error) {

    console.error(error);

    alert(
      "Upload Failed"
    );

  }

}

/* =========================
   Collect Data
========================= */

function collectFormData() {

  const type =
    formType.value;

if (type === "attraction") {
  return {
    name: getValue("placeName"),
    city: getValue("placeCity"),
    category: getValue("placeCategory"),
hoursData: getWeeklyHours("place"),
hours: formatWeeklyHoursPreview(
  getWeeklyHours("place")
),
    phone: getValue("placePhone"),
    address: getValue("placeAddress"),
    description: getValue("placeDescription"),
    featureTags
  };
}

if (type === "restaurant") {
  return {
    name: getValue("restaurantName"),
    city: getValue("restaurantCity"),
    food: getValue("restaurantFood"),
hoursData: getWeeklyHours("restaurant"),
hours: formatWeeklyHoursPreview(
  getWeeklyHours("restaurant")
),
    phone: getValue("restaurantPhone"),
    address: getValue("restaurantAddress"),
    description: getValue("restaurantDescription"),
    featureTags
  };
}

if (type === "event") {
  return {
    title: getValue("eventTitle"),
    city: getValue("eventCity"),
    start: getValue("eventStart"),
    end: getValue("eventEnd"),
    date: formatDateTimeDate(
      getValue("eventStart")
    ),
    timeText: formatEventTimeRange(
      getValue("eventStart"),
      getValue("eventEnd")
    ),
    location: getValue("eventLocation"),
    description: getValue("eventDescription"),
    featureTags
  };
}

  if (type === "emergency") {
    return {
      unitType: getValue("emergencyType"),
      area: getValue("emergencyArea"),
      name: getValue("emergencyName"),
      address: getValue("emergencyAddress"),
      phone: getValue("emergencyPhone")
    };
  }

  if (type === "government") {
    return {
      unitType: getValue("governmentType"),
      area: getValue("governmentArea"),
      name: getValue("governmentName"),
      address: getValue("governmentAddress"),
      phone: getValue("governmentPhone"),
      website: getValue("governmentWebsite")
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
      getValue("eventBefore") ||
      "Grab a bite before heading over.",

    during:
      getValue("eventDuring") ||
      "Take your time and explore slowly.",

    after:
      getValue("eventAfter") ||
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
      closed: isClosed,
      open: getValue(`${prefix}${key}Open`),
      close: getValue(`${prefix}${key}Close`)
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
      "http://127.0.0.1:14800/api/media/upload",
      {
        method: "POST",
        body: formData
      }
    );

  const data =
    await response.json();

  return data.results;
}
