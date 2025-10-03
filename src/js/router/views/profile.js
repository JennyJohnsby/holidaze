import { authGuard } from "../../utilities/authGuard.js";
import { onLogout } from "../../ui/auth/logout.js";
import { displayBanner } from "../../utilities/banners.js";
import { readProfile } from "../../api/profile/read.js";
import { onUpdateProfile } from "../../ui/profile/update.js";
import { fetchUserVenues } from "../../api/profile/userVenues.js";

authGuard();

export async function showProfile() {
  const profileDiv = document.getElementById("profile");
  if (!profileDiv) return;

  profileDiv.innerHTML = "<p class='text-center'>Loading profile...</p>";

  try {
    const { data: profile, error } = await readProfile();
    if (error || !profile) {
      console.error("[Profile View] Failed to load profile:", error);
      profileDiv.innerHTML =
        "<p class='text-center'>Unable to load your profile. Please log in again.</p>";
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    currentUser.profile = profile;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    renderProfile(profile);
  } catch (error) {
    console.error("[Profile View] Unexpected error:", error);
    profileDiv.innerHTML =
      "<p class='text-center'>Unable to load your profile. Please try again later.</p>";
  }
}

function renderProfile(profile) {
  const profileDiv = document.getElementById("profile");
  if (!profileDiv) return;

  const venueSection = profile.venueManager
    ? `
      <div id="user-venues" class="mt-16">
        <h2 class="text-2xl font-bold text-center text-[var(--brand-purple)] mb-4">Your Venues</h2>
        <div id="venues-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 p-5 border rounded-lg text-[var(--brand-purple)]"></div>
      </div>
    `
    : "";

  const createVenueButton = profile.venueManager
    ? `<button id="create-venue-button"
         class="px-6 py-2 rounded-full font-medium shadow-sm 
                bg-green-200 text-green-900 
                hover:bg-green-300 focus:outline-none 
                focus:ring-2 focus:ring-green-300 transition-all">
         + Create Venue
       </button>`
    : "";

  profileDiv.innerHTML = `
    <div id="profile-view" class="max-w-7xl mx-auto bg-[var(--brand-beige)] p-10 shadow-2xl rounded-2xl mt-10">
      <div class="relative">
        <img src="${profile.banner?.url || "/images/banner-placeholder.jpg"}"
             alt="${profile.banner?.alt || "User banner"}"
             class="w-full h-64 object-cover rounded-lg" />
        <div class="absolute top-4 left-4 text-[var(--brand-beige)] bg-[var(--brand-purple)] bg-opacity-60 px-4 py-2 rounded">
          <h1 class="text-3xl font-bold">${profile.name || "User Name"}</h1>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-10 items-center md:items-start mt-10">
        <img src="${profile.avatar?.url || "/images/avatar-placeholder.png"}"
             alt="${profile.avatar?.alt || "User avatar"}"
             class="w-40 h-40 object-cover rounded-full border-4 border-[var(--brand-purple)] shadow-md" />

        <div class="text-center md:text-left space-y-4">
          <p class="text-xl font-semibold text-[var(--brand-purple)]">
            ${profile.email || "Not provided"}
          </p>
          <p class="text-[var(--brand-purple)]">
            ${profile.bio || "No bio available"}
          </p>
          <div class="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-[var(--brand-purple)]">
            <p><strong>Bookings:</strong> ${profile._count?.bookings ?? 0}</p>
            <p><strong>Role:</strong> ${profile.venueManager ? "Venue Manager" : "Regular User"}</p>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap justify-center gap-6 mt-10">
        ${createVenueButton}
        <button id="edit-profile-button"
          class="px-6 py-2 rounded-full font-medium shadow-sm 
                 bg-yellow-200 text-yellow-900 
                 hover:bg-yellow-300 focus:outline-none 
                 focus:ring-2 focus:ring-yellow-300 transition-all">
          ✎ Edit Profile
        </button>
        <button id="logout-button"
          class="px-6 py-2 rounded-full font-medium shadow-sm 
                 bg-red-200 text-red-900 
                 hover:bg-red-300 focus:outline-none 
                 focus:ring-2 focus:ring-red-300 transition-all">
          ⎋ Logout
        </button>
      </div>

      <div id="profile-update-form" class="hidden mt-10">
        <h2 class="text-2xl font-bold text-[var(--brand-purple)] mb-4">Update Profile</h2>
        <form id="update-profile-form" class="space-y-6">
          <div>
            <label for="bio" class="block text-sm font-medium text-[var(--brand-purple)]">Bio:</label>
            <textarea id="bio" name="bio" class="w-full p-5 border rounded-lg text-xl text-[var(--brand-purple)]" rows="4">${profile.bio || ""}</textarea>
          </div>
          <div>
            <label for="avatarUrl" class="block text-sm font-medium text-[var(--brand-purple)]">Avatar URL:</label>
            <input type="url" id="avatarUrl" name="avatarUrl" class="w-full p-5 border rounded-lg text-xl text-[var(--brand-purple)]"
              value="${profile.avatar?.url || ""}" />
          </div>
          <div>
            <label for="avatarAlt" class="block text-sm font-medium text-[var(--brand-purple)]">Avatar Alt Text:</label>
            <input type="text" id="avatarAlt" name="avatarAlt" class="w-full p-5 border rounded-lg text-xl text-[var(--brand-purple)]"
              value="${profile.avatar?.alt || ""}" />
          </div>
          <div>
            <label for="bannerUrl" class="block text-sm font-medium text-[var(--brand-purple)]">Banner URL:</label>
            <input type="url" id="bannerUrl" name="bannerUrl" class="w-full p-5 border rounded-lg text-xl text-[var(--brand-purple)]"
              value="${profile.banner?.url || ""}" />
          </div>
          <div>
            <label for="bannerAlt" class="block text-sm font-medium text-[var(--brand-purple)]">Banner Alt Text:</label>
            <input type="text" id="bannerAlt" name="bannerAlt" class="w-full p-5 border rounded-lg text-xl text-[var(--brand-purple)]"
              value="${profile.banner?.alt || ""}" />
          </div>
          <button type="submit"
            class="w-full px-6 py-2 rounded-full font-medium shadow-sm 
                   bg-[var(--brand-purple)] text-[var(--brand-beige)] 
                   hover:opacity-90 focus:outline-none 
                   focus:ring-2 focus:ring-[var(--brand-purple-hover)] transition-all">
            ✅ Update Profile
          </button>
        </form>
      </div>

      ${venueSection}

      <div id="user-bookings" class="mt-16">
        <h2 class="text-2xl font-bold text-center text-[var(--brand-purple)] mb-4">Your Bookings</h2>
        <div id="bookings-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 p-5 border rounded-lg text-[var(--brand-purple)]"></div>
      </div>
    </div>
  `;

  setupEventListeners(profile.venueManager);

  if (profile.venueManager) {
    loadUserVenues();
  }

  displayBookings(profile.bookings || []);
}

async function loadUserVenues() {
  try {
    const { data: venues, error } = await fetchUserVenues();
    if (error) {
      console.error("[Profile View] Failed to load venues:", error);
      displayBanner("Could not load your venues.", "error");
    } else {
      displayVenues(venues || []);
    }
  } catch (err) {
    console.error("[Profile View] Unexpected error loading venues:", err);
    displayBanner("Could not load your venues.", "error");
  }
}

function setupEventListeners(isVenueManager) {
  document.getElementById("logout-button")?.addEventListener("click", onLogout);
  document
    .getElementById("edit-profile-button")
    ?.addEventListener("click", () => {
      document
        .getElementById("profile-update-form")
        ?.classList.toggle("hidden");
    });
  document
    .getElementById("update-profile-form")
    ?.addEventListener("submit", onUpdateProfile);

  if (isVenueManager) {
    document
      .getElementById("create-venue-button")
      ?.addEventListener("click", () => {
        window.location.href = "/venues/create/";
      });
  }
}

function displayVenues(venues = []) {
  const container = document.getElementById("venues-container");
  if (!container) return;

  container.innerHTML =
    venues.length === 0
      ? "<p class='text-center'>No venues found.</p>"
      : venues
          .map(
            ({ id, name, description, media, price }) => `
              <div class="bg-[var(--brand-purple)] border rounded-lg shadow-lg overflow-hidden hover:scale-105 cursor-pointer flex flex-col"
                   onclick="window.location.href='/venues/?id=${id}'">
                <img src="${media?.[0]?.url || "/images/venue-placeholder.jpg"}"
                     alt="${name || "Venue"}"
                     class="w-full h-48 object-cover">
                <div class="p-4 text-center">
                  <h3 class="text-xl font-semibold text-[var(--brand-beige)]">${name || "No name"}</h3>
                  <p class="mt-2 text-[var(--brand-beige)] text-sm">${description || "No description available"}</p>
                  <p class="mt-2 text-[var(--brand-beige)] font-bold">$${price} per night</p>
                </div>
              </div>`
          )
          .join("");
}

function displayBookings(bookings = []) {
  const container = document.getElementById("bookings-container");
  if (!container) return;

  if (bookings.length === 0) {
    container.innerHTML = "<p class='text-center'>No bookings found.</p>";
    return;
  }

  container.innerHTML = bookings
    .map(({ id, dateFrom, dateTo, guests, venue }) => {
      const img = venue?.media?.[0]?.url || "/images/venue-placeholder.jpg";
      const name = venue?.name || "No venue name";
      const desc = venue?.description || "No description available";
      const href = `/bookings/?id=${encodeURIComponent(id)}`;

      return `
        <a href="${href}" class="block bg-white border rounded-lg shadow-lg overflow-hidden p-4 hover:shadow-xl transition">
          <img src="${img}" alt="${name}" class="w-full h-40 object-cover rounded-lg mb-4">
          <h3 class="text-lg font-semibold">${name}</h3>
          <p class="text-gray-600 text-sm">${desc}</p>
          <p class="text-gray-800 text-sm mt-2">Guests: ${guests}</p>
          <p class="text-gray-800 text-sm">From: ${new Date(dateFrom).toLocaleDateString()}</p>
          <p class="text-gray-800 text-sm">To: ${new Date(dateTo).toLocaleDateString()}</p>
        </a>`;
    })
    .join("");
}

showProfile();