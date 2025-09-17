import { API_PROFILE, API_KEY } from "../constants.js";

export async function readProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.name;
  const token = user?.accessToken;

  if (!username || !token) {
    console.error("No username or token found in localStorage. Please log in.");
    return null;
  }

  const url = `${API_PROFILE}/${username}`;

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
        console.error(`Profile for ${username} not found.`);
      } else {
        console.error(`Failed to fetch profile for ${username}: ${response.statusText}`);
      }
      return null;
    }

    const { data } = await response.json();
    console.log("Profile data fetched:", data);

    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}