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

  // Build payload
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

    console.info("[Profile UI] Profile updated:", data);
    displayBanner("Profile updated successfully!", "success");

    // Update DOM
    const avatarElement = document.querySelector("#profile-view .profile-avatar");
    if (avatarElement) {
      avatarElement.src = data.avatar?.url || "/images/avatar-placeholder.png";
      avatarElement.alt = data.avatar?.alt ?? "User Avatar";
    }

    const bannerElement = document.querySelector("#profile-view .profile-banner-image");
    if (bannerElement) {
      bannerElement.src = data.banner?.url || "/images/banner-placeholder.jpg";
      bannerElement.alt = data.banner?.alt ?? "User Banner";
    }

    const bioElement = document.querySelector("#profile-view .profile-bio");
    if (bioElement) {
      bioElement.textContent = data.bio || "No bio available";
    }

    const creditsElement = document.querySelector("#profile-view .profile-credits");
    if (creditsElement) {
      creditsElement.textContent = `Total Credit: ${data.credits ?? 0}`;
    }

    const profileTypeElement = document.querySelector("#profile-view .profile-type");
    if (profileTypeElement) {
      profileTypeElement.textContent = data.venueManager ? "Venue Manager" : "Regular User";
    }
  } catch (error) {
    console.error("[Profile UI] Error updating profile:", error);
    displayBanner(error.message || "An unexpected error occurred.", "error");
  }
}
