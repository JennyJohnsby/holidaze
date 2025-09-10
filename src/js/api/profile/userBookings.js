import { API_PROFILE_BOOKINGS, API_KEY } from "../constants";

export async function fetchUserBooking() {
  const userInLocalStorage = JSON.parse(localStorage.getItem("currentUser"));
  const usernameFromStorage = userInLocalStorage
    ? userInLocalStorage.name
    : null;
  const token = localStorage.getItem("authToken");

  if (!usernameFromStorage || !token) {
    console.error("No username or token found in localStorage. Please log in.");
    return [];
  }

  const url = `${API_PROFILE_BOOKINGS.replace("<name>", usernameFromStorage)}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.error("Unauthorized access. Please log in again.");
      } else if (response.status === 404) {
        console.error(`No bookings found for ${usernameFromStorage}.`);
      } else {
        console.error(
          `Failed to fetch bookings for ${usernameFromStorage}: ${response.statusText}`,
        );
      }
      return [];
    }

    const { data } = await response.json();
    console.log("Bookings fetched:", data);

    return data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}