// explore/support.js

console.log("✅ support.js loaded");

export function bindSupportButtons(){

  console.log("🛟 bindSupportButtons()");

  const avatarSubContent =
    document.getElementById("avatarSubContent");

  avatarSubContent
    ?.querySelectorAll("[data-support-page]")
    .forEach((button) => {

      console.log(
        "🛟 support button:",
        button.dataset.supportPage
      );

      button.addEventListener("click", () => {

        const page =
          button.dataset.supportPage;

        openSupportPage(page);

      });

    });

}

export function openSupportPage(page){

  console.log("🛟 openSupportPage:", page);

  const pages = {
    help: {
      title: "Help Center",
      body: `
        <p>
          Find basic guidance for saved places,
          trips, reviews, and exploring Sarawak
          with HeriLand.
        </p>

        <p>
          You can swipe cards to explore,
          save places, add items to your trip,
          and check useful travel information
          from your traveler panel.
        </p>
      `
    },

    contact: {
      title: "Contact Support",
      body: `
        <input
          class="support-input"
          placeholder="Your email"
        >

        <textarea
          class="support-textarea"
          placeholder="How can we help?"
        ></textarea>

        <button
          class="support-submit"
          type="button"
        >
          Send Message
        </button>
      `
    },

    report: {
      title: "Report an Issue",
      body: `
        <select class="support-input">
          <option>Wrong information</option>
          <option>Closed place</option>
          <option>Broken link</option>
          <option>Unsafe content</option>
        </select>

        <textarea
          class="support-textarea"
          placeholder="Tell us what happened."
        ></textarea>

        <button
          class="support-submit"
          type="button"
        >
          Submit Report
        </button>
      `
    },

    privacy: {
      title: "Privacy Policy",
      body: `
        <p>
          HeriLand may store saved places,
          trips, reviews, and basic account
          preferences to improve your travel
          experience.
        </p>

        <p>
          Your data should only be used to support
          platform features, personalization,
          and safety-related improvements.
        </p>
      `
    },

    terms: {
      title: "Terms of Service",
      body: `
        <p>
          By using HeriLand, travelers agree
          to use the platform responsibly and
          avoid submitting harmful, misleading,
          or illegal content.
        </p>

        <p>
          Travel information should be checked
          before visiting, as opening hours,
          availability, and event details may change.
        </p>
      `
    }
  };

  const data =
    pages[page];

  if (!data) {
    console.log("⛔ support page not found:", page);
    return;
  }

  const avatarSubTitle =
    document.getElementById("avatarSubTitle");

  const avatarSubKicker =
    document.getElementById("avatarSubKicker");

  const avatarSubContent =
    document.getElementById("avatarSubContent");

  if (avatarSubTitle) {
    avatarSubTitle.textContent =
      data.title;
  }

  if (avatarSubKicker) {
    avatarSubKicker.textContent =
      "Help & Support";
  }

  if (avatarSubContent) {
    avatarSubContent.innerHTML = `
      <div class="support-page">
        ${data.body}
      </div>
    `;
  }

  console.log("✅ support page opened:", page);
}

window.openSupportPage =
  openSupportPage;