import { API_BOOKINGS, API_KEY } from "../constants";

/**
 * Update an existing booking
 * @param {string} id - Booking ID
 * @param {object} updates - Fields to update
 */
export async function updateBooking(id, updates = {}) {
  const token = localStorage.getItem("authToken");
  if (!id) return { data: null, error: "Booking ID is required", status: 400 };
  if (!token) return { data: null, error: "No token found. Please log in.", status: 401 };

  try {
    const response = await fetch(`${API_BOOKINGS}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(updates),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { data: null, error: result.errors?.[0]?.message || response.statusText, status: response.status };
    }

    return { data: result.data, error: null, status: response.status };
  } catch (err) {
    console.error("[UpdateBooking API]", err);
    return { data: null, error: "Network error while updating booking", status: 500 };
  }
}