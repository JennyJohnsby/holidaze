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

  const avatar = avatarUrl ? { url: avatarUrl, alt: avatarAlt || "" } : null;
  const banner = bannerUrl ? { url: bannerUrl, alt: bannerAlt || "" } : null;

  const profileData = { bio, avatar, banner };

  try {
    const updatedProfile = await updateProfile(profileData);
    console.log("Profile updated successfully:", updatedProfile);

    displayBanner("Profile updated successfully!", "success");

    const avatarElement = document.querySelector(".profile-avatar");
    if (avatarElement) {
      avatarElement.src =
        updatedProfile.avatar?.url || "public/images/avatar-placeholder.png";
      avatarElement.alt = updatedProfile.avatar?.alt || "User Avatar";
    }

    const bannerElement = document.querySelector(".profile-banner-image");
    if (bannerElement) {
      bannerElement.src =
        updatedProfile.banner?.url || "public/images/banner-placeholder.jpg";
      bannerElement.alt = updatedProfile.banner?.alt || "User Banner";
    }

    const bioElement = document.querySelector(".profile-bio");
    if (bioElement) {
      bioElement.textContent = updatedProfile.bio || "No bio available";
    }

    const creditsElement = document.querySelector(".profile-credits");
    if (creditsElement) {
      creditsElement.textContent = `Total Credit: ${updatedProfile.credits || 0}`;
    }

    const profileTypeElement = document.querySelector(".profile-type");
    if (profileTypeElement) {
      profileTypeElement.textContent =
        updatedProfile.venueManager !== undefined
          ? updatedProfile.venueManager
            ? "Venue Manager"
            : "Regular User"
          : "User";
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    displayBanner(error.message || "An unexpected error occurred.", "error");
  }
}