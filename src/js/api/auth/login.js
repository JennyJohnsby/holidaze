import { API_AUTH_LOGIN } from "../constants";

/**
 * Log in a user
 * @param {object} credentials - { email, password }
 * @returns {Promise<{ data: object|null, error: string|null, status: number }>}
 */
export async function login({ email, password }) {
  try {
    const response = await fetch(API_AUTH_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = result.errors?.[0]?.message || "Failed to log in user";
      console.error("[Login API] Error:", errorMessage);
      return { data: null, error: errorMessage, status: response.status };
    }

    const token = result.data?.accessToken;
    if (!token) {
      return { data: null, error: "Login successful, but no token was returned.", status: 500 };
    }

    // Store token and user
    localStorage.setItem("authToken", token);
    const user = {
      name: result.data.name,
      email: result.data.email,
      bio: result.data.bio,
      avatar: result.data.avatar,
      banner: result.data.banner,
    };
    localStorage.setItem("currentUser", JSON.stringify(user));

    console.info("[Login API] User logged in:", user);

    return { data: result.data, error: null, status: response.status };
  } catch (error) {
    console.error("[Login API] Network error:", error);
    return { data: null, error: "Network error while logging in.", status: 500 };
  }
}
