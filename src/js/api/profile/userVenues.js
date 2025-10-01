import { API_PROFILE, API_KEY } from "../constants.js";

/**
 * Fetch venues for a user profile
 * @param {string|null} usernameOverride - Optional username override (defaults to currentUser from localStorage)
 * @param {object} options - Extra query params
 * @param {boolean} options.includeBookings - Include bookings data for each venue
 */
export async function fetchUserVenues(
  usernameOverride = null,
  { includeBookings = false } = {}
) {
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  const username = usernameOverride || storedUser?.name;
  const token = localStorage.getItem("authToken");

  if (!username || !token) {
    return { data: [], error: "No username or token found. Please log in.", status: 401 };
  }

  const url = new URL(`${API_PROFILE}/${username}/venues`);
  if (includeBookings) url.searchParams.append("_bookings", "true");

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    const result = await response.json().catch(() => ({}));
    const data = result.data ?? [];

    if (!response.ok) {
      const errorMessage =
        result.errors?.[0]?.message ||
        (response.status === 401
          ? "Unauthorized. Please log in again."
          : response.status === 404
          ? `No venues found for ${username}.`
          : `Failed to fetch venues: ${response.statusText}`);

      console.error("[UserVenues API] Error:", errorMessage);
      return { data: [], error: errorMessage, status: response.status };
    }

    console.info("[UserVenues API] Venues fetched successfully:", data);
    return { data, meta: result.meta, error: null, status: response.status };
  } catch (error) {
    console.error("[UserVenues API] Network error:", error);
    return { data: [], error: "Network error while fetching venues.", status: 500 };
  }
}