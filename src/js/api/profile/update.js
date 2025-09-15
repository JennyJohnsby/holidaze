import { API_KEY } from "../constants.js";

export async function updateProfile({ bio, avatar, banner, avatarFile }) {
  const userInLocalStorage = JSON.parse(localStorage.getItem("currentUser"));
  const username = userInLocalStorage ? userInLocalStorage.name : null;
  const token = localStorage.getItem("authToken");

  if (!username || !token) {
    throw new Error("No username or token found in localStorage.");
  }

  const url = `https://v2.api.noroff.dev/auction/profiles/${username}`;

  if (!bio && !avatar && !banner && !avatarFile) {
    throw new Error(
      "At least one of bio, avatar, banner, or avatarFile must be provided.",
    );
  }

  let formData = new FormData();
  if (avatarFile) {
    if (!["image/jpeg", "image/png"].includes(avatarFile.type)) {
      throw new Error("Invalid file type. Please upload a JPEG or PNG image.");
    }
    formData.append("avatar", avatarFile);
  }

  if (bio) {
    formData.append("bio", bio);
  }

  if (avatar?.url) {
    formData.append("avatarUrl", avatar.url);
  }

  if (banner?.url) {
    formData.append("bannerUrl", banner.url);
  }

  try {
    let response;
    if (avatarFile) {
      response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: formData,
      });
    } else {
      response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify({
          bio,
          ...(avatar?.url ? { avatar } : {}),
          ...(banner?.url ? { banner } : {}),
        }),
      });
    }

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`Error: ${errorDetails.message || response.statusText}`);
    }

    const updatedProfile = await response.json();
    if (!updatedProfile) {
      throw new Error("Profile update failed: No response data.");
    }

    return updatedProfile;
  } catch (error) {
    console.error("Failed to update profile:", error.message || error);
    throw error;
  }
}