const travelerDetailPage =
  document.getElementById("travelerDetailPage");

/* =========================
   Open
========================= */

window.openTravelerDetail = async function (slug){

  if (!travelerDetailPage) return;

  travelerDetailPage.classList.add("is-open");

  document.body.classList.add("no-scroll");

  await loadTravelerDetail(slug);

  syncTravelerSaveButton();

};

/* =========================
   Close
========================= */

window.closeTravelerDetail = function (){

  travelerDetailPage.classList.remove("is-open");

  document.body.classList.remove("no-scroll");

};

/* =========================
   Load
========================= */

async function loadTravelerDetail(slug){

  const { data, error } =
    await supabase
      .from("places")
      .select("*")
      .eq("slug", slug)
      .single();

  if (error || !data) {
    console.error(
      "load traveler detail failed:",
      error
    );
    return;
  }

  renderTravelerDetail(data);

}

/* =========================
   Render
========================= */

function renderTravelerDetail(data){

  const tags =
    Array.isArray(data.tags)
      ? data.tags
      : [];

  const images = [
    data.hero_image_url,
    data.card_image_url
  ].filter(Boolean);

  document.getElementById(
    "travelerDetailName"
  ).textContent =
    data.name || "Traveler Story";

  document.getElementById(
    "travelerDetailAchievement"
  ).textContent =
    `${capitalizeText(data.city || "Sarawak")} ・ Traveler Experience`;

  document.getElementById(
    "travelerDetailTitle"
  ).textContent =
    data.name || "";

  document.getElementById(
    "travelerDetailStory"
  ).textContent =
    data.full_description ||
    data.short_description ||
    "";

  const guide =
    document.getElementById("travelerDetailGuide");

  if (guide) {
    guide.textContent =
      data.short_description ||
      "A slower way to experience Sarawak.";
  }

  renderTravelerTags(tags);
  renderTravelerGallery(images);

}

/* =========================
   Tags
========================= */

function renderTravelerTags(tags){

  const el =
    document.getElementById(
      "travelerDetailTags"
    );

  if (!el) return;

  el.innerHTML =
    tags.map(tag => `
      <span>#${tag}</span>
    `).join("");

}

/* =========================
   Gallery
========================= */

function renderTravelerGallery(images){

  const slider =
    document.getElementById(
      "travelerDetailSlider"
    );

  const dots =
    document.getElementById(
      "travelerDetailDots"
    );

  if (!slider || !dots) return;

  slider.innerHTML =
    images.map(image => `
      <div class="traveler-detail-slide">
        <img src="${image}" alt="">
      </div>
    `).join("");

  dots.innerHTML =
    images.map((_, index) => `
      <div class="
        traveler-detail-dot
        ${index === 0 ? "active" : ""}
      "></div>
    `).join("");

  setupTravelerSlider(images.length);

}

/* =========================
   Save
========================= */

function syncTravelerSaveButton(){

  const saveBtn =
    document.getElementById(
      "travelerDetailSaveBtn"
    );

  const item =
    window.currentOpenedItem;

  if (!saveBtn || !item) return;

  const saved =
    isSaved(item.slug);

  saveBtn.classList.toggle(
    "is-saved",
    saved
  );

  saveBtn.textContent =
    saved ? "♥" : "♡";

}

document
  .getElementById(
    "travelerDetailSaveBtn"
  )
  ?.addEventListener(
    "click",
    async () => {

      const item =
        window.currentOpenedItem;

      if (!item) return;

      const ok =
        await toggleSaved(item);

      if (!ok) return;

      updateAvatarStats();
      renderCards();
      syncTravelerSaveButton();

    }
  );

/* =========================
   More
========================= */

document
  .getElementById(
    "travelerDetailMoreBtn"
  )
  ?.addEventListener(
    "click",
    () => {

      document
        .getElementById(
          "travelerMoreLayer"
        )
        ?.classList.add("is-open");

    }
  );

document
  .getElementById(
    "travelerMoreBackdrop"
  )
  ?.addEventListener(
    "click",
    () => {

      document
        .getElementById(
          "travelerMoreLayer"
        )
        ?.classList.remove("is-open");

    }
  );

/* =========================
   Placeholder Actions
========================= */

window.saveTravelerStory =
  async function (){

    const item =
      window.currentOpenedItem;

    if (!item) return;

    const ok =
      await toggleSaved(item);

    if (!ok) return;

    updateAvatarStats();
    renderCards();
    syncTravelerSaveButton();

  };

window.saveTravelerRoute =
  function (){

    const item =
      window.currentOpenedItem;

    if (!item) return;

    addToTrip(item);

    updateAvatarStats();

    alert("Route added to My Trip");

  };

window.shareTravelerStory =
  function (){

    console.log(
      "share traveler story"
    );

  };

window.openTravelerMap =
  function (){

    console.log(
      "open traveler map"
    );

  };

window.continueTravelerAiGuide =
  function (){

    console.log(
      "continue traveler ai guide"
    );

  };

/* =========================
   Slider
========================= */

let currentTravelerSlide = 0;

function setupTravelerSlider(total){

  const slider =
    document.getElementById(
      "travelerDetailSlider"
    );

  const dots =
    document.querySelectorAll(
      ".traveler-detail-dot"
    );

  if (!slider || !total) return;

  currentTravelerSlide = 0;

  function updateSlider(index){

    currentTravelerSlide =
      Math.max(
        0,
        Math.min(index, total - 1)
      );

    slider.style.transition =
      "transform .35s cubic-bezier(.22,.9,.28,1)";

    slider.style.transform =
      `translateX(-${currentTravelerSlide * 100}%)`;

    dots.forEach((dot, dotIndex) => {

      dot.classList.toggle(
        "active",
        dotIndex === currentTravelerSlide
      );

    });

  }

  dots.forEach((dot, index) => {

    dot.onclick = () => {
      updateSlider(index);
    };

  });

  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  slider.ontouchstart = (event) => {

    startX =
      event.touches[0].clientX;

    currentX = startX;

    isDragging = true;

    slider.style.transition = "none";

  };

  slider.ontouchmove = (event) => {

    if (!isDragging) return;

    currentX =
      event.touches[0].clientX;

    const diffX =
      currentX - startX;

    slider.style.transform =
      `translateX(calc(-${currentTravelerSlide * 100}% + ${diffX}px))`;

  };

  slider.ontouchend = () => {

    if (!isDragging) return;

    isDragging = false;

    const diffX =
      currentX - startX;

    if (diffX < -60) {
      updateSlider(
        currentTravelerSlide + 1
      );
      return;
    }

    if (diffX > 60) {
      updateSlider(
        currentTravelerSlide - 1
      );
      return;
    }

    updateSlider(
      currentTravelerSlide
    );

  };

  updateSlider(0);

}

/* =========================
   Utils
========================= */

function capitalizeText(text){

  if (!text) return "";

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  );

}