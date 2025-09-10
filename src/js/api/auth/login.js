import { API_AUTH_LOGIN } from "../constants";
import { authGuard } from "../../utilities/authGuard.js";

export async function login({ email, password }) {
  try {
    // Directly invoke authGuard before performing the login
    authGuard(true);

    const response = await fetch(API_AUTH_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Login error details:", errorData);

      const errorMessage =
        errorData.errors?.[0]?.message || "Failed to log in user";
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log("Full login response:", result);

    const token = result.data?.accessToken;
    if (!token) {
      console.error("Token extraction failed. Response data:", result.data);
      throw new Error("Login successful, but no token was returned.");
    }

    localStorage.setItem("accessToken", token);
    const user = {
      name: result.data.name,
      email: result.data.email,
      bio: result.data.bio,
      avatar: result.data.avatar,
      banner: result.data.banner,
    };
    localStorage.setItem("currentUser", JSON.stringify(user));

    console.log("User data and token stored successfully:", user);

    return result.data;
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
}