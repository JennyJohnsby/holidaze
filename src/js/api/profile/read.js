import { API_PROFILE, API_KEY } from "../constants.js"

export async function readProfile({
  username,
  includeBookings = false,
  includeVenues = false,
  includeBookingVenue = false,
} = {}) {
  const storedProfile = JSON.parse(localStorage.getItem("profile"))
  const name = username || storedProfile?.name
  const token = localStorage.getItem("token")

  if (!name || !token) {
    return {
      data: null,
      error: "No username or token found. Please log in.",
      status: 401,
    }
  }

  try {
    const url = new URL(`${API_PROFILE}/${name}`)

    if (includeBookings) url.searchParams.append("_bookings", "true")
    if (includeBookingVenue) url.searchParams.append("_bookings", "venue")
    if (includeVenues) url.searchParams.append("_venues", "true")

    console.log("[readProfile] Fetching:", url.toString())

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
          ? `Profile for ${name} not found.`
          : `Failed to fetch profile: ${response.statusText}`)
      return { data: null, error: errorMessage, status: response.status }
    }

    return {
      data: result.data ?? result,
      meta: result.meta,
      error: null,
      status: response.status,
    }
  } catch (err) {
    console.error("[readProfile] Network error:", err)
    return {
      data: null,
      error: "Network error while fetching profile.",
      status: 500,
    }
  }
}