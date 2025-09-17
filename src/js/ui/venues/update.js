import { updateVenue } from "../../api/venues/update.js";
import { displayBanner } from "../../utilities/banners.js";

export async function onUpdateVenue(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const venueId = formData.get("id");
  const name = formData.get("name")?.trim();
  const description = formData.get("description")?.trim();
  const price = formData.get("price") ? Number(formData.get("price")) : undefined;
  const maxGuests = formData.get("maxGuests") ? Number(formData.get("maxGuests")) : undefined;
  const rating = formData.get("rating") ? Number(formData.get("rating")) : undefined;

  const mediaUrl = formData.get("mediaUrl")?.trim();
  const mediaAlt = formData.get("mediaAlt")?.trim();
  const media = mediaUrl ? [{ url: mediaUrl, alt: mediaAlt || "" }] : undefined;

  const meta = {
    wifi: formData.get("wifi") === "on",
    parking: formData.get("parking") === "on",
    breakfast: formData.get("breakfast") === "on",
    pets: formData.get("pets") === "on",
  };

  const location = {
    address: formData.get("address")?.trim(),
    city: formData.get("city")?.trim(),
    zip: formData.get("zip")?.trim(),
    country: formData.get("country")?.trim(),
    continent: formData.get("continent")?.trim(),
    lat: formData.get("lat") ? Number(formData.get("lat")) : undefined,
    lng: formData.get("lng") ? Number(formData.get("lng")) : undefined,
  };

  const updatedVenue = {};
  if (name) updatedVenue.name = name;
  if (description) updatedVenue.description = description;
  if (price !== undefined) updatedVenue.price = price;
  if (maxGuests !== undefined) updatedVenue.maxGuests = maxGuests;
  if (rating !== undefined) updatedVenue.rating = rating;
  if (media) updatedVenue.media = media;
  if (meta) updatedVenue.meta = meta;
  if (location) updatedVenue.location = location;

  try {
    const response = await updateVenue(venueId, updatedVenue);
    console.log("Venue updated successfully:", response);
    displayBanner("Venue updated successfully!", "success");
  } catch (error) {
    console.error("Error updating venue:", error);

    if (error.message.includes("400")) {
      displayBanner("The information provided is incomplete or invalid. Please check and try again.", "error");
    } else if (error.message.includes("401")) {
      displayBanner("You must be logged in to make changes to this venue.", "error");
    } else if (error.message.includes("404")) {
      displayBanner("This venue does not exist or has been removed.", "error");
    } else if (error.message.includes("500")) {
      displayBanner("There was an issue with the server. Please try again later.", "error");
    } else {
      displayBanner("An unexpected error occurred. Please try again.", "error");
    }
  }
}