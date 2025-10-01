import { API_BOOKINGS, API_KEY } from "../constants";

/**
 * Read a booking by ID
 * @param {string} id - Booking ID
 * @param {object} [options] - Optional query params
 * @param {boolean} [options.includeVenue=false]
 * @param {boolean} [options.includeCustomer=false]
 */
export async function readBooking(id, { includeVenue = false, includeCustomer = false } = {}) {
  if (!id) return { data: null, error: "Booking ID is required", status: 400 };

  try {
    const url = new URL(`${API_BOOKINGS}/${id}`);
    if (includeVenue) url.searchParams.append("_venue", "true");
    if (includeCustomer) url.searchParams.append("_customer", "true");

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { data: null, error: result.errors?.[0]?.message || response.statusText, status: response.status };
    }

    return { data: result.data, error: null, status: response.status };
  } catch (err) {
    console.error("[ReadBooking API]", err);
    return { data: null, error: "Network error while fetching booking", status: 500 };
  }
}