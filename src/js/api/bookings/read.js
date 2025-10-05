import { API_BOOKINGS, API_KEY } from "../constants"

export async function readBooking(
  id,
  { includeVenue = true, includeCustomer = true } = {}
) {
  if (!id) {
    return { data: null, error: "Booking ID is required", status: 400 }
  }

  try {
    const url = new URL(`${API_BOOKINGS}/${id}`)
    if (includeVenue) url.searchParams.append("_venue", "true")
    if (includeCustomer) url.searchParams.append("_customer", "true")

    const token = localStorage.getItem("token")

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      const errorMessage =
        result.errors?.[0]?.message ||
        (response.status === 404 ? "Booking not found." : response.statusText)

      console.error("[ReadBooking API] Error:", errorMessage)
      return { data: null, error: errorMessage, status: response.status }
    }

    console.info("[ReadBooking API] Booking fetched:", result.data)
    return {
      data: result.data,
      meta: result.meta,
      error: null,
      status: response.status,
    }
  } catch (err) {
    console.error("[ReadBooking API] Network error:", err)
    return {
      data: null,
      error: "Network error while fetching booking",
      status: 500,
    }
  }
}