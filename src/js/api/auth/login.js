import { API_AUTH_LOGIN } from "../constants.js";

export async function loginUser({ email, password }) {
  try {
    const response = await fetch(API_AUTH_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = await response.json();
      } catch {
        throw new Error("Failed to log in user");
      }
      const message =
        errorDetails.errors?.[0]?.message || "Failed to log in user";
      throw new Error(message);
    }

    const result = await response.json();

    const auth = {
      accessToken: result.accessToken,
      profile: result.data,
    };

    localStorage.setItem("auth", JSON.stringify(auth));

    return auth;
  } catch (error) {
    console.error("[Login API] Login failed:", error);
    throw error;
  }
}