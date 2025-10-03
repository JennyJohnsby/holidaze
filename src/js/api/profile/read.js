import { API_PROFILE, API_KEY } from "../constants.js"

export async function readProfile({ includeBookings = false, includeVenues = false } = {}) {
  const storedUser = JSON.parse(localStorage.getItem("profile"))
  const username = storedUser?.name
  const token = localStorage.getItem("token")

  if (!username || !token) {
    return { data: null, error: "No username or token found. Please log in.", status: 401 }
  }

  try {
    const url = new URL(`${API_PROFILE}/${username}`)
    if (includeBookings) url.searchParams.append("_bookings", "true")
    if (includeVenues) url.searchParams.append("_venues", "true")

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      const errorMessage =
        result.errors?.[0]?.message ||
        (response.status === 401
          ? "Unauthorized. Please log in again."
          : response.status === 404
          ? `Profile for ${username} not found.`
          : `Failed to fetch profile: ${response.statusText}`)

      console.error("[ReadProfile API] Error:", errorMessage)
      return { data: null, error: errorMessage, status: response.status }
    }

    console.info("[ReadProfile API] Profile fetched successfully:", result.data)
    return { data: result.data, meta: result.meta, error: null, status: response.status }
  } catch (error) {
    console.error("[ReadProfile API] Network error:", error)
    return { data: null, error: "Network error while fetching profile.", status: 500 }
  }
}