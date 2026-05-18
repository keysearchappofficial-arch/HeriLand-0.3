// explore/contribute.js

console.log("✅ contribute.js loaded");

export const contributeItems = [
  {
    type: "place",
    title: "Place",
    text: "Share scenic spots, hidden gems, nature places, or local attractions."
  },
  {
    type: "restaurant",
    title: "Restaurant",
    text: "Recommend local food, cafes, hawker spots, or unique dining experiences."
  },
  {
    type: "event",
    title: "Event",
    text: "Share festivals, cultural events, markets, or local activities."
  },
  {
    type: "culture",
    title: "Culture",
    text: "Introduce local traditions, longhouses, crafts, or cultural experiences."
  },
  {
    type: "travel-tip",
    title: "Travel Tip",
    text: "Help travelers with useful local tips or transportation advice."
  },
  {
    type: "correction",
    title: "Suggest Correction",
    text: "Help improve outdated information or wrong details."
  }
];

export function renderContributePage(){

  console.log("📝 renderContributePage()");

  return `
    <div class="contribute-list">

      ${contributeItems.map(item => `
        <button
          class="contribute-card"
          type="button"
          data-contribute-type="${item.type}"
        >
          <div class="contribute-copy">
            <h4>${item.title}</h4>
            <p>${item.text}</p>
          </div>

          <div class="contribute-arrow">
            →
          </div>
        </button>
      `).join("")}

    </div>
  `;
}

export function bindContributePage(){

  console.log("📝 bindContributePage()");

  document
    .querySelectorAll("[data-contribute-type]")
    .forEach((button) => {

      console.log(
        "📝 contribute button:",
        button.dataset.contributeType
      );

      button.addEventListener("click", () => {

        const type =
          button.dataset.contributeType;

        openContributionForm(type);

      });

    });

  console.log("✅ contribute page bound");
}

export function openContributionForm(type){

  console.log("📝 openContributionForm:", type);

  const avatarSubTitle =
    document.getElementById("avatarSubTitle");

  const avatarSubKicker =
    document.getElementById("avatarSubKicker");

  const avatarSubContent =
    document.getElementById("avatarSubContent");

  if (avatarSubTitle) {
    avatarSubTitle.textContent =
      "Contribute";
  }

  if (avatarSubKicker) {
    avatarSubKicker.textContent =
      "Share with Travelers";
  }

  if (!avatarSubContent) return;

  avatarSubContent.innerHTML = `
    <div class="contribution-form">

      <div class="contribution-form-head">
        ${getContributionTitle(type)}
      </div>

      <div class="contribution-form-grid">
        ${renderContributionFields(type)}
      </div>

      <button
        class="contribution-submit"
        id="contributionSubmitBtn"
        type="button"
        data-type="${type}"
      >
        Submit for Review
      </button>

    </div>
  `;

  bindContributionFormBasic();

  console.log("✅ contribution form opened:", type);
}

function renderContributionFields(type){

  const cityField = `
    <select
      class="contribution-input"
      id="contributionCity"
    >
      <option value="">Select city</option>
      <option value="kuching">Kuching</option>
      <option value="sibu">Sibu</option>
      <option value="miri">Miri</option>
      <option value="bintulu">Bintulu</option>
    </select>
  `;

  const imageUploadField = `
    <label class="contribution-upload">
      <input
        id="contributionImageFile"
        type="file"
        accept="image/*"
        hidden
      >

      <span>＋ Upload Image</span>

      <small id="contributionImageName">
        No image selected
      </small>
    </label>
  `;

  const tagsField = `
    <textarea
      class="contribution-textarea"
      id="contributionTags"
      placeholder="Tags, separated by comma or Enter&#10;e.g. nature, local&#10;family"
    ></textarea>
  `;

  const commonBase = `
    <input
      class="contribution-input"
      id="contributionName"
      placeholder="Name / Title *"
    >

    ${cityField}

    <input
      class="contribution-input"
      id="contributionArea"
      placeholder="Area"
    >
  `;

  if (
    type === "place" ||
    type === "restaurant"
  ) {
    return `
      ${commonBase}

      <input
        class="contribution-input"
        id="contributionAddress"
        placeholder="Address"
      >

      <input
        class="contribution-input"
        id="contributionShortDescription"
        placeholder="Short description for card"
      >

      <textarea
        class="contribution-textarea"
        id="contributionFullDescription"
        placeholder="Full detail for detail page"
      ></textarea>

      <input
        class="contribution-input"
        id="contributionPhone"
        placeholder="Phone"
      >

      <input
        class="contribution-input"
        id="contributionWebsite"
        placeholder="Website URL"
      >

      <input
        class="contribution-input"
        id="contributionMap"
        placeholder="Google Map URL"
      >

      <input
        class="contribution-input"
        id="contributionOpeningHours"
        placeholder="Opening hours, e.g. Daily 9:00 AM - 6:00 PM"
      >

      <select
        class="contribution-input"
        id="contributionPriceLevel"
      >
        <option value="">Price level</option>
        <option value="$">$</option>
        <option value="$$">$$</option>
        <option value="$$$">$$$</option>
      </select>

      ${tagsField}
      ${imageUploadField}
    `;
  }

  if (type === "event") {
    return `
      ${commonBase}

      <input
        class="contribution-input"
        id="contributionVenueName"
        placeholder="Venue name"
      >

      <input
        class="contribution-input"
        id="contributionAddress"
        placeholder="Venue address"
      >

      <input
        class="contribution-input"
        id="contributionShortDescription"
        placeholder="Event summary for card"
      >

      <textarea
        class="contribution-textarea"
        id="contributionFullDescription"
        placeholder="Full event detail"
      ></textarea>

      <input
        class="contribution-input"
        id="contributionEventDate"
        type="date"
      >

      <input
        class="contribution-input"
        id="contributionEventTime"
        placeholder="Event time, e.g. 6:00 PM"
      >

      <input
        class="contribution-input"
        id="contributionOrganizer"
        placeholder="Organizer"
      >

      <input
        class="contribution-input"
        id="contributionTicket"
        placeholder="Ticket / More Info URL"
      >

      <input
        class="contribution-input"
        id="contributionMap"
        placeholder="Google Map URL"
      >

      ${tagsField}
      ${imageUploadField}
    `;
  }

  if (type === "culture") {
    return `
      ${commonBase}

      <input
        class="contribution-input"
        id="contributionAddress"
        placeholder="Related place / address"
      >

      <input
        class="contribution-input"
        id="contributionShortDescription"
        placeholder="Short culture intro for card"
      >

      <textarea
        class="contribution-textarea"
        id="contributionFullDescription"
        placeholder="Introduction"
      ></textarea>

      <textarea
        class="contribution-textarea"
        id="contributionCulturalBackground"
        placeholder="Cultural background"
      ></textarea>

      <textarea
        class="contribution-textarea"
        id="contributionWhatToNotice"
        placeholder="What should travelers notice?"
      ></textarea>

      <textarea
        class="contribution-textarea"
        id="contributionEtiquetteTips"
        placeholder="Etiquette and tips"
      ></textarea>

      <input
        class="contribution-input"
        id="contributionMap"
        placeholder="Google Map URL"
      >

      ${tagsField}
      ${imageUploadField}
    `;
  }

  if (type === "travel-tip") {
    return `
      ${commonBase}

      <input
        class="contribution-input"
        id="contributionShortDescription"
        placeholder="Short travel tip for card"
      >

      <textarea
        class="contribution-textarea"
        id="contributionFullDescription"
        placeholder="Full traveler experience / tip"
      ></textarea>

      <textarea
        class="contribution-textarea"
        id="contributionWhy"
        placeholder="Why is this useful?"
      ></textarea>

      <input
        class="contribution-input"
        id="contributionMap"
        placeholder="Related Google Map URL"
      >

      ${tagsField}
      ${imageUploadField}
    `;
  }

  if (type === "correction") {
    return `
      <select
        class="contribution-input"
        id="correctionTargetType"
      >
        <option value="">Target type</option>
        <option value="detail">Place / Restaurant Detail</option>
        <option value="event-detail">Event Detail</option>
        <option value="culture-detail">Culture Detail</option>
        <option value="traveler-detail">Traveler Experience Detail</option>
      </select>

      <input
        class="contribution-input"
        id="correctionTargetSlug"
        placeholder="Target slug, if known"
      >

      <input
        class="contribution-input"
        id="correctionTargetTitle"
        placeholder="Target title / place name *"
      >

      <select
        class="contribution-input"
        id="correctionField"
      >
        <option value="">What should be corrected?</option>
        <option value="title">Title / Name</option>
        <option value="address">Address</option>
        <option value="opening_hours">Opening Hours</option>
        <option value="phone">Phone</option>
        <option value="description">Description</option>
        <option value="map">Map Link</option>
        <option value="image">Image</option>
        <option value="other">Other</option>
      </select>

      <textarea
        class="contribution-textarea"
        id="correctionDetail"
        placeholder="What is wrong, and what should it be changed to? *"
      ></textarea>

      <input
        class="contribution-input"
        id="correctionSourceUrl"
        placeholder="Source URL / proof, if any"
      >

      <textarea
        class="contribution-textarea"
        id="contributionWhy"
        placeholder="Why do you suggest this correction?"
      ></textarea>
    `;
  }

  return `
    ${commonBase}

    <input
      class="contribution-input"
      id="contributionShortDescription"
      placeholder="Short description"
    >

    <textarea
      class="contribution-textarea"
      id="contributionFullDescription"
      placeholder="Full description"
    ></textarea>

    ${tagsField}
    ${imageUploadField}
  `;
}

function bindContributionFormBasic(){

  console.log("📝 bindContributionFormBasic()");

  const imageInput =
    document.getElementById("contributionImageFile");

  const imageName =
    document.getElementById("contributionImageName");

  imageInput?.addEventListener("change", () => {

    const file =
      imageInput.files?.[0];

    if (imageName) {
      imageName.textContent =
        file ? file.name : "No image selected";
    }

    console.log(
      "🖼️ contribution image selected:",
      file?.name || null
    );
  });

  const submitBtn =
    document.getElementById("contributionSubmitBtn");

  submitBtn?.addEventListener("click", () => {
    console.log(
      "📝 submit clicked, not wired yet:",
      submitBtn.dataset.type
    );

    alert("Submit wiring will be connected next.");
  });
}

function getContributionTitle(type){

  const map = {
    place: "Suggest a Place",
    restaurant: "Suggest a Restaurant",
    event: "Submit an Event",
    culture: "Share Culture",
    "travel-tip": "Share Travel Tip",
    correction: "Suggest Correction"
  };

  return map[type] || "Contribute";
}