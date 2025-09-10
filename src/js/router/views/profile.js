import { authGuard } from "../../utilities/authGuard.js";
import { onLogout } from "../../ui/auth/logout.js";
import { displayBanner } from "../../utilities/banners.js";

authGuard();

async function showProfile() {
  const profileDiv = document.getElementById("profile");
  profileDiv.innerHTML = "<p class='text-center'>Loading profile...</p>";

  const user = JSON.parse(localStorage.getItem("currentUser"));
  const token = localStorage.getItem("authToken");

  if (!user || !token) {
    profileDiv.innerHTML =
      "<p class='text-center'>No user found. Please log in.</p>";
    return;
  }

  try {
    const url = `https://v2.api.noroff.dev/holidaze/profiles/${user.name}?_venues=true&_bookings=true`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    const { data: profile } = await response.json();
    renderProfile(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    profileDiv.innerHTML =
      "<p class='text-center'>Unable to load your profile. Please try again later.</p>";
  }
}

function renderProfile(profile) {
  const profileDiv = document.getElementById("profile");
  profileDiv.innerHTML = `
    <div id="profile-view" class="max-w-7xl mx-auto p-6 shadow-md rounded-lg">
      <div class="profile-banner">
        <div class="relative">
          <img src="${profile.banner?.url || "/images/banner-placeholder.jpg"}" 
               alt="${profile.banner?.alt || "User banner"}" 
               class="profile-banner-image w-full h-60 object-cover rounded-t-lg"/>
          <div class="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-4 py-2 rounded-md">
            <h1 class="text-2xl font-semibold">${profile.name || "User Name"}</h1>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center space-y-4 mt-8">
        <img src="${profile.avatar?.url || "/images/avatar-placeholder.png"}" 
             alt="${profile.avatar?.alt || "User avatar"}" 
             class="profile-avatar w-32 h-32 object-cover rounded-full border-4 shadow-lg"/>
        <div class="text-center space-y-2">
          <p id="profile-email" class="text-lg font-medium">${profile.email || "Not provided"}</p>
          <p id="profile-bio" class="text-sm">${profile.bio || "No bio available"}</p>
          <div class="flex justify-center gap-8 text-sm">
            <p><strong>Total Venues:</strong> ${profile._count?.venues || 0}</p>
            <p><strong>Total Bookings:</strong> ${profile._count?.bookings || 0}</p>
          </div>
          <p class="text-sm">${profile.venueManager ? "Venue Manager" : "Regular User"}</p>
        </div>
        <div id="profile-update-form" class="hidden mt-8 space-y-4">
          <h2 class="text-2xl font-semibold text-gray-800">Update Profile</h2>
          <form id="update-profile-form" class="space-y-4">
            <div>
              <label for="bio" class="block text-sm font-medium text-gray-700">Bio:</label>
              <textarea id="bio" name="bio" class="w-full p-3 border border-gray-300 rounded-lg" rows="4">${profile.bio || ""}</textarea>
            </div>
            <div>
              <label for="avatar-url" class="block text-sm font-medium text-gray-700">Avatar URL:</label>
              <input type="url" id="avatar-url" name="avatar-url" class="w-full p-3 border border-gray-300 rounded-lg" value="${profile.avatar?.url || ""}" />
            </div>
            <div>
              <label for="banner-url" class="block text-sm font-medium text-gray-700">Banner URL:</label>
              <input type="url" id="banner-url" name="banner-url" class="w-full p-3 border border-gray-300 rounded-lg" value="${profile.banner?.url || ""}" />
            </div>
            <button type="submit" class="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
              Update Profile
            </button>
          </form>
        </div>
        <div class="flex gap-4 mt-8 justify-center">
          <button id="create-venue-button" class="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
            Create Venue
          </button>
          <button id="logout-button" class="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300">
            Logout
          </button>
          <button id="edit-profile-button" class="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300">
            Edit Profile
          </button>
        </div>
        <div id="user-venues" class="mt-12">
          <h2 class="text-2xl font-semibold text-center">Your Venues</h2>
          <div id="venues-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6"></div>
        </div>
        <div id="user-bookings" class="mt-12">
          <h2 class="text-2xl font-semibold text-center">Your Bookings</h2>
          <div id="bookings-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6"></div>
        </div>
      </div>
    </div>
  `;

  document
    .getElementById("edit-profile-button")
    .addEventListener("click", () => {
      const updateForm = document.getElementById("profile-update-form");
      updateForm.style.display =
        updateForm.style.display === "none" ? "block" : "none";
    });

  setupEventListeners(profile.name);
  displayVenues(profile.venues);
  displayBookings(profile.bookings);
}

function setupEventListeners(username) {
  document.getElementById("logout-button").addEventListener("click", onLogout);

  document
    .getElementById("update-profile-form")
    .addEventListener("submit", (e) => handleProfileUpdate(e, username));

  document
    .getElementById("create-venue-button")
    .addEventListener("click", () => {
      window.location.href = "/venues/create/";
    });
}

async function handleProfileUpdate(event, username) {
  event.preventDefault();

  const token = localStorage.getItem("authToken");
  if (!token) return;

  const profileData = {
    bio: document.getElementById("bio").value,
    avatar: {
      url: document.getElementById("avatar-url").value || "",
      alt: "User Avatar",
    },
    banner: {
      url: document.getElementById("banner-url").value || "",
      alt: "User Banner",
    },
  };

  try {
    const url = `https://v2.api.noroff.dev/holidaze/profiles/${username}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    const { data: updatedProfile } = await response.json();
    renderProfile(updatedProfile);

    displayBanner("Profile updated successfully!", "success");
  } catch (error) {
    console.error("Error updating profile:", error);
    displayBanner("Error updating profile. Please try again.", "error");
  }
}

function displayVenues(venues) {
  const container = document.getElementById("venues-container");
  container.innerHTML = "";

  if (!Array.isArray(venues) || venues.length === 0) {
    container.innerHTML = "<p class='text-center'>No venues found.</p>";
    return;
  }

  venues.forEach(({ id, name, description, media, price }) => {
    const venueElement = document.createElement("div");
    venueElement.classList.add(
      "bg-white",
      "border",
      "border-gray-200",
      "rounded-lg",
      "shadow-lg",
      "overflow-hidden",
      "hover:scale-105",
      "cursor-pointer",
      "flex",
      "flex-col",
    );

    const imageUrl = media?.[0]?.url || "/images/venue-placeholder.jpg";

    venueElement.innerHTML = `
      <img src="${imageUrl}" alt="${name || "Venue"}" class="w-full h-48 object-cover rounded-t-lg">
      <div class="p-4 text-center">
        <h3 class="text-xl font-semibold text-gray-800">${name || "No name"}</h3>
        <p class="mt-2 text-gray-600 text-sm">${description || "No description available"}</p>
        <p class="mt-2 text-gray-800 font-bold">$${price} per night</p>
      </div>
    `;

    venueElement.addEventListener("click", () => {
      window.location.href = `/venues/?id=${id}`;
    });

    container.appendChild(venueElement);
  });
}

function displayBookings(bookings) {
  const container = document.getElementById("bookings-container");
  container.innerHTML = "";

  if (!Array.isArray(bookings) || bookings.length === 0) {
    container.innerHTML = "<p class='text-center'>No bookings found.</p>";
    return;
  }

  bookings.forEach(({ id, dateFrom, dateTo, guests, venue }) => {
    const bookingElement = document.createElement("div");
    bookingElement.classList.add(
      "bg-white",
      "border",
      "border-gray-200",
      "rounded-lg",
      "shadow-lg",
      "overflow-hidden",
      "p-4"
    );

    const imageUrl = venue?.media?.[0]?.url || "/images/venue-placeholder.jpg";

    bookingElement.innerHTML = `
      <img src="${imageUrl}" alt="${venue?.name || "Venue"}" class="w-full h-40 object-cover rounded-lg mb-4">
      <h3 class="text-lg font-semibold">${venue?.name || "No venue name"}</h3>
      <p class="text-gray-600 text-sm">${venue?.description || "No description available"}</p>
      <p class="text-gray-800 text-sm mt-2">Guests: ${guests}</p>
      <p class="text-gray-800 text-sm">From: ${new Date(dateFrom).toLocaleDateString()}</p>
      <p class="text-gray-800 text-sm">To: ${new Date(dateTo).toLocaleDateString()}</p>
    `;

    container.appendChild(bookingElement);
  });
}

showProfile();
