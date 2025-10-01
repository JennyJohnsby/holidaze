import { API_BOOKINGS, API_KEY } from "../constants";

/**
 * Create a new booking
 * @param {object} bookingData - { dateFrom, dateTo, guests, venueId }
 */
export async function createBooking(bookingData) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return { data: null, error: "No token found. Please log in.", status: 401 };
  }

  try {
    const response = await fetch(API_BOOKINGS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(bookingData),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { data: null, error: result.errors?.[0]?.message || response.statusText, status: response.status };
    }

    return { data: result.data, error: null, status: response.status };
  } catch (err) {
    console.error("[CreateBooking API]", err);
    return { data: null, error: "Network error while creating booking", status: 500 };
  }
}