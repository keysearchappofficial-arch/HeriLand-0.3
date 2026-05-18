// explore/supabase-api.js

console.log("✅ supabase-api.js loaded");

export async function fetchExploreItems(){

  console.log("🗄️ fetchExploreItems()");

  const { data, error } =
    await window.supabase
      .from("explore_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ fetchExploreItems failed:", error);
    throw error;
  }

  console.log("✅ explore items:", data?.length || 0);

  return data || [];
}

export async function updateExploreLovedCount(slug, lovedCount){

  console.log("🗄️ updateExploreLovedCount()", {
    slug,
    lovedCount
  });

  const { data, error } =
    await window.supabase
      .from("explore_items")
      .update({
        loved_count: lovedCount
      })
      .eq("slug", slug)
      .select("slug,loved_count")
      .single();

  if (error) {
    console.error("❌ updateExploreLovedCount failed:", error);
    throw error;
  }

  console.log("✅ loved count updated:", data);

  return data;
}

export async function insertUserSubmission(payload){

  console.log("🗄️ insertUserSubmission()");
  console.log("payload:", payload);

  const { data, error } =
    await window.supabase
      .from("user_submitted_places")
      .insert(payload)
      .select("*")
      .single();

  if (error) {
    console.error("❌ insertUserSubmission failed:", error);
    throw error;
  }

  console.log("✅ submission inserted:", data);

  return data;
}