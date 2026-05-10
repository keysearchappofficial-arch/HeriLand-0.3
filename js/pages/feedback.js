function initFeedbackPage() {

  bindMobileMenu();

  bindFeedbackSubmit();

}

/* =========================
   Submit
========================= */

function bindFeedbackSubmit() {

  const submitBtn =
    document.getElementById(
      "feedbackSubmitBtn"
    );

  if (!submitBtn) return;

  submitBtn.addEventListener(
    "click",
    handleFeedbackSubmit
  );

}

function handleFeedbackSubmit() {

  const type =
    document.getElementById(
      "feedbackType"
    )?.value || "";

  const title =
    document.getElementById(
      "feedbackTitle"
    )?.value.trim() || "";

  const message =
    document.getElementById(
      "feedbackMessage"
    )?.value.trim() || "";

  const address =
    document.getElementById(
      "feedbackAddress"
    )?.value.trim() || "";

  const hours =
    document.getElementById(
      "feedbackHours"
    )?.value.trim() || "";

  const tags =
    document.getElementById(
      "feedbackTags"
    )?.value.trim() || "";

  const contact =
    document.getElementById(
      "feedbackContact"
    )?.value.trim() || "";

  const imageInput =
    document.getElementById(
      "feedbackImages"
    );

  const files =
    imageInput?.files || [];

  /* =========================
     Validation
  ========================= */

  if (!title) {

    alert("請輸入標題");

    return;

  }

  if (!message) {

    alert("請輸入內容說明");

    return;

  }

  /* =========================
     Preview Data
  ========================= */

  const payload = {

    type,
    title,
    message,
    address,
    hours,
    tags,
    contact,

    images:
      Array.from(files).map(
        file => file.name
      )

  };

  console.log(
    "[feedback]",
    payload
  );

  /* =========================
     Success
  ========================= */

  alert(
    "感謝你的回饋，HeriLand 已收到你的提交。"
  );

  resetFeedbackForm();

}

/* =========================
   Reset
========================= */

function resetFeedbackForm() {

  document.getElementById(
    "feedbackType"
  ).value = "problem";

  document.getElementById(
    "feedbackTitle"
  ).value = "";

  document.getElementById(
    "feedbackMessage"
  ).value = "";

  document.getElementById(
    "feedbackAddress"
  ).value = "";

  document.getElementById(
    "feedbackHours"
  ).value = "";

  document.getElementById(
    "feedbackTags"
  ).value = "";

  document.getElementById(
    "feedbackContact"
  ).value = "";

  document.getElementById(
    "feedbackImages"
  ).value = "";

}

/* =========================
   Mobile Menu
========================= */

function bindMobileMenu() {

  const menu =
    document.querySelector(
      ".mobile-menu"
    );

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

let pageStarted = false;

function startPage() {

  if (pageStarted) return;

  pageStarted = true;

  console.log(
    "[feedback] init"
  );

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