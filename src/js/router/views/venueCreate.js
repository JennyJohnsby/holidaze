import { onCreateVenue } from "../../ui/venues/create";
import { authGuard } from "../../utilities/authGuard";

authGuard();

const form = document.getElementById("createVenue");

if (form) {
  form.addEventListener("submit", onCreateVenue);
}