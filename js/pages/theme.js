/* =========================
   Theme Page
========================= */

function init() {
  bindMobileMenu();
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

/* =========================
   Start
========================= */

let pageStarted = false;

function startPage() {
  if (pageStarted) return;

  pageStarted = true;

  console.log("[theme] init");

  init();
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