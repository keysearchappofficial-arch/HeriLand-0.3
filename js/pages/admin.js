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

  /* =========================
     Restaurant
  ========================= */

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

  /* =========================
     Event
  ========================= */

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
  `,

  /* =========================
     Emergency Contact
  ========================= */

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
            <option value="hospital">
              Hospital
            </option>

            <option value="police">
              Police
            </option>

            <option value="fire">
              Fire Department
            </option>

            <option value="embassy">
              Embassy
            </option>
          </select>
        </label>

        <label class="studio-field">
          <span>Area</span>

          <select id="emergencyArea">
            <option value="kuching">Kuching</option>
            <option value="sibu">Sibu</option>
            <option value="miri">Miri</option>
            <option value="bintulu">Bintulu</option>
          </select>
        </label>

      </div>

      <div class="studio-grid one">

        <label class="studio-field">
          <span>Unit Name</span>
          <input type="text" id="emergencyName">
        </label>

        <label class="studio-field">
          <span>Address</span>
          <input type="text" id="emergencyAddress">
        </label>

        <label class="studio-field">
          <span>Phone</span>
          <input type="text" id="emergencyPhone">
        </label>

      </div>

    </div>
  `,

  /* =========================
     Government Contact
  ========================= */

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
            <option value="tourism">
              Tourism Office
            </option>

            <option value="immigration">
              Immigration
            </option>

            <option value="cityhall">
              City Hall
            </option>

            <option value="transport">
              Transport Office
            </option>
          </select>
        </label>

        <label class="studio-field">
          <span>Area</span>

          <select id="governmentArea">
            <option value="kuching">Kuching</option>
            <option value="sibu">Sibu</option>
            <option value="miri">Miri</option>
            <option value="bintulu">Bintulu</option>
          </select>
        </label>

      </div>

      <div class="studio-grid one">

        <label class="studio-field">
          <span>Unit Name</span>
          <input type="text" id="governmentName">
        </label>

        <label class="studio-field">
          <span>Address</span>
          <input type="text" id="governmentAddress">
        </label>

        <label class="studio-field">
          <span>Phone</span>
          <input type="text" id="governmentPhone">
        </label>

        <label class="studio-field">
          <span>Website</span>
          <input type="text" id="governmentWebsite">
        </label>

      </div>

    </div>
  `

};

/* =========================
   Init
========================= */

function initStudio() {

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
   Toggle Image Upload
========================= */

function toggleImageSection(type) {

  const imageSection =
    document.getElementById("studioImageSection");

  if (!imageSection) return;

  const noImageTypes = [
    "emergency",
    "government"
  ];

  imageSection.style.display =
    noImageTypes.includes(type)
      ? "none"
      : "block";

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

  const type =
    formType.value;

  const payload = {
    type,
    ...collectFormData(type),

    images:
      uploadedImages.map(image => ({
        name:
          image.file.name,

        thumbnail:
          image.thumbnail
      }))
  };

  console.log(
    "[studio submit]",
    payload
  );

  alert(
    "Ready to send backend"
  );

}

/* =========================
   Collect Form Data
========================= */

function collectFormData(type) {

  /* =========================
     Attraction
  ========================= */

  if (type === "attraction") {

    return {
      name:
        getValue("placeName"),

      city:
        getValue("placeCity"),

      category:
        getValue("placeCategory"),

      hours:
        getValue("placeHours"),

      address:
        getValue("placeAddress"),

      description:
        getValue("placeDescription")
    };

  }

  /* =========================
     Restaurant
  ========================= */

  if (type === "restaurant") {

    return {
      name:
        getValue("restaurantName"),

      city:
        getValue("restaurantCity"),

      food:
        getValue("restaurantFood"),

      hours:
        getValue("restaurantHours"),

      address:
        getValue("restaurantAddress"),

      description:
        getValue("restaurantDescription")
    };

  }

  /* =========================
     Event
  ========================= */

  if (type === "event") {

    return {
      title:
        getValue("eventTitle"),

      city:
        getValue("eventCity"),

      date:
        getValue("eventDate"),

      time:
        getValue("eventTime"),

      location:
        getValue("eventLocation"),

      description:
        getValue("eventDescription")
    };

  }

  /* =========================
     Emergency
  ========================= */

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

  /* =========================
     Government
  ========================= */

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

function getValue(id) {

  const el =
    document.getElementById(id);

  return el?.value?.trim() || "";

}

function resetImages() {

  uploadedImages = [];

  renderImages();

}