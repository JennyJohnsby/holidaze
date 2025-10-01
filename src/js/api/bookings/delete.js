import { API_BOOKINGS, API_KEY } from "../constants";

/**
 * Delete a booking by ID
 * @param {string} id - Booking ID
 */
export async function deleteBooking(id) {
  const token = localStorage.getItem("authToken");
  if (!id) return { success: false, error: "Booking ID is required", status: 400 };
  if (!token) return { success: false, error: "No token found. Please log in.", status: 401 };

  try {
    const response = await fetch(`${API_BOOKINGS}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (response.status === 204) {
      return { success: true, error: null, status: 204 };
    }

    const result = await response.json().catch(() => ({}));
    return { success: false, error: result.errors?.[0]?.message || "Failed to delete booking", status: response.status };
  } catch (err) {
    console.error("[DeleteBooking API]", err);
    return { success: false, error: "Network error while deleting booking", status: 500 };
  }
}