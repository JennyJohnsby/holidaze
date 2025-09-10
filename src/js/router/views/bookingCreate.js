import { onCreateBooking } from "../../ui/bookings/create";
import { authGuard } from "../../utilities/authGuard";

authGuard();

const form = document.forms.createBookings;

form.addEventListener("submit", onCreateBooking);