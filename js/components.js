import { initAiGuide }
from "./ai-guide.js";

async function loadComponent(selector, file) {

  console.log(
    "[components] loading:",
    selector,
    file
  );

  const target =
    document.querySelector(selector);

  if (!target) {

    console.warn(
      "[components] target not found:",
      selector
    );

    return;

  }

  try {

    const response =
      await fetch(file);

    console.log(
      "[components] response:",
      file,
      response.status
    );

    const html =
      await response.text();

    target.innerHTML = html;

    console.log(
      "[components] loaded:",
      file
    );

  }

  catch (error) {

    console.error(
      "[components] failed:",
      file,
      error
    );

  }

}

/* =========================
   Mobile Menu
========================= */

async function renderMobileMenu() {

  console.log(
    "[components] render mobile menu"
  );

  const target =
    document.querySelector(
      "#mobileMenu"
    );

  if (!target) {

    console.warn(
      "[components] mobileMenu target missing"
    );

    return;

  }

  target.innerHTML = `
    <div class="mobile-menu">

      <div class="mobile-menu-panel">

        <div class="mobile-menu-head">

          <strong>HeriLand</strong>

          <button
            id="mobileMenuClose"
            type="button"
          >
            ×
          </button>

        </div>

        <div id="mobileNav"></div>

        <div class="mobile-menu-ai">

          <small>AI Guide</small>

          <p>
            我會依照你現在的位置、
            時間和狀態，
            幫你推薦現在適合的砂拉越體驗。
          </p>

        </div>

      </div>

    </div>
  `;

  await loadComponent(
    "#mobileNav",
    "./components/mobile-nav.html"
  );

}

async function initComponents() {

  console.log(
    "[components] init start"
  );

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

  await renderMobileMenu();

console.log(
  "[components] READY"
);

window.componentsLoaded = true;

window.dispatchEvent(
  new Event("componentsReady")
);

}

initComponents();
initAiGuide();
