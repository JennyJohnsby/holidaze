import { onCreateVenue } from "../../ui/venues/create";
import { authGuard } from "../../utilities/authGuard";

authGuard();

const form = document.forms.createVenues;

form.addEventListener("submit", onCreateVenue);