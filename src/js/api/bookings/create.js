import { API_BOOKINGS, API_KEY } from "../constants"

export async function createBooking(data) {
  const token = localStorage.getItem("authToken")
  if (!token) {
    return {
      data: null,
      error: "No token found. Please log in.",
      status: 401,
    }
  }

  if (!data?.dateFrom || !data?.dateTo || !data?.guests || !data?.venueId) {
    return {
      data: null,
      error: "dateFrom, dateTo, guests, and venueId are required.",
      status: 400,
    }
  }

  const payload = {
    dateFrom: data.dateFrom,
    dateTo: data.dateTo,
    guests: Number(data.guests),
    venueId: data.venueId,
  }

  try {
    const response = await fetch(API_BOOKINGS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      return {
        data: null,
        error:
          result?.errors?.[0]?.message ||
          result?.message ||
          response.statusText,
        status: response.status,
      }
    }

    return {
      data: result.data,
      error: null,
      status: response.status,
    }
  } catch (err) {
    console.error("[CreateBooking API]", err)
    return {
      data: null,
      error: "Network error while creating booking",
      status: 500,
    }
  }
}
