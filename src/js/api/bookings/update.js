import { API_BOOKINGS, API_KEY } from "../constants"

export async function updateBooking(id, updates = {}) {
  const token = localStorage.getItem("authToken")
  if (!id) return { data: null, error: "Booking ID is required", status: 400 }
  if (!token) return { data: null, error: "No token found. Please log in.", status: 401 }

  const payload = {
    ...(updates.dateFrom && { dateFrom: updates.dateFrom }),
    ...(updates.dateTo && { dateTo: updates.dateTo }),
    ...(typeof updates.guests === "number" && { guests: updates.guests }),
  }

  try {
    const response = await fetch(`${API_BOOKINGS}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      const errorMessage = result.errors?.[0]?.message || response.statusText
      console.error("[UpdateBooking API] Error:", errorMessage)
      return { data: null, error: errorMessage, status: response.status }
    }

    console.info("[UpdateBooking API] Booking updated:", result.data)
    return { data: result.data, meta: result.meta, error: null, status: response.status }
  } catch (err) {
    console.error("[UpdateBooking API] Network error:", err)
    return { data: null, error: "Network error while updating booking", status: 500 }
  }
}