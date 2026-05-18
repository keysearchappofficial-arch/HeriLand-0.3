async function requireAdmin(){

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    location.href = "/";
    return false;
  }

  const { data } = await supabase
    .from("heriland_admins")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) {
    alert("Not admin.");
    location.href = "/";
    return false;
  }

  return true;
}

let submissions = [];
let pendingRejectIds = [];

const tableBody = document.getElementById("submissionTableBody");

const refreshBtn = document.getElementById("refreshBtn");
const typeFilter = document.getElementById("typeFilter");
const statusFilter = document.getElementById("statusFilter");
const checkAll = document.getElementById("checkAll");

const batchPublishBtn = document.getElementById("batchPublishBtn");
const batchRejectBtn = document.getElementById("batchRejectBtn");
const batchSaveBtn = document.getElementById("batchSaveBtn");

const rejectLayer = document.getElementById("rejectLayer");
const rejectBackdrop = document.getElementById("rejectBackdrop");
const rejectReasonInput = document.getElementById("rejectReasonInput");
const rejectCancelBtn = document.getElementById("rejectCancelBtn");
const rejectConfirmBtn = document.getElementById("rejectConfirmBtn");

/* =========================
   Load
========================= */

async function loadSubmissions(){
  tableBody.innerHTML = `
    <tr>
      <td colspan="30">Loading...</td>
    </tr>
  `;

  const { data, error } = await supabase
    .from("user_submitted_places")
    .select("*")
    .order("created_at", { ascending:false });

  if (error) {
    console.error(error);

    tableBody.innerHTML = `
      <tr>
        <td colspan="30">Load failed.</td>
      </tr>
    `;

    return;
  }

  submissions = data || [];
  renderTable();
}

/* =========================
   Filter
========================= */

function getFilteredSubmissions(){
  return submissions.filter((item) => {
    const matchType =
      typeFilter.value === "all" ||
      item.type === typeFilter.value;

    const matchStatus =
      statusFilter.value === "all" ||
      item.status === statusFilter.value;

    return matchType && matchStatus;
  });
}

/* =========================
   Render
========================= */

function renderTable(){
  const rows = getFilteredSubmissions();

  if (!rows.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="30">No submissions found.</td>
      </tr>
    `;

    return;
  }

  tableBody.innerHTML =
    rows.map(renderRow).join("");

  bindRowEvents();
}

function renderRow(item){
  return `
    <tr data-id="${item.id}">

      <td>
        <input
          class="row-check"
          type="checkbox"
          data-id="${item.id}"
        >
      </td>

      <td>
        <select data-field="type">
          ${renderTypeOptions(item.type)}
        </select>
      </td>

      <td>
        <select
          class="status-select ${item.status || "pending"}"
          data-field="status"
        >
          ${renderStatusOptions(item.status)}
        </select>
      </td>

      <td>
        <input
          data-field="name"
          value="${escapeValue(item.name)}"
        >
      </td>

      <td>
        <input
          data-field="city"
          value="${escapeValue(item.city)}"
        >
      </td>

      <td>
        <input
          data-field="area"
          value="${escapeValue(item.area)}"
        >
      </td>

      <td>
        <textarea data-field="address">${escapeValue(item.address || item.venue_name)}</textarea>
      </td>

      <td>
        <textarea data-field="short_description">${escapeValue(item.short_description)}</textarea>
      </td>

      <td>
        <textarea data-field="full_description">${escapeValue(item.full_description)}</textarea>
      </td>

      <td>
        <textarea data-field="why_recommend">${escapeValue(item.why_recommend)}</textarea>
      </td>

      <td>
        <textarea data-field="tags">${escapeValue(formatTagsForInput(item.tags))}</textarea>
      </td>

      <td>
        <input
          data-field="image_url"
          value="${escapeValue(item.image_url)}"
        >
      </td>

      <td>
        <input
          data-field="google_map_url"
          value="${escapeValue(item.google_map_url)}"
        >
      </td>

      <td>
        <input
          data-field="phone"
          value="${escapeValue(item.phone)}"
        >
      </td>

      <td>
        <input
          data-field="website_url"
          value="${escapeValue(item.website_url)}"
        >
      </td>

      <td>
        <textarea data-field="opening_hours">${escapeValue(formatOpeningHoursForInput(item.opening_hours))}</textarea>
      </td>

      <td>
        <input
          data-field="price_level"
          value="${escapeValue(item.price_level)}"
        >
      </td>

      <td>
        <input
          data-field="event_date"
          type="date"
          value="${escapeValue(item.event_date)}"
        >
      </td>

      <td>
        <input
          data-field="event_time"
          value="${escapeValue(item.event_time)}"
        >
      </td>

      <td>
        <input
          data-field="organizer"
          value="${escapeValue(item.organizer)}"
        >
      </td>

      <td>
        <input
          data-field="ticket_url"
          value="${escapeValue(item.ticket_url)}"
        >
      </td>

      <td>
        <textarea data-field="cultural_background">${escapeValue(item.cultural_background)}</textarea>
      </td>

      <td>
        <textarea data-field="what_to_notice">${escapeValue(item.what_to_notice)}</textarea>
      </td>

      <td>
        <textarea data-field="etiquette_tips">${escapeValue(item.etiquette_tips)}</textarea>
      </td>

      <td>
        <input
          data-field="target_title"
          value="${escapeValue(item.target_title || item.target_slug || "")}"
        >
      </td>

      <td>
        <input
          data-field="correction_field"
          value="${escapeValue(item.correction_field)}"
        >
      </td>

      <td>
        <textarea data-field="correction_detail">${escapeValue(item.correction_detail)}</textarea>
      </td>

      <td>
        <input
          data-field="source_url"
          value="${escapeValue(item.source_url)}"
        >
      </td>

      <td>
        <textarea data-field="admin_note">${escapeValue(item.admin_note)}</textarea>
      </td>

      <td>
        <button
          class="save-row-btn"
          type="button"
          data-id="${item.id}"
        >
          Save
        </button>
      </td>

    </tr>
  `;
}

/* =========================
   Options
========================= */

function renderTypeOptions(value){
  const types = [
    "place",
    "restaurant",
    "event",
    "culture",
    "travel-tip",
    "correction"
  ];

  return types.map(type => `
    <option
      value="${type}"
      ${type === value ? "selected" : ""}
    >
      ${type}
    </option>
  `).join("");
}

function renderStatusOptions(value){
  const statuses = [
    "pending",
    "published",
    "rejected"
  ];

  return statuses.map(status => `
    <option
      value="${status}"
      ${status === value ? "selected" : ""}
    >
      ${status}
    </option>
  `).join("");
}

/* =========================
   Helpers
========================= */

function escapeValue(value){
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatTagsForInput(tags){
  if (Array.isArray(tags)) {
    return tags.join(", ");
  }

  if (typeof tags === "string") {
    return tags;
  }

  return "";
}

function parseTags(value){
  if (!value) return [];

  return String(value)
    .split(/[,，\n]/)
    .map(tag => tag.trim())
    .filter(Boolean);
}

function formatOpeningHoursForInput(value){
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  if (value.label) {
    return value.label;
  }

  return JSON.stringify(value);
}

function buildOpeningHours(value){
  if (!value) return null;

  return {
    label: value
  };
}

function generateSlug(text = ""){
  const base =
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  return `${base || "heriland"}-${Date.now()}`;
}

function getFallbackImage(type){
  const map = {
    place:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",

    restaurant:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80",

    event:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80",

    culture:
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1400&q=80",

    "travel-tip":
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"
  };

  return map[type] || map.place;
}

function getExploreContentType(type){
  const map = {
    place: "spot",
    restaurant: "restaurant",
    event: "event",
    culture: "culture",
    "travel-tip": "experience"
  };

  return map[type] || "spot";
}

/* =========================
   Payload
========================= */

function getRowPayload(row){
  const payload = {};

  row
    .querySelectorAll("[data-field]")
    .forEach((field) => {
      const key = field.dataset.field;

      if (key === "tags") {
        payload[key] = parseTags(field.value);
        return;
      }

      if (key === "opening_hours") {
        payload[key] = buildOpeningHours(field.value.trim());
        return;
      }

      payload[key] = field.value;
    });

  payload.updated_at = new Date().toISOString();

  return payload;
}

async function getSubmissionFromRow(id){
  const row =
    document.querySelector(`tr[data-id="${id}"]`);

  if (!row) return null;

  return {
    ...submissions.find(item => item.id === id),
    ...getRowPayload(row)
  };
}

/* =========================
   Save Row
========================= */

async function saveRow(id){
  const row =
    document.querySelector(`tr[data-id="${id}"]`);

  if (!row) return;

  const payload = getRowPayload(row);

  const { data, error } = await supabase
    .from("user_submitted_places")
    .update(payload)
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    alert("Save failed.");
    return;
  }

  if (!data || !data.length) {
    alert("No row updated.");
    return;
  }

  await loadSubmissions();
}

/* =========================
   Publish Pipeline
========================= */

async function publishSubmission(submission){
  if (!submission) return false;

  if (submission.type === "correction") {
    alert("Correction should not be published directly. Please update the target content manually.");
    return false;
  }

  const slug =
    submission.slug ||
    generateSlug(submission.name);

  const image =
    submission.image_url ||
    getFallbackImage(submission.type);

  if (submission.type === "place" || submission.type === "restaurant") {
    return publishPlace(submission, slug, image);
  }

  if (submission.type === "event") {
    return publishEvent(submission, slug, image);
  }

  if (submission.type === "culture") {
    return publishCulture(submission, slug, image);
  }

  if (submission.type === "travel-tip") {
    return publishTravelerStory(submission, slug, image);
  }

  return false;
}

async function publishPlace(submission, slug, image){
  const placePayload = {
    slug,

    type:
      submission.type === "restaurant"
        ? "restaurant"
        : "place",

    title:
      submission.name,

    city:
      submission.city,

    area:
      submission.area,

    address:
      submission.address,

    short_description:
      submission.short_description,

    full_description:
      submission.full_description,

    opening_hours:
      submission.opening_hours || null,

    phone:
      submission.phone,

    website_url:
      submission.website_url,

    google_map_url:
      submission.google_map_url,

    price_level:
      submission.price_level,

    hero_image_url:
      image,

    card_image_url:
      image,

    gallery_urls:
      [],

    tags:
      Array.isArray(submission.tags)
        ? submission.tags
        : parseTags(submission.tags),

    status:
      "published"
  };

  const { error } = await supabase
    .from("heriland_places")
    .upsert(placePayload, {
  onConflict: "slug"
});

  if (error) {
    console.error("heriland_places insert failed:", error);
    alert(error.message || "Place publish failed.");
    return false;
  }

  return publishExploreItem(submission, slug, image);
}

async function publishEvent(submission, slug, image){
  const eventPayload = {
    slug,

    title:
      submission.name,

    city:
      submission.city,

    area:
      submission.area,

    venue_name:
      submission.venue_name || submission.address,

    address:
      submission.address,

    summary:
      submission.short_description,

    content:
      submission.full_description,

    start_date:
      submission.event_date || null,

    end_date:
      submission.event_date || null,

    time_rule:
      submission.event_time
        ? { label: submission.event_time }
        : null,

    organizer:
      submission.organizer,

    ticket_url:
      submission.ticket_url,

    google_map_url:
      submission.google_map_url,

    hero_image_url:
      image,

    card_image_url:
      image,

    gallery_urls:
      [],

    tags:
      Array.isArray(submission.tags)
        ? submission.tags
        : parseTags(submission.tags),

    status:
      "published"
  };

  const { error } = await supabase
    .from("heriland_events")
    .upsert(eventPayload, {
  onConflict: "slug"
});

  if (error) {
    console.error("heriland_events insert failed:", error);
    alert(error.message || "Event publish failed.");
    return false;
  }

  return publishExploreItem(submission, slug, image);
}

async function publishCulture(submission, slug, image){
  const culturePayload = {
    slug,

    title:
      submission.name,

    city:
      submission.city,

    area:
      submission.area,

    address:
      submission.address,

    short_description:
      submission.short_description,

    intro:
      submission.full_description,

    cultural_background:
      submission.cultural_background,

    what_to_notice:
      submission.what_to_notice,

    etiquette_tips:
      submission.etiquette_tips,

    google_map_url:
      submission.google_map_url,

    hero_image_url:
      image,

    card_image_url:
      image,

    gallery_urls:
      [],

    tags:
      Array.isArray(submission.tags)
        ? submission.tags
        : parseTags(submission.tags),

    status:
      "published"
  };

  const { error } = await supabase
    .from("heriland_cultures")
    .upsert(culturePayload, {
  onConflict: "slug"
});

  if (error) {
    console.error("heriland_cultures insert failed:", error);
    alert(error.message || "Culture publish failed.");
    return false;
  }

  return publishExploreItem(submission, slug, image);
}

async function publishTravelerStory(submission, slug, image){
  const storyPayload = {
    slug,

    title:
      submission.name,

    city:
      submission.city,

    area:
      submission.area,

    short_description:
      submission.short_description,

    story:
      submission.full_description,

    why_recommend:
      submission.why_recommend,

    google_map_url:
      submission.google_map_url,

    hero_image_url:
      image,

    card_image_url:
      image,

    gallery_urls:
      [],

    tags:
      Array.isArray(submission.tags)
        ? submission.tags
        : parseTags(submission.tags),

    status:
      "published"
  };

  const { error } = await supabase
    .from("heriland_traveler_stories")
    .upsert(storyPayload, {
  onConflict: "slug"
});

  if (error) {
    console.error("heriland_traveler_stories insert failed:", error);
    alert(error.message || "Traveler story publish failed.");
    return false;
  }

  return publishExploreItem(submission, slug, image);
}

async function publishExploreItem(submission, slug, image){
  const explorePayload = {
    slug,

    content_type:
      getExploreContentType(submission.type),

    city:
      submission.city,

    title:
      submission.name,

    subtitle:
      submission.short_description || "",

    tags:
      Array.isArray(submission.tags)
        ? submission.tags.join(", ")
        : submission.tags || "",

    image_url:
      image,

    loved_text:
      "New from travelers",

    loved_count:
      0,

    sort_order:
      999,

    is_active:
      true
  };

  const { error } = await supabase
    .from("explore_items")
    .upsert(explorePayload, {
  onConflict: "slug"
});

  if (error) {
    console.error("explore_items insert failed:", error);
    alert(error.message || "Explore card publish failed.");
    return false;
  }

  return true;
}

/* =========================
   Row Events
========================= */

function bindRowEvents(){
  document
    .querySelectorAll(".save-row-btn")
    .forEach((button) => {
      button.addEventListener("click", () => {
        saveRow(button.dataset.id);
      });
    });

  document
    .querySelectorAll(".status-select")
    .forEach((select) => {
      select.addEventListener("change", () => {
        select.classList.remove(
          "pending",
          "published",
          "rejected"
        );

        select.classList.add(select.value);
      });
    });

  document
    .querySelectorAll(
      ".admin-table input, .admin-table textarea, .admin-table select"
    )
    .forEach((field) => {
      field.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();

          const row = field.closest("tr");
          const id = row?.dataset.id;

          if (id) {
            saveRow(id);
          }
        }
      });
    });
}

/* =========================
   Selection
========================= */

function getSelectedIds(){
  return [
    ...document.querySelectorAll(".row-check:checked")
  ].map(input => input.dataset.id);
}

/* =========================
   Batch
========================= */

async function batchSaveEdited(){
  const ids = getSelectedIds();

  if (!ids.length) {
    alert("Please select at least one row.");
    return;
  }

  for (const id of ids) {
    await saveRow(id);
  }

  await loadSubmissions();
}

/* =========================
   Reject Modal
========================= */

function openRejectModal(ids){
  pendingRejectIds = ids;

  if (rejectReasonInput) {
    rejectReasonInput.value = "";
  }

  rejectLayer?.classList.add("is-open");
}

function closeRejectModal(){
  rejectLayer?.classList.remove("is-open");
  pendingRejectIds = [];
}

/* =========================
   Events
========================= */

refreshBtn?.addEventListener("click", loadSubmissions);

typeFilter?.addEventListener("change", renderTable);
statusFilter?.addEventListener("change", renderTable);

checkAll?.addEventListener("change", () => {
  document
    .querySelectorAll(".row-check")
    .forEach((box) => {
      box.checked = checkAll.checked;
    });
});

batchPublishBtn?.addEventListener("click", async () => {
  const ids = getSelectedIds();

  if (!ids.length) {
    alert("Please select at least one row.");
    return;
  }

  for (const id of ids) {
    const submission =
      await getSubmissionFromRow(id);

    if (!submission) continue;

    const ok =
      await publishSubmission(submission);

    if (!ok) return;

    const { error } = await supabase
      .from("user_submitted_places")
      .update({
        status: "published",
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      console.error("submission status update failed:", error);
      alert("Published content, but failed to update submission status.");
      return;
    }
  }

  alert("Published successfully.");
  await loadSubmissions();
});

batchRejectBtn?.addEventListener("click", () => {
  const ids = getSelectedIds();

  if (!ids.length) {
    alert("Please select at least one row.");
    return;
  }

  openRejectModal(ids);
});

batchSaveBtn?.addEventListener("click", batchSaveEdited);

rejectBackdrop?.addEventListener("click", closeRejectModal);
rejectCancelBtn?.addEventListener("click", closeRejectModal);

rejectConfirmBtn?.addEventListener("click", async () => {
  const reason = rejectReasonInput?.value.trim();

  if (!reason) {
    alert("Please enter a reject reason.");
    return;
  }

  const { error } = await supabase
    .from("user_submitted_places")
    .update({
      status: "rejected",
      admin_note: reason,
      updated_at: new Date().toISOString()
    })
    .in("id", pendingRejectIds);

  if (error) {
    console.error(error);
    alert("Reject failed.");
    return;
  }

  closeRejectModal();
  await loadSubmissions();
});

/* =========================
   Init
========================= */

(async () => {

  const ok = await requireAdmin();

  if (!ok) return;

  loadSubmissions();

})();
