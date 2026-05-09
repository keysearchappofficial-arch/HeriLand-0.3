const feedbackType =
  document.getElementById("feedbackType");

const feedbackMessage =
  document.getElementById("feedbackMessage");

const feedbackEmail =
  document.getElementById("feedbackEmail");

const feedbackSubmitBtn =
  document.getElementById("feedbackSubmitBtn");

/* =========================
   Submit
========================= */

function submitFeedback() {

  const type =
    feedbackType?.value || "other";

  const message =
    feedbackMessage?.value.trim();

  const email =
    feedbackEmail?.value.trim();

  if (!message) {

    alert("請輸入 feedback 內容");

    feedbackMessage?.focus();

    return;
  }

  /* =========================
     Demo Payload
  ========================= */

  const payload = {
    type,
    message,
    email,
    createdAt:
      new Date().toISOString()
  };

  console.log(
    "[feedback]",
    payload
  );

  /* =========================
     Success
  ========================= */

  alert("感謝你的 feedback！");

  if (feedbackMessage) {
    feedbackMessage.value = "";
  }

  if (feedbackEmail) {
    feedbackEmail.value = "";
  }

  if (feedbackType) {
    feedbackType.value = "issue";
  }

}

/* =========================
   Bind
========================= */

function bindFeedback() {

  if (!feedbackSubmitBtn) return;

  feedbackSubmitBtn.addEventListener(
    "click",
    submitFeedback
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

function initFeedbackPage() {

  bindFeedback();
  bindMobileMenu();

}

/* =========================
   Start
========================= */

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

  window.addEventListener(
    "componentsReady",
    startPage
  );

}