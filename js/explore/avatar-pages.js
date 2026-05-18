// explore/avatar-pages.js

import {
  getSavedItems,
  getTripItems,
  getReviews
} from "./storage.js";

import {
  renderAccountPage,
  bindAccountPage
} from "./account.js";

import {
  renderSettingsPage,
  bindSettingsPage
} from "./settings.js";

import { bindSupportButtons } from "./support.js";

import {
  renderContributePage,
  bindContributePage
} from "./contribute.js";

import {
  bindAvatarPlaceActions
} from "./avatar-place-actions.js";

console.log("✅ avatar-pages.js loaded");

const avatarPages = {
  saved: {
    title: "Saved",
    kicker: "Your Collection",
    layout: "place",
    items: []
  },

  trip: {
    title: "My Trip",
    kicker: "Travel Plan",
    layout: "place",
    items: []
  },

  reviews: {
    title: "Reviews",
    kicker: "Your Voice",
    layout: "place",
    items: []
  },

  government: {
    title: "Government",
    kicker: "Useful Info",
    layout: "info",
    items: [
      {
        title: "Tourism Office",
        text: "Official visitor support and local travel information.",
        phone: true,
        map: true,
        website: true
      },
      {
        title: "Immigration Office",
        text: "Visa, entry, and document-related assistance.",
        phone: true,
        map: true,
        website: true
      }
    ]
  },

  emergency: {
    title: "Emergency",
    kicker: "Stay Safe",
    layout: "info",
    items: [
      {
        title: "Emergency Hotline",
        text: "Call local emergency services for urgent help.",
        phone: true,
        map: true
      },
      {
        title: "Police",
        text: "Urgent police assistance and nearby stations.",
        phone: true,
        map: true
      }
    ]
  },

  service: {
    title: "Help & Support",
    kicker: "Need Assistance?",
    layout: "info",
    items: [
      {
        title: "Help Center",
        text: "Common questions, trip tools, saved places, and platform guide.",
        action: "Open",
        page: "help"
      },
      {
        title: "Contact Support",
        text: "Send a message to HeriLand support for account or travel issues.",
        action: "Message",
        page: "contact"
      },
      {
        title: "Report an Issue",
        text: "Report wrong information, closed places, broken links, or unsafe content.",
        action: "Report",
        page: "report"
      },
      {
        title: "Privacy Policy",
        text: "Learn how HeriLand stores, uses, and protects your data.",
        action: "View",
        page: "privacy"
      },
      {
        title: "Terms of Service",
        text: "Read the platform rules, usage terms, and community guidelines.",
        action: "View",
        page: "terms"
      }
    ]
  },
  
contribute: {
  title: "Contribute",
  kicker: "Share with Travelers",
  layout: "empty",
  items: []
},

  account: {
    title: "Account",
    kicker: "Traveler Profile",
    layout: "empty",
    items: []
  },

  settings: {
    title: "Settings",
    kicker: "Preferences",
    layout: "empty",
    items: []
  }
};

let avatarCurrentPageKey = null;

export function bindAvatarPages(){

  console.log("📄 bindAvatarPages()");

  document
    .querySelectorAll("[data-avatar-page]")
    .forEach((button) => {
      console.log(
        "📄 avatar page button:",
        button.dataset.avatarPage
      );

      button.addEventListener("click", async () => {
        const pageKey =
          button.dataset.avatarPage;

        await openAvatarSubPage(pageKey);
      });
    });

  console.log("✅ avatar pages bound");
}

export async function openAvatarSubPage(pageKey){

  console.log("📄 openAvatarSubPage():", pageKey);

  if (pageKey === "contribute") {
    const loggedIn =
      await window.requireLogin?.("contribute");

    if (!loggedIn) {
      console.log("⛔ contribute blocked: not logged in");
      return;
    }
  }

  const page =
    avatarPages[pageKey];

  if (!page) {
    console.log("⛔ page not found:", pageKey);
    return;
  }

  avatarCurrentPageKey = pageKey;

  const avatarHomeView =
    document.getElementById("avatarHomeView");

  const avatarSubView =
    document.getElementById("avatarSubView");

  const avatarSubTitle =
    document.getElementById("avatarSubTitle");

  const avatarSubKicker =
    document.getElementById("avatarSubKicker");

  const avatarSubContent =
    document.getElementById("avatarSubContent");

if (pageKey === "saved") {
  page.items = getSavedItems().map(item => ({
    slug: item.slug,
    list: "saved",
    type: item.contentType || "place",
    title: item.place,
    rating: "Saved",
    text: item.tags || item.subtitle || "",
    image: item.image
  }));
}

if (pageKey === "trip") {
  page.items = getTripItems().map(item => ({
    slug: item.slug,
    list: "trip",
    type: item.contentType || "place",
    title: item.place,
    rating: item.contentType?.toUpperCase() || "Trip",
    text: item.tags || item.subtitle || "",
    image: item.image
  }));
}

if (
  pageKey === "saved" ||
  pageKey === "trip"
) {
  bindAvatarPlaceActions();
}

  if (avatarSubTitle) {
    avatarSubTitle.textContent = page.title;
  }

  if (avatarSubKicker) {
    avatarSubKicker.textContent = page.kicker;
  }

  if (!avatarSubContent) return;

  if (page.layout === "place") {
    avatarSubContent.innerHTML =
      page.items.length
        ? page.items.map(renderAvatarPlaceCard).join("")
        : renderEmptyState(pageKey);
  }

  if (page.layout === "info") {
    avatarSubContent.innerHTML =
      page.items.map(renderAvatarListItem).join("");
  }

if (pageKey === "contribute") {

  const loggedIn =
    await window.requireLogin?.("contribute");

  if (!loggedIn) {
    console.log("⛔ contribute blocked: not logged in");
    return;
  }

  avatarSubContent.innerHTML =
    renderContributePage();

  bindContributePage();

}

else if (pageKey === "account") {

  avatarSubContent.innerHTML =
    renderAccountPage();

  await bindAccountPage();

}

else if (pageKey === "settings") {

  avatarSubContent.innerHTML =
    renderSettingsPage();

  bindSettingsPage();

}

else if (page.layout === "empty") {

  avatarSubContent.innerHTML =
    renderEmptyState(pageKey);

}

  avatarHomeView?.classList.remove("is-active");
  avatarSubView?.classList.add("is-active");
  
  if (pageKey === "service") {
  bindSupportButtons();
}

if (
  pageKey === "saved" ||
  pageKey === "trip" ||
  pageKey === "reviews"
) {
  bindAvatarPlaceActions();
}

  console.log("✅ avatar page opened:", pageKey);
}

function renderAvatarPlaceCard(item){

  const isSavedItem =
    item.list === "saved";

  const isTripItem =
    item.list === "trip";

  return `
    <div
      class="avatar-place-card traveler-place-row"
      data-open-slug="${item.slug || ""}"
      data-type="${item.type || item.contentType || "place"}"
      data-list="${item.list || ""}"
    >

      <button
        class="avatar-place-delete traveler-remove-btn"
        type="button"
        ${
          isSavedItem
            ? `data-remove-saved="${item.slug || ""}"`
            : ""
        }
        ${
          isTripItem
            ? `data-remove-trip="${item.slug || ""}"`
            : ""
        }
      >
        Delete
      </button>

      <img
        class="avatar-place-thumb"
        src="${item.image || ""}"
        alt="${item.title || ""}"
      >

      <div class="avatar-place-copy">
        <h4>${item.title || ""}</h4>

        <div class="avatar-place-rating">
          ${item.rating || ""}
        </div>

        <div class="avatar-place-tags">
          ${item.text || ""}
        </div>
      </div>
    </div>
  `;
}

function renderAvatarListItem(item){
  return `
    <div class="avatar-list-item">
      <div class="avatar-list-top">
        <h4>${item.title}</h4>

        <div class="avatar-list-actions">
          ${item.phone ? `<button type="button">Phone</button>` : ""}
          ${item.map ? `<button type="button">Map</button>` : ""}
          ${item.website ? `<button type="button">Website</button>` : ""}

          ${item.action ? `
            <button
              type="button"
              data-support-page="${item.page || ""}"
            >
              ${item.action}
            </button>
          ` : ""}
        </div>
      </div>

      <p>${item.text}</p>
    </div>
  `;
}

function renderEmptyState(pageKey){
  return `
    <div class="avatar-empty-state">
      <h4>No ${pageKey} yet</h4>
      <p>Your ${pageKey} content will appear here.</p>
    </div>
  `;
}

window.openAvatarSubPage = openAvatarSubPage;