import { API_PROFILE, API_KEY } from "../constants.js";

export async function fetchUserBookings(usernameOverride = null) {
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  const username = usernameOverride || storedUser?.name;
  const token = localStorage.getItem("authToken");

  if (!username || !token) {
    return { data: [], error: "No username or token found. Please log in.", status: 401 };
  }

  const url = `${API_PROFILE}/${username}/bookings`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    const result = await response.json();
    const data = result.data ?? [];

    if (!response.ok) {
      const errorMessage =
        result.errors?.[0]?.message ||
        (response.status === 401
          ? "Unauthorized. Please log in again."
          : response.status === 404
          ? `No bookings found for ${username}.`
          : `Failed to fetch bookings: ${response.statusText}`);

      return { data: [], error: errorMessage, status: response.status };
    }

    console.info("[Bookings API] Bookings fetched successfully:", data);
    return { data, error: null, status: response.status };
  } catch (error) {
    console.error("[Bookings API] Network error:", error);
    return { data: [], error: "Network error while fetching bookings.", status: 500 };
  }
}
