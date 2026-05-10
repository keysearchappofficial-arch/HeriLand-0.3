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
      title: "問題標題",
      message: "問題說明",
      address: "相關頁面 / 地點",
      hours: "時間",
      tags: "相關特色"
    },
    place: {
      title: "景點名稱",
      message: "景點說明",
      address: "景點地址",
      hours: "開放時間",
      tags: "特色"
    },
    restaurant: {
      title: "餐廳名稱",
      message: "餐廳說明",
      address: "餐廳地址",
      hours: "營業時間",
      tags: "特色 / 主打料理"
    },
    suggestion: {
      title: "建議標題",
      message: "優化建議",
      address: "相關頁面",
      hours: "時間",
      tags: "相關特色"
    },
    business: {
      title: "商家名稱",
      message: "合作說明",
      address: "商家地址",
      hours: "營業時間",
      tags: "商家特色"
    },
    other: {
      title: "標題",
      message: "內容說明",
      address: "相關位置",
      hours: "時間",
      tags: "特色"
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
      title: "例如：Sibu 餐廳電話錯誤",
      message: "請描述你遇到的問題，例如資訊錯誤、圖片不對、連結失效等",
      address: "相關頁面、地點名稱或網址",
      hours: "",
      tags: "",
      contact: "你的 Email / WhatsApp / IG，可選填"
    },
    place: {
      title: "例如：Sibu Lake Garden",
      message: "為什麼推薦這個景點？適合什麼時候去？",
      address: "景點地址、區域或 Google Maps 名稱",
      hours: "例如：全天開放 / 早上至傍晚",
      tags: "例如：公園、散步、親子、河邊"
    },
    restaurant: {
      title: "例如：Rasa Sayang Cafe",
      message: "推薦原因、主打料理或用餐感受",
      address: "餐廳地址、區域或 Google Maps 名稱",
      hours: "例如：早上至中午 / 10:00 AM – 9:00 PM",
      tags: "例如：Kampua Mee、早餐、在地小店"
    },
    suggestion: {
      title: "例如：城市頁希望可以加入篩選",
      message: "請描述你希望 HeriLand 怎麼優化",
      address: "",
      hours: "",
      tags: "",
      contact: "你的 Email / WhatsApp / IG，可選填"
    },
    business: {
      title: "例如：某某餐廳 / 某某旅遊服務",
      message: "請簡單介紹商家與合作方式",
      address: "商家地址或服務區域",
      hours: "營業時間或可聯絡時間",
      tags: "例如：餐廳、咖啡、活動、旅遊服務",
      contact: "請留下 Email / WhatsApp / IG"
    },
    other: {
      title: "請簡單描述主題",
      message: "請留下你的想法",
      address: "",
      hours: "",
      tags: "",
      contact: "你的 Email / WhatsApp / IG，可選填"
    }
  };

  const current = map[type] || map.problem;

  if (title) title.placeholder = current.title || "";
  if (message) message.placeholder = current.message || "";
  if (address) address.placeholder = current.address || "";
  if (hours) hours.placeholder = current.hours || "";
  if (tags) tags.placeholder = current.tags || "";
  if (contact) contact.placeholder = current.contact || "你的 Email / WhatsApp / IG，可選填";
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
    alert("請輸入標題");
    return;
  }

  if (!message) {
    alert("請輸入內容說明");
    return;
  }

  if (type === "restaurant" && !address) {
    alert("請輸入餐廳地址或 Google Maps 名稱");
    return;
  }

  if (type === "place" && !address) {
    alert("請輸入景點地址或 Google Maps 名稱");
    return;
  }

  if (type === "business" && !contact) {
    alert("商家合作請留下聯絡方式");
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

  alert("感謝你的回饋，HeriLand 已收到你的提交。");

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