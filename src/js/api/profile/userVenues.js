import { API_KEY } from "../constants";

export async function fetchUserVenues() {
  const userInLocalStorage = JSON.parse(localStorage.getItem("currentUser"));
  const usernameFromStorage = userInLocalStorage
    ? userInLocalStorage.name
    : null;
  const token = localStorage.getItem("authToken");

  if (!usernameFromStorage || !token) {
    console.error("No username or token found in localStorage. Please log in.");
    return { data: [], meta: {} };
  }

  const url = `https://v2.api.noroff.dev/holidaze/profiles/${usernameFromStorage}/venues`;

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
        console.error(`No venues found for ${usernameFromStorage}.`);
      } else {
        console.error(
          `Failed to fetch venues for ${usernameFromStorage}: ${response.statusText}`,
        );
      }
      return { data: [], meta: {} };
    }

    const result = await response.json();
    console.log("Venues fetched:", result.data);

    return result; // { data: [...], meta: {...} }
  } catch (error) {
    console.error("Error fetching venues:", error);
    return { data: [], meta: {} };
  }
}
