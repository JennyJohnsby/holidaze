import { onCreateBooking } from "../../ui/bookings/create.js";
import { authGuard } from "../../utilities/authGuard.js";

authGuard();

console.log("[BookingCreate View] Loaded");

const form = document.getElementById("createBooking");

if (!form) {
  console.warn("[BookingCreate View] Create Booking form not found in the DOM.");
} else {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    onCreateBooking(event);
  });
}
