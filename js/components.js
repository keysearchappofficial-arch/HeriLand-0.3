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

/* =========================
   Mobile Menu
========================= */

async function renderMobileMenu() {

  console.log("[components] render mobile menu");

  const target =
    document.querySelector("#mobileMenu");

  if (!target) {

    console.warn(
      "[components] mobileMenu target missing"
    );

    return;
  }

  target.innerHTML = `

    <div class="mobile-menu">

      <div class="mobile-menu-panel">

        <!-- Top -->
        <div class="mobile-menu-top">

          <div>
            <small>HeriLand</small>
            <h2>Menu</h2>
          </div>

          <button
            id="mobileMenuClose"
            class="mobile-menu-close"
            type="button"
          >
            ×
          </button>

        </div>

        <!-- Navigation -->
        <nav class="mobile-menu-nav">

          <!-- Explore -->
          <a
            class="mobile-menu-link"
            href="./index.html"
          >

            <svg viewBox="0 0 24 24">
              <path d="M4 11l8-7 8 7v9H4z"></path>
            </svg>

            <span>探索</span>

          </a>

          <!-- Cities -->
          <a
            class="mobile-menu-link"
            href="./city.html"
          >

            <svg viewBox="0 0 24 24">
              <path d="M4 7h16"></path>
              <path d="M4 12h16"></path>
              <path d="M4 17h16"></path>
            </svg>

            <span>城市</span>

          </a>

          <!-- Transport -->
          <a
            class="mobile-menu-link"
            href="./transport.html"
          >

            <svg viewBox="0 0 24 24">
              <path d="M3 17h18"></path>
              <path d="M6 17l1.5-5h9L18 17"></path>

              <circle
                cx="7.5"
                cy="18.5"
                r="1.5"
              ></circle>

              <circle
                cx="16.5"
                cy="18.5"
                r="1.5"
              ></circle>
            </svg>

            <span>交通</span>

          </a>

          <!-- Events -->
          <a
            class="mobile-menu-link"
            href="./event.html"
          >

            <svg viewBox="0 0 24 24">
              <path d="M12 3v18"></path>
              <path d="M5 8h14"></path>
              <path d="M5 16h14"></path>
            </svg>

            <span>活動</span>

          </a>

        </nav>

        <!-- Official -->
        <div class="mobile-menu-group">

          <div class="mobile-menu-label">
            Official
          </div>

          <nav class="mobile-menu-nav">

            <!-- Emergency -->
            <a
              class="mobile-menu-link"
              href="./emergency.html"
            >

              <svg viewBox="0 0 24 24">
                <path d="M12 3l9 16H3z"></path>
                <path d="M12 9v5"></path>
                <path d="M12 17h.01"></path>
              </svg>

              <span>緊急聯絡</span>

            </a>

            <!-- Government -->
            <a
              class="mobile-menu-link"
              href="./government.html"
            >

              <svg viewBox="0 0 24 24">

                <path d="M4 21h16"></path>

                <path d="M7 21V7h10v14"></path>

                <path d="M10 10h1"></path>
                <path d="M13 10h1"></path>

                <path d="M10 13h1"></path>
                <path d="M13 13h1"></path>

              </svg>

              <span>政府單位</span>

            </a>

          </nav>

        </div>

        <!-- My -->
        <div class="mobile-menu-group">

          <nav class="mobile-menu-nav">

            <a
              class="mobile-menu-link"
              href="./my.html"
            >

              <svg viewBox="0 0 24 24">

                <circle
                  cx="12"
                  cy="8"
                  r="4"
                ></circle>

                <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"></path>

              </svg>

              <span>我的</span>

            </a>

          </nav>

        </div>

      </div>

    </div>
  `;

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