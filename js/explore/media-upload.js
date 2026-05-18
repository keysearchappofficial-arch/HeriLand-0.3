// explore/media-upload.js

console.log("✅ media-upload.js loaded");

export const MEDIA_SERVER_URL =
  "http://localhost:14800";

export async function uploadImageFile({
  file,
  type = "cards",
  slug = "heriland"
}){

  console.log("🖼️ uploadImageFile()");
  console.log("file:", file?.name);
  console.log("type:", type);
  console.log("slug:", slug);

  if (!file) {
    console.log("⛔ no file");
    return "";
  }

  try {

    const formData =
      new FormData();

    formData.append("image", file);
    formData.append("type", type);
    formData.append("slug", slug);

    console.log("📤 uploading image...");

    const response =
      await fetch(
        `${MEDIA_SERVER_URL}/api/upload-image`,
        {
          method: "POST",
          body: formData
        }
      );

    console.log(
      "📥 upload status:",
      response.status
    );

    const data =
      await response.json();

    console.log(
      "📥 upload response:",
      data
    );

    if (!data.ok) {
      throw new Error(
        data.message || "Upload failed"
      );
    }

    console.log(
      "✅ image uploaded:",
      data.imageUrl
    );

    return data.imageUrl || "";

  } catch (error) {

    console.error(
      "❌ uploadImageFile error:",
      error
    );

    throw error;

  }

}

export async function uploadMultipleImages({
  files = [],
  type = "gallery",
  slug = "heriland"
}){

  console.log("🖼️ uploadMultipleImages()");
  console.log("files count:", files.length);

  const uploaded = [];

  for (const file of files) {

    try {

      const imageUrl =
        await uploadImageFile({
          file,
          type,
          slug
        });

      uploaded.push(imageUrl);

    } catch (error) {

      console.error(
        "❌ multi upload failed:",
        file?.name,
        error
      );

    }

  }

  console.log(
    "✅ multiple uploaded:",
    uploaded
  );

  return uploaded;
}

window.uploadImageFile =
  uploadImageFile;

window.uploadMultipleImages =
  uploadMultipleImages;