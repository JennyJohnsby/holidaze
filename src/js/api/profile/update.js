import { API_PROFILES, API_KEY } from "../constants";

/**
 * Update the logged-in user's profile
 * @param {object} updates - Fields to update { bio, avatar, banner }
 * @returns {Promise<{ data: object|null, error: string|null, status: number }>}
 */
export async function updateProfile({ bio, avatar, banner } = {}) {
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  const username = storedUser?.name;
  const token = localStorage.getItem("authToken");

  if (!username || !token) {
    return { data: null, error: "No username or token found. Please log in.", status: 401 };
  }

  if (!bio && !avatar?.url && !banner?.url) {
    return { data: null, error: "At least one of bio, avatar, or banner must be provided.", status: 400 };
  }

  const url = `${API_PROFILES}/${username}`;

  const payload = {};
  if (bio) payload.bio = bio;
  if (avatar?.url) payload.avatar = { url: avatar.url, alt: avatar.alt ?? "" };
  if (banner?.url) payload.banner = { url: banner.url, alt: banner.alt ?? "" };

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = result.errors?.[0]?.message || response.statusText;
      console.error("[UpdateProfile API] Error:", errorMessage);
      return { data: null, error: errorMessage, status: response.status };
    }

    console.info("[UpdateProfile API] Profile updated:", result.data);
    return { data: result.data, error: null, status: response.status };
  } catch (err) {
    console.error("[UpdateProfile API] Network error:", err);
    return { data: null, error: "Network error while updating profile.", status: 500 };
  }
}