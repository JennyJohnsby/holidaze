import { onCreateVenue } from "../../ui/venues/create.js";
import { authGuard } from "../../utilities/authGuard.js";

authGuard();

console.log("[VenueCreate View] Loaded");

const form = document.getElementById("createVenue");

if (!form) {
  console.warn("[VenueCreate View] Create Venue form not found in the DOM.");
} else {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    onCreateVenue(event);
  });
}