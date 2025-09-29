import { API_BOOKINGS, API_KEY } from "../constants.js";

export async function createBooking({ dateFrom, dateTo, guests, venueId }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.accessToken;

  if (!token) throw new Error("You must be logged in to create a booking");

  const response = await fetch(API_BOOKINGS, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dateFrom,
      dateTo,
      guests,
      venueId,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.errors?.[0]?.message || `Booking failed (${response.status})`);
  }

  const { data } = await response.json();
  return data;
}