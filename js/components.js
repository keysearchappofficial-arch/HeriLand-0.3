import { initAiGuide } from "./ai-guide.js";

async function loadComponent(selector, file) {
  console.log("[components] loading:", selector, file);

  const target = document.querySelector(selector);

  if (!target) {
    console.warn("[components] target not found:", selector);
    return;
  }

  try {
    const response = await fetch(file);

    console.log("[components] response:", file, response.status);

    const html = await response.text();

    target.innerHTML = html;

    console.log("[components] loaded:", file);
  }
  catch (error) {
    console.error("[components] failed:", file, error);
  }
}

/* =========================
   Mobile Menu
========================= */

async function renderMobileMenu() {

  const target =
    document.querySelector("#mobileMenu");

  if (!target) return;

  target.innerHTML = `
    <div class="mobile-menu">

      <div class="mobile-menu-panel">

        <div class="mobile-menu-top">

          <div>
            <small>Explore</small>
            <h2>HeriLand</h2>
          </div>

          <button
            id="mobileMenuClose"
            class="mobile-menu-close"
            type="button"
          >
            ×
          </button>

        </div>

        <div id="mobileNav"></div>

      </div>

    </div>
  `;

  await loadComponent(
    "#mobileNav",
    "./components/mobile-nav.html"
  );

}

/* =========================
   Init Components
========================= */

async function initComponents() {
  console.log("[components] init start");

  await loadComponent(
    "#navbar",
    "./components/navbar.html"
  );

  await loadComponent(
    "#footer",
    "./components/footer.html"
  );

  await loadComponent(
    "#aiGuide",
    "./components/ai-guide.html"
  );
  
await loadComponent(
  "#detailContainer",
  "./components/detail.html"
);

  await renderMobileMenu();

  initAiGuide();

  console.log("[components] READY");

  window.componentsLoaded = true;

  window.dispatchEvent(
    new Event("componentsReady")
  );
}

initComponents();

/* =========================
   iOS Back Cache Fix
========================= */

window.addEventListener(
  "pageshow",
  event => {

    if (event.persisted) {

      window.location.reload();

    }

  }
);