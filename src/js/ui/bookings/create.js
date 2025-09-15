import { API_BOOKINGS } from "../constants.js";

export async function createBooking(bookingData) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("You must be logged in to make a booking.");
  }

  const response = await fetch(API_BOOKINGS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookingData),
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMsg = result.errors?.[0]?.message || "Booking failed.";
    throw new Error(errorMsg);
  }

  return result;
}
