const FIELD_RULES = {
  problem: ["title", "message", "address", "images", "contact"],
  place: ["title", "message", "address", "tags", "images", "contact"],
  restaurant: ["title", "message", "address", "hours", "tags", "images", "contact"],
  suggestion: ["title", "message", "images", "contact"],
  business: ["title", "message", "address", "hours", "tags", "images", "contact"],
  other: ["title", "message", "images", "contact"]
};

function initFeedbackPage() {
  bindMobileMenu();
  bindFeedbackType();
  bindFeedbackSubmit();
  updateFeedbackFields();
}

function bindFeedbackType() {
  const typeSelect = document.getElementById("feedbackType");

  typeSelect?.addEventListener("change", updateFeedbackFields);
}

function updateFeedbackFields() {
  const type =
    document.getElementById("feedbackType")?.value || "problem";

  const visibleFields =
    FIELD_RULES[type] || FIELD_RULES.problem;

  document.querySelectorAll("[data-field]").forEach(field => {
    const key = field.dataset.field;

    field.style.display =
      visibleFields.includes(key) ? "grid" : "none";
  });

  updateFeedbackLabels(type);
  updateFeedbackPlaceholders(type);
}

function updateFeedbackLabels(type) {
  const titleLabel =
    document.querySelector('[data-field="title"] label');

  const messageLabel =
    document.querySelector('[data-field="message"] label');

  const addressLabel =
    document.querySelector('[data-field="address"] label');

  const hoursLabel =
    document.querySelector('[data-field="hours"] label');

  const tagsLabel =
    document.querySelector('[data-field="tags"] label');

  const labelMap = {
problem: {
  title: "Issue Title",
  message: "Issue Details",
  address: "Related Page / Place",
  hours: "Time",
  tags: "Related Highlights"
},
place: {
  title: "Place Name",
  message: "Place Details",
  address: "Place Address",
  hours: "Opening Hours",
  tags: "Highlights"
},
restaurant: {
  title: "Restaurant Name",
  message: "Restaurant Details",
  address: "Restaurant Address",
  hours: "Opening Hours",
  tags: "Highlights / Signature Dishes"
},
suggestion: {
  title: "Suggestion Title",
  message: "Suggestion Details",
  address: "Related Page",
  hours: "Time",
  tags: "Related Highlights"
},
business: {
  title: "Business Name",
  message: "Partnership Details",
  address: "Business Address",
  hours: "Opening Hours",
  tags: "Business Highlights"
},
other: {
  title: "Title",
  message: "Details",
  address: "Related Location",
  hours: "Time",
  tags: "Highlights"
}
  };

  const current = labelMap[type] || labelMap.problem;

  if (titleLabel) titleLabel.textContent = current.title;
  if (messageLabel) messageLabel.textContent = current.message;
  if (addressLabel) addressLabel.textContent = current.address;
  if (hoursLabel) hoursLabel.textContent = current.hours;
  if (tagsLabel) tagsLabel.textContent = current.tags;
}

function updateFeedbackPlaceholders(type) {
  const title =
    document.getElementById("feedbackTitle");

  const message =
    document.getElementById("feedbackMessage");

  const address =
    document.getElementById("feedbackAddress");

  const hours =
    document.getElementById("feedbackHours");

  const tags =
    document.getElementById("feedbackTags");

  const contact =
    document.getElementById("feedbackContact");

  const map = {
problem: {
  title: "Example: Wrong phone number for a Sibu restaurant",
  message: "Tell us what went wrong, such as incorrect information, wrong images, or broken links.",
  address: "Related page, place name, or URL",
  hours: "",
  tags: "",
  contact: "Your Email / WhatsApp / IG Optional"
},
place: {
  title: "Example: Sibu Lake Garden",
  message: "Why do you recommend this place? When is the best time to visit?",
  address: "Place address, area, or Google Maps name",
  hours: "Example: Open all day / Morning to evening",
  tags: "Example: Park, walking, family, riverside"
},
restaurant: {
  title: "Example: Rasa Sayang Cafe",
  message: "Why do you recommend it? Signature dishes or dining experience",
  address: "Restaurant address, area, or Google Maps name",
  hours: "Example: Morning to noon / 10:00 AM – 9:00 PM",
  tags: "Example: Kampua Mee, breakfast, local shop"
},
suggestion: {
  title: "Example: Add filters to the city page",
  message: "Tell us how HeriLand could be improved",
  address: "",
  hours: "",
  tags: "",
  contact: "Your Email / WhatsApp / IG Optional"
},
business: {
  title: "Example: A restaurant / travel service",
  message: "Briefly introduce your business and partnership idea",
  address: "Business address or service area",
  hours: "Opening hours or contact hours",
  tags: "Example: Restaurant, coffee, events, travel service",
  contact: "Please leave your Email / WhatsApp / IG"
},
other: {
  title: "Briefly describe the topic",
  message: "Share your thoughts",
  address: "",
  hours: "",
  tags: "",
  contact: "Your Email / WhatsApp / IG Optional"
}
  };

  const current = map[type] || map.problem;

  if (title) title.placeholder = current.title || "";
  if (message) message.placeholder = current.message || "";
  if (address) address.placeholder = current.address || "";
  if (hours) hours.placeholder = current.hours || "";
  if (tags) tags.placeholder = current.tags || "";
  if (contact) contact.placeholder = current.contact || "Your Email / WhatsApp / IG Optional";
}

function bindFeedbackSubmit() {
  const submitBtn =
    document.getElementById("feedbackSubmitBtn");

  submitBtn?.addEventListener("click", handleFeedbackSubmit);
}

function handleFeedbackSubmit() {
  const type = getValue("feedbackType");
  const title = getValue("feedbackTitle");
  const message = getValue("feedbackMessage");
  const address = getValue("feedbackAddress");
  const hours = getValue("feedbackHours");
  const tags = getValue("feedbackTags");
  const contact = getValue("feedbackContact");

  const imageInput =
    document.getElementById("feedbackImages");

  const files =
    imageInput?.files || [];

  if (!title) {
    alert("Please enter a title.");
    return;
  }

  if (!message) {
    alert("Please enter the details.");
    return;
  }

  if (type === "restaurant" && !address) {
    alert("Please enter the restaurant address or Google Maps name.");
    return;
  }

  if (type === "place" && !address) {
    alert("Please enter the place address or Google Maps name.");
    return;
  }

  if (type === "business" && !contact) {
    alert("Please leave your contact details for business partnerships.");
    return;
  }

  const payload = {
    type,
    title,
    message,
    address,
    hours,
    tags,
    contact,
    images: Array.from(files).map(file => file.name),
    createdAt: new Date().toISOString()
  };

  console.log("[feedback]", payload);

  alert("Thank you. HeriLand has received your feedback.");

  resetFeedbackForm();
}

function getValue(id) {
  const el = document.getElementById(id);

  if (!el) return "";

  return el.value?.trim?.() || el.value || "";
}

function resetFeedbackForm() {
  const ids = [
    "feedbackTitle",
    "feedbackMessage",
    "feedbackAddress",
    "feedbackHours",
    "feedbackTags",
    "feedbackContact",
    "feedbackImages"
  ];

  ids.forEach(id => {
    const el = document.getElementById(id);

    if (el) el.value = "";
  });

  const type = document.getElementById("feedbackType");

  if (type) {
    type.value = "problem";
  }

  updateFeedbackFields();
}

function bindMobileMenu() {
  const menu = document.querySelector(".mobile-menu");
  const openBtn = document.getElementById("mobileMenuBtn");
  const closeBtn = document.getElementById("mobileMenuClose");

  if (!menu || !openBtn || !closeBtn) return;

  openBtn.addEventListener("click", () => {
    menu.classList.add("show");
    document.body.style.overflow = "hidden";
  });

  closeBtn.addEventListener("click", () => {
    menu.classList.remove("show");
    document.body.style.overflow = "";
  });

  menu.addEventListener("click", e => {
    if (e.target === menu) {
      menu.classList.remove("show");
      document.body.style.overflow = "";
    }
  });
}

let pageStarted = false;

function startPage() {
  if (pageStarted) return;

  pageStarted = true;

  console.log("[feedback] init");

  initFeedbackPage();
}

if (window.componentsLoaded) {
  startPage();
}
else {
  window.addEventListener("componentsReady", startPage);
}
