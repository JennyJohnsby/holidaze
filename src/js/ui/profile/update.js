import { updateProfile } from "../../api/profile/update.js";
import { displayBanner } from "../../utilities/banners.js";

export async function onUpdateProfile(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const bio = formData.get("bio")?.trim();
  const avatarUrl = formData.get("avatarUrl")?.trim();
  const avatarAlt = formData.get("avatarAlt")?.trim();
  const bannerUrl = formData.get("bannerUrl")?.trim();
  const bannerAlt = formData.get("bannerAlt")?.trim();

  const profileData = {};
  if (bio) profileData.bio = bio;
  if (avatarUrl) profileData.avatar = { url: avatarUrl, alt: avatarAlt || "" };
  if (bannerUrl) profileData.banner = { url: bannerUrl, alt: bannerAlt || "" };

  try {
    const { data, error } = await updateProfile(profileData);

    if (error) {
      displayBanner(error, "error");
      return;
    }

    displayBanner("Profile updated successfully!", "success");
    window.location.href = "/profile/";
  } catch (error) {
    console.error("[Profile UI] Error updating profile:", error);
    displayBanner(error.message || "An unexpected error occurred.", "error");
  }
}