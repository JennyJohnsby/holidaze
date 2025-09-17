import { API_AUTH_LOGIN } from "../constants";
import { authGuard } from "../../utilities/authGuard.js";

export async function login({ email, password }) {
  try {
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
      const errorMessage = errorData.errors?.[0]?.message || "Failed to log in user";
      throw new Error(errorMessage);
    }

    const result = await response.json();

    const user = {
      name: result.data.name,
      email: result.data.email,
      bio: result.data.bio,
      avatar: result.data.avatar,
      banner: result.data.banner,
      accessToken: result.data.accessToken,
    };

    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
}