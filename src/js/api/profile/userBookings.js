import { API_PROFILE, API_KEY } from "../constants.js";

/**
 * Fetch bookings for a user profile
 * @param {string|null} usernameOverride 
 * @param {object} options 
 * @param {boolean} options.includeVenue 
 * @param {boolean} options.includeCustomer 
 */
export async function fetchUserBookings(
  usernameOverride = null,
  { includeVenue = false, includeCustomer = false } = {}
) {
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  const username = usernameOverride || storedUser?.name;
  const token = localStorage.getItem("authToken");

  if (!username || !token) {
    return { data: [], error: "No username or token found. Please log in.", status: 401 };
  }

  const url = new URL(`${API_PROFILE}/${username}/bookings`);
  if (includeVenue) url.searchParams.append("_venue", "true");
  if (includeCustomer) url.searchParams.append("_customer", "true");

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
          ? `No bookings found for ${username}.`
          : `Failed to fetch bookings: ${response.statusText}`);

      console.error("[UserBookings API] Error:", errorMessage);
      return { data: [], error: errorMessage, status: response.status };
    }

    console.info("[UserBookings API] Bookings fetched successfully:", data);
    return { data, meta: result.meta, error: null, status: response.status };
  } catch (error) {
    console.error("[UserBookings API] Network error:", error);
    return { data: [], error: "Network error while fetching bookings.", status: 500 };
  }
}