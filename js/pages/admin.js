import {
  loadComponent
} from "../components.js";

import {
  initDetail
} from "../detail.js";

import {
  initEventDetail
} from "../event-detail.js";

// admin-studio.js

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

  /* =========================
     Attraction
  ========================= */

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