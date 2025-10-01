import { API_BOOKINGS } from "../constants.js"

export async function createBooking(bookingData) {
  const token = localStorage.getItem("authToken")

  if (!token) {
    return { data: null, error: "You must be logged in to make a booking.", status: 401 }
  }

  try {
    const response = await fetch(API_BOOKINGS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return { data: null, error: data.errors?.[0]?.message || "Booking failed.", status: response.status }
    }

    return { data, error: null, status: response.status }
  } catch (err) {
    return { data: null, error: err.message, status: 500 }
  }
}
