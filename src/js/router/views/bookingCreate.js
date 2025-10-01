import { onCreateBooking } from "../../ui/bookings/create.js";
import { authGuard } from "../../utilities/authGuard.js";

export function renderCreateBookingView() {
  authGuard();

  const app = document.querySelector("#app");
  app.innerHTML = `
    <h1>Create Booking</h1>
    <form name="createBookings">
      <label for="venueId">Venue ID</label>
      <input id="venueId" type="text" name="venueId" required />

      <label for="dateFrom">Date From</label>
      <input id="dateFrom" type="date" name="dateFrom" required />

      <label for="dateTo">Date To</label>
      <input id="dateTo" type="date" name="dateTo" required />

      <button type="submit">Create Booking</button>
    </form>
    <div id="bookingMessage"></div>
  `;

  const form = document.forms.createBookings;
  if (form) {
    form.addEventListener("submit", onCreateBooking);
  } else {
    console.error("[BookingsCreate View] createBookings form not found");
  }
}