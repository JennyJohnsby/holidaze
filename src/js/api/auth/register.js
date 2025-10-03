import { API_AUTH_REGISTER } from "../constants.js"

export async function registerUser(userData) {
  try {
    const response = await fetch(API_AUTH_REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      const errorMessage =
        result.errors?.[0]?.message ||
        result.message ||
        "❌ Failed to register user"

      console.error("[Register API] Error:", errorMessage)
      return {
        data: null,
        error: errorMessage,
        status: response.status,
      }
    }

    const data = result.data || result
    console.info("[Register API] User registered successfully:", data)

    return {
      data,
      error: null,
      status: response.status,
    }
  } catch (error) {
    console.error("[Register API] Network error:", error)
    return {
      data: null,
      error: "Network error while registering user.",
      status: 500,
    }
  }
}