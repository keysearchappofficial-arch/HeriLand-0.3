async function loadComponent(selector, file) {
  const target = document.querySelector(selector);
  if (!target) return;

  const response = await fetch(file);
  const html = await response.text();

  target.innerHTML = html;
}

async function renderMobileMenu() {
  const target = document.querySelector("#mobileMenu");
  if (!target) return;

  target.innerHTML = `
    <div class="mobile-menu">
      <div class="mobile-menu-panel">

        <div class="mobile-menu-head">
          <strong>HeriLand</strong>
          <button id="mobileMenuClose" type="button">×</button>
        </div>

        <div id="mobileNav"></div>

        <div class="mobile-menu-ai">
          <small>AI Guide</small>
          <p>
            我會依照你現在的位置、時間和狀態，
            幫你推薦現在適合的砂拉越體驗。
          </p>
        </div>

      </div>
    </div>
  `;

  await loadComponent("#mobileNav", "./components/mobile-nav.html");
}

async function initComponents() {
  await loadComponent("#navbar", "./components/navbar.html");
  await loadComponent("#footer", "./components/footer.html");
  await renderMobileMenu();

  window.dispatchEvent(new Event("componentsReady"));
}

initComponents();