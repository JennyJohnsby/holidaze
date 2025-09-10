import { createBooking } from "../../api/bookings/create.js";
import { displayBanner } from "../../utilities/banners.js";

export async function onCreateBooking(event) {
  event.preventDefault();

  const form = event.target;

  // Booking details
  const dateFrom = form.dateFrom.value;
  const dateTo = form.dateTo.value;
  const guests = Number(form.guests.value);
  const venueId = form.venueId.value.trim();

  // Validation
  if (!dateFrom) {
    displayBanner("Start date is required", "error");
    return;
  }

  if (!dateTo) {
    displayBanner("End date is required", "error");
    return;
  }

  if (!guests || guests <= 0) {
    displayBanner("Number of guests must be greater than 0", "error");
    return;
  }

  if (!venueId) {
    displayBanner("Venue ID is required", "error");
    return;
  }

  const bookingData = {
    dateFrom: new Date(dateFrom).toISOString(),
    dateTo: new Date(dateTo).toISOString(),
    guests,
    venueId,
  };

  try {
    const response = await createBooking(bookingData);
    displayBanner(
      `Booking created successfully for ${response.data.guests} guests!`,
      "success"
    );

    setTimeout(() => {
      window.location.href = "/profile/";
    }, 3000);
  } catch (error) {
    console.error("Failed to create booking:", error);
    displayBanner(`Failed to create booking: ${error.message}`, "error");
  }

  form.reset();
}

document.addEventListener("DOMContentLoaded", () => {
  const createBookingForm = document.getElementById("createBooking");

  if (createBookingForm) {
    createBookingForm.addEventListener("submit", onCreateBooking);
  } else {
    console.error("Create booking form could not be found in the DOM");
  }
});
