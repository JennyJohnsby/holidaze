import { updateVenue } from "../../api/venues/update.js"
import { displayBanner } from "../../utilities/banners.js"

export async function onUpdateVenue(event) {
  event.preventDefault()

  const form = event.target
  const formData = new FormData(form)

  const venueId = formData.get("id")
  if (!venueId) {
    displayBanner("Venue ID is missing.", "error")
    return
  }

  const updatedVenue = {}

  const name = formData.get("name")?.trim()
  if (name) updatedVenue.name = name

  const description = formData.get("description")?.trim()
  if (description) updatedVenue.description = description

  const price = formData.get("price")
  if (price) updatedVenue.price = Number(price)

  const maxGuests = formData.get("maxGuests")
  if (maxGuests) updatedVenue.maxGuests = Number(maxGuests)

  const rating = formData.get("rating")
  if (rating) updatedVenue.rating = Number(rating)

  const mediaUrl = formData.get("mediaUrl")?.trim()
  const mediaAlt = formData.get("mediaAlt")?.trim()
  if (mediaUrl) updatedVenue.media = [{ url: mediaUrl, alt: mediaAlt || "" }]

  updatedVenue.meta = {
    wifi: formData.get("wifi") === "on",
    parking: formData.get("parking") === "on",
    breakfast: formData.get("breakfast") === "on",
    pets: formData.get("pets") === "on",
  }

  updatedVenue.location = {
    address: formData.get("address")?.trim() || null,
    city: formData.get("city")?.trim() || null,
    zip: formData.get("zip")?.trim() || null,
    country: formData.get("country")?.trim() || null,
    continent: formData.get("continent")?.trim() || null,
    lat: formData.get("lat") ? Number(formData.get("lat")) : null,
    lng: formData.get("lng") ? Number(formData.get("lng")) : null,
  }

  const { data, error, status } = await updateVenue(venueId, updatedVenue)

  if (error || !data) {
    console.error("[Venue Update] Failed:", error, status)
    displayBanner(error || "Failed to update venue.", "error")
    return
  }

  console.debug("[Venue Update] Success:", data)
  displayBanner("Venue updated successfully!", "success")

  setTimeout(() => {
    window.location.href = "/profile/"
  }, 1500)
}