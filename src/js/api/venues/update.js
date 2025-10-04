import { API_VENUES, API_KEY } from "../constants"

export async function updateVenue(id, updates = {}) {
  const token = localStorage.getItem("token")
  if (!id) return { data: null, error: "Venue ID is required", status: 400 }
  if (!token) return { data: null, error: "No token found. Please log in.", status: 401 }

  const payload = {
    ...(updates.name && { name: updates.name }),
    ...(updates.description && { description: updates.description }),
    ...(typeof updates.price === "number" && { price: updates.price }),
    ...(updates.maxGuests && { maxGuests: updates.maxGuests }),
    ...(updates.media && { media: updates.media }),
    ...(updates.meta && { meta: updates.meta }),
    ...(updates.location && { location: updates.location }),
  }

  try {
    const response = await fetch(`${API_VENUES}/${id}`, {
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
      console.error("[UpdateVenue API] Error:", errorMessage)
      return { data: null, error: errorMessage, status: response.status }
    }

    console.info("[UpdateVenue API] Venue updated:", result.data)
    return { data: result.data, meta: result.meta, error: null, status: response.status }
  } catch (err) {
    console.error("[UpdateVenue API] Network error:", err)
    return { data: null, error: "Network error while updating venue", status: 500 }
  }
}