import { readVenue } from "../../api/venues/read.js";
import { deleteVenue } from "../../api/venues/delete.js";

async function createBooking(bookingData) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.accessToken) {
    alert("You must be logged in to book a venue.");
    return;
  }

  try {
    const response = await fetch(
      "https://api.noroff.dev/api/v1/holidaze/bookings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(bookingData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errors?.[0]?.message || "Booking failed.");
    }

    alert("Booking successful!");
    console.log("Booking result:", result);
  } catch (error) {
    console.error("Booking error:", error);
    alert(`Booking failed: ${error.message}`);
  }
}

async function fetchAndDisplayVenue() {
  const venueId = new URLSearchParams(window.location.search).get("id");
  const venueContainer = document.getElementById("venueDetailContainer");

  if (!venueContainer || !venueId) return;

  try {
    const venue = await readVenue(venueId);
    renderSingleVenue(venue);
  } catch (err) {
    console.error(err);
    venueContainer.innerHTML = `<p class="text-red-500 text-center">Failed to load the venue.</p>`;
  }
}

function renderSingleVenue(venue) {
  const venueContainer = document.getElementById("venueDetailContainer");
  if (!venueContainer) return;

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user?.accessToken;
  const userName =
    user?.name?.trim().toLowerCase() || user?.data?.name?.trim().toLowerCase();
  const ownerName = venue?.owner?.name?.trim().toLowerCase();
  const isOwner = userName && ownerName && userName === ownerName;

  console.log("User object:", user);
  console.log("Venue object:", venue);
  console.log("Logged in as:", userName ?? "undefined");
  console.log("Venue owner:", ownerName ?? "undefined");
  console.log("isOwner:", isOwner);
  console.log("isLoggedIn:", isLoggedIn);

  venueContainer.innerHTML = `
    <div class="max-w-5xl mx-auto bg-[var(--brand-purple)] rounded-2xl shadow-xl overflow-hidden mt-16">
      <div class="relative h-96">
        ${
          venue.media?.[0]?.url
            ? `<img src="${venue.media[0].url}" alt="${
                venue.media[0].alt || "Venue image"
              }" class="w-full h-full object-cover" />`
            : `<div class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-lg font-medium">No Image Available</div>`
        }
      </div>
      <div class="p-8 space-y-6">
        <div>
          <h1 class="text-4xl font-extrabold text-[var(--brand-beige)] mb-3">${
            venue.name || "Unnamed Venue"
          }</h1>
          <p class="text-[var(--brand-beige)] text-lg">${
            venue.description || "No description available."
          }</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[var(--brand-beige)] p-4 rounded-xl shadow-inner">
          <div class="text-center">
            <p class="text-[var(--brand-purple-hover)] font-bold">Price</p>
            <p class="text-[var(--brand-purple)] font-semibold text-lg">$${
              venue.price ?? 0
            }</p>
          </div>
          <div class="text-center">
            <p class="text-[var(--brand-purple-hover)] font-bold">Max Guests</p>
            <p class="text-[var(--brand-purple)] font-semibold text-lg">${
              venue.maxGuests ?? 0
            }</p>
          </div>
          <div class="text-center">
            <p class="text-[var(--brand-purple-hover)] font-bold">Rating</p>
            <p class="text-[var(--brand-purple)] font-semibold text-lg">${
              venue.rating ?? 0
            }/5</p>
          </div>
          <div class="text-center">
            <p class="text-[var(--brand-purple-hover)] font-bold">Created</p>
            <p class="text-[var(--brand-purple)] font-semibold text-lg">${new Date(
              venue.created
            ).toLocaleDateString()}</p>
          </div>
        </div>
        <div>
          <h2 class="text-2xl font-semibold text-[var(--brand-beige)] mb-2">Amenities</h2>
          <ul class="flex flex-wrap gap-2">
            ${
              venue.meta?.wifi
                ? `<li class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">WiFi</li>`
                : ""
            }
            ${
              venue.meta?.parking
                ? `<li class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Parking</li>`
                : ""
            }
            ${
              venue.meta?.breakfast
                ? `<li class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Breakfast</li>`
                : ""
            }
            ${
              venue.meta?.pets
                ? `<li class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Pets Allowed</li>`
                : ""
            }
          </ul>
        </div>
        <div>
          <h2 class="text-2xl font-semibold text-[var(--brand-beige)] mb-2">Location</h2>
          <p class="text-[var(--brand-beige)]">
            ${venue.location?.address || ""}, ${venue.location?.city || ""}, ${
    venue.location?.zip || ""
  }, ${venue.location?.country || ""}
          </p>
        </div>

        ${
          isLoggedIn
            ? isOwner
              ? `
              <div class="mt-6 flex gap-4">
                <a href="/venues/edit/?id=${venue.id}" class="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300">Edit Venue</a>


                <button id="delete-venue-button" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500">Delete Venue</button>
              </div>`
              : `
              <form id="booking-form" class="mt-8 bg-[var(--brand-beige)] p-6 rounded-xl space-y-4">
                <h2 class="text-xl font-bold text-[var(--brand-purple)]">Book this venue</h2>
                <label class="block">
                  <span class="text-sm font-medium text-[var(--brand-purple)]">Check-in</span>
                  <input type="date" name="checkIn" class="mt-1 w-full p-2 rounded border border-gray-300" required />
                </label>
                <label class="block">
                  <span class="text-sm font-medium text-[var(--brand-purple)]">Check-out</span>
                  <input type="date" name="checkOut" class="mt-1 w-full p-2 rounded border border-gray-300" required />
                </label>
                <label class="block">
                  <span class="text-sm font-medium text-[var(--brand-purple)]">Guests</span>
                  <input type="number" name="guests" min="1" max="${venue.maxGuests}" class="mt-1 w-full p-2 rounded border border-gray-300" required />
                </label>
                <button type="submit" class="w-full bg-[var(--brand-purple)] text-[var(--brand-beige)] px-4 py-2 rounded hover:bg-[var(--brand-purple-hover)]">
                  Book Now
                </button>
              </form>`
            : `<p class="text-[var(--brand-beige)] text-center mt-6">You must <a href="/auth/login/" class="underline">log in</a> to book this venue.</p>`
        }
      </div>
    </div>
  `;

  const deleteButton = document.getElementById("delete-venue-button");
  if (deleteButton) {
    deleteButton.addEventListener("click", async () => {
      await deleteVenue(venue.id);
      window.location.href = "/profile/";
    });
  }

  const bookingForm = document.getElementById("booking-form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(bookingForm);
      const bookingData = {
        dateFrom: new Date(formData.get("checkIn")).toISOString(),
        dateTo: new Date(formData.get("checkOut")).toISOString(),
        guests: parseInt(formData.get("guests")),
        venueId: venue.id,
      };

      await createBooking(bookingData);
    });
  }
}

fetchAndDisplayVenue();