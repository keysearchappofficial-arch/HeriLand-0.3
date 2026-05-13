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

        <label class="studio-field">
          <span>Opening Hours</span>
          <input type="text" id="placeHours">
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

        <label class="studio-field">
          <span>Opening Hours</span>
          <input type="text" id="restaurantHours">
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
          <span>Date</span>
          <input type="date" id="eventDate">
        </label>

        <label class="studio-field">
          <span>Time</span>
          <input type="text" id="eventTime">
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
        getValue("eventDate"),

      timeText:
        getValue("eventTime"),

      desc:
        getValue("eventDescription"),

      image:
        getPreviewImage(),

      images:
        getPreviewImages(),

      type: "Event",

      aiNote:
        "Perfect for anyone who wants to experience the city slowly.",

      tags: [
        "Relaxing",
        "Night",
        "Local Vibes"
      ]

    };

    window.openEventDetail(data);

    return;

  }

  /* =========================
     Attraction / Restaurant
  ========================= */

  const isRestaurant =
    type === "restaurant";

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
      isRestaurant
        ? getValue("restaurantHours")
        : getValue("placeHours"),

    phone:
      "+60 12-345 6789",

    type:
      isRestaurant
        ? "Restaurant"
        : "Attraction",

    score: "4.8",

    reviewCount: "128",

    tags:
      isRestaurant
        ? [getValue("restaurantFood")]
        : [getValue("placeCategory")],

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

function handleSubmit() {

  const payload = {

    type:
      formType.value,

    data:
      collectFormData(),

    images:
      uploadedImages

  };

  console.log(
    "[submit]",
    payload
  );

  alert(
    "Ready to send backend"
  );

}

/* =========================
   Collect Data
========================= */

function collectFormData() {

  return {
    title:
      getValue("placeName") ||
      getValue("restaurantName") ||
      getValue("eventTitle")
  };

}

/* =========================
   Helpers
========================= */

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

function resetImages() {

  uploadedImages = [];

  renderImages();

}