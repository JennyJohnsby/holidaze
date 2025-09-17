import { onCreateVenue } from "../../ui/venues/create";
import { authGuard } from "../../utilities/authGuard";

authGuard();

const form = document.getElementById("createVenue");

if (!form) {
  console.warn("Create Venue form not found on this page.");
}

form?.addEventListener("submit", onCreateVenue);