import { readVenue } from "../../api/venues/read.js";
import { updateVenue } from "../../api/venues/update.js";
import { displayBanner } from "../../utilities/banners.js";
import { authGuard } from "../../utilities/authGuard.js";

authGuard();

const form = document.forms.editVenue;
const url = new URL(window.location.href);
const id = url.searchParams.get("id");

if (!id) {
  displayBanner("No venue ID found.", "error");
  setTimeout(() => (window.location.href = "/"), 2000);
  throw new Error("No venue ID found.");
}

async function prefillEditForm() {
  try {
    const { data: venue } = await readVenue(id);
    if (!venue) throw new Error("Venue not found");

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.id !== venue.ownerId) {
      displayBanner("You are not authorized to edit this venue.", "error");
      setTimeout(() => (window.location.href = "/"), 2000);
      return;
    }

    for (const field of form.elements) {
      if (venue[field.name] !== undefined) {
        field.value = venue[field.name];
      } else if (venue.location?.[field.name] !== undefined) {
        field.value = venue.location[field.name];
      } else if (
        venue.meta?.[field.name] !== undefined &&
        field.type === "checkbox"
      ) {
        field.checked = venue.meta[field.name];
      } else if (field.name === "mediaUrl") {
        field.value = venue.media?.[0]?.url || "";
      } else if (field.name === "mediaAlt") {
        field.value = venue.media?.[0]?.alt || "";
      }
    }
  } catch (err) {
    console.error(err);
    displayBanner("Failed to load venue details.", "error");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedVenue = {
    name: form.name.value.trim(),
    description: form.description.value.trim(),
    price: Number(form.price.value) || 0,
    maxGuests: Number(form.maxGuests.value) || 0,
    rating: Number(form.rating.value) || 0,
    media: form.mediaUrl.value
      ? [{ url: form.mediaUrl.value, alt: form.mediaAlt.value }]
      : [],
    meta: {
      wifi: form.wifi.checked,
      parking: form.parking.checked,
      breakfast: form.breakfast.checked,
      pets: form.pets.checked,
    },
    location: {
      address: form.address.value,
      city: form.city.value,
      zip: form.zip.value,
      country: form.country.value,
      continent: form.continent.value,
      lat: Number(form.lat.value) || 0,
      lng: Number(form.lng.value) || 0,
    },
  };

  const { error } = await updateVenue(id, updatedVenue);
  if (error) {
    displayBanner("Failed to update venue.", "error");
    return;
  }

  displayBanner("✅ Venue updated successfully!", "success");
  setTimeout(() => (window.location.href = "/profile/"), 2000);
});

prefillEditForm();