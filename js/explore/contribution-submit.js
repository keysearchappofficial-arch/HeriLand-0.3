// explore/contribution-submit.js

console.log("✅ contribution-submit.js loaded");

const MEDIA_SERVER_URL =
  "http://localhost:14800";

export function bindContributionSubmit(){

  console.log("📤 bindContributionSubmit()");

  const submitBtn =
    document.getElementById("contributionSubmitBtn");

  if (!submitBtn) {
    console.log("⛔ submit button not found");
    return;
  }

  submitBtn.addEventListener("click", async () => {

    console.log("📤 submit clicked");

    const type =
      submitBtn.dataset.type;

    const user =
      await window.getCurrentUser?.();

    if (!user) {
      alert("Please login to submit.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {

      const imageUrl =
        await uploadContributionImage(type);

      const payload =
        buildContributionPayload(
          type,
          user,
          imageUrl
        );

      console.log("📤 payload:", payload);

      if (!validateContributionPayload(payload)) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit for Review";
        return;
      }

      const { error } =
        await window.supabase
          .from("user_submitted_places")
          .insert(payload);

      if (error) {
        console.error("❌ submit failed:", error);
        alert(error.message || "Submit failed.");
        return;
      }

      alert("Submitted for review");

      window.openAvatarSubPage?.("contribute");

    } catch (error) {

      console.error("❌ submit error:", error);
      alert("Submit failed.");

    } finally {

      submitBtn.disabled = false;
      submitBtn.textContent = "Submit for Review";

    }

  });

  console.log("✅ contribution submit bound");
}

function buildContributionPayload(type, user, imageUrl){

  console.log("📦 buildContributionPayload:", type);

  if (type === "correction") {
    return {
      user_id: user?.id || null,
      type: "correction",

      name:
        getValue("correctionTargetTitle"),

      city:
        "All",

      target_type:
        getValue("correctionTargetType"),

      target_slug:
        getValue("correctionTargetSlug"),

      target_title:
        getValue("correctionTargetTitle"),

      correction_field:
        getValue("correctionField"),

      correction_detail:
        getValue("correctionDetail"),

      source_url:
        getValue("correctionSourceUrl"),

      why_recommend:
        getValue("contributionWhy"),

      status:
        "pending"
    };
  }

  return {
    user_id:
      user?.id || null,

    type,

    name:
      getValue("contributionName"),

    city:
      getValue("contributionCity"),

    area:
      getValue("contributionArea"),

    address:
      getValue("contributionAddress"),

    short_description:
      getValue("contributionShortDescription"),

    full_description:
      getValue("contributionFullDescription"),

    why_recommend:
      getValue("contributionWhy"),

    phone:
      getValue("contributionPhone"),

    website_url:
      getValue("contributionWebsite"),

    google_map_url:
      getValue("contributionMap"),

    image_url:
      imageUrl || "",

    card_image_url:
      imageUrl || "",

    detail_image_url:
      imageUrl || "",

    event_date:
      getValue("contributionEventDate") || null,

    event_time:
      getValue("contributionEventTime"),

    organizer:
      getValue("contributionOrganizer"),

    ticket_url:
      getValue("contributionTicket"),

    venue_name:
      getValue("contributionVenueName"),

    tags:
      parseContributionTags(),

    opening_hours:
      buildOpeningHours(),

    price_level:
      getValue("contributionPriceLevel"),

    cultural_background:
      getValue("contributionCulturalBackground"),

    what_to_notice:
      getValue("contributionWhatToNotice"),

    etiquette_tips:
      getValue("contributionEtiquetteTips"),

    status:
      "pending"
  };
}

function validateContributionPayload(payload){

  if (!payload.type) {
    alert("Missing contribution type.");
    return false;
  }

  if (payload.type === "correction") {

    if (
      !payload.target_title ||
      !payload.correction_detail
    ) {
      alert("Please fill in target title and correction detail.");
      return false;
    }

    return true;
  }

  if (!payload.name || !payload.city) {
    alert("Please fill in name and city.");
    return false;
  }

  return true;
}

function getValue(id){

  return (
    document
      .getElementById(id)
      ?.value
      ?.trim() || ""
  );

}

function parseContributionTags(){

  const value =
    getValue("contributionTags");

  return value
    .split(/[,，\n]/)
    .map(tag => tag.trim())
    .filter(Boolean);
}

function buildOpeningHours(){

  const value =
    getValue("contributionOpeningHours");

  if (!value) return null;

  return {
    label: value
  };
}

async function uploadContributionImage(type){

  console.log("🖼️ uploadContributionImage:", type);

  const input =
    document.getElementById("contributionImageFile");

  const file =
    input?.files?.[0];

  if (!file) {
    console.log("🖼️ no image selected");
    return "";
  }

  const name =
    getValue("contributionName") ||
    getValue("correctionTargetTitle") ||
    "heriland";

  const imageType =
    type === "event"
      ? "details"
      : "cards";

  const imageUrl =
    await uploadImageToLocalServer(
      file,
      imageType,
      name
    );

  console.log("✅ image uploaded:", imageUrl);

  return imageUrl;
}

async function uploadImageToLocalServer(file, type, slug){

  console.log("🖼️ uploadImageToLocalServer:", {
    file: file.name,
    type,
    slug
  });

  const formData =
    new FormData();

  formData.append("image", file);
  formData.append("type", type);
  formData.append("slug", slug || "heriland");

  const res =
    await fetch(`${MEDIA_SERVER_URL}/api/upload-image`, {
      method: "POST",
      body: formData
    });

  const data =
    await res.json();

  console.log("🖼️ media server response:", data);

  if (!data.ok) {
    throw new Error(
      data.message || "Upload failed"
    );
  }

  return data.imageUrl;
}