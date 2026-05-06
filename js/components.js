async function loadComponent(selector, file) {

  const target = document.querySelector(selector);

  if (!target) return;

  const response = await fetch(file);

  const html = await response.text();

  target.innerHTML = html;

}

loadComponent("#navbar", "./components/navbar.html");
loadComponent("#footer", "./components/footer.html");
loadComponent("#mobileNav", "./components/mobile-nav.html");
