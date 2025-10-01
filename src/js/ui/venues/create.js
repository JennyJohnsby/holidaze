import { createVenue } from "../../api/venues/create.js"
import { displayBanner } from "../../utilities/banners.js"

export async function onCreateVenue(event) {
  event.preventDefault()

  const form = event.target

  const name = form.name?.value.trim() || ""
  const description = form.description?.value.trim() || ""
  const price = Number(form.price?.value)
  const maxGuests = Number(form.maxGuests?.value)

  const mediaUrl = form.mediaUrl?.value.trim() || ""
  const mediaAlt = form.mediaAlt?.value.trim() || ""

  const meta = {
    wifi: form.wifi?.checked || false,
    parking: form.parking?.checked || false,
    breakfast: form.breakfast?.checked || false,
    pets: form.pets?.checked || false,
  }

  const lat = form.lat?.value.trim() || ""
  const lng = form.lng?.value.trim() || ""

  const location = {
    address: form.address?.value.trim() || null,
    city: form.city?.value.trim() || null,
    zip: form.zip?.value.trim() || null,
    country: form.country?.value.trim() || null,
    continent: form.continent?.value.trim() || null,
    lat: lat ? Number(lat) : null,
    lng: lng ? Number(lng) : null,
  }

  // ✅ Validations
  if (!name) {
    displayBanner("Venue name is required", "error")
    return
  }

  if (!description) {
    displayBanner("Venue description is required", "error")
    return
  }

  if (isNaN(price)) {
    displayBanner("Valid price is required", "error")
    return
  }

  if (isNaN(maxGuests)) {
    displayBanner("Valid max guests value is required", "error")
    return
  }

  const venueData = {
    name,
    description,
    price,
    maxGuests,
    media: mediaUrl ? [{ url: mediaUrl, alt: mediaAlt }] : [],
    meta,
    location,
  }

  // ✅ Call API correctly
  const { data, error } = await createVenue(venueData)

  if (error || !data) {
    console.error("[Venue Create] Failed:", error)
    displayBanner(error || "Failed to create venue.", "error")
    return
  }

  displayBanner(`Venue created successfully: ${data.name}`, "success")

  setTimeout(() => {
    window.location.href = "/profile/"
  }, 1500)
}