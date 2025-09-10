import { login } from "../../api/auth/login.js";
import { displayBanner } from "../../utilities/banners.js";
import { authGuard } from "../../utilities/authGuard";

authGuard({ redirectIfAuthenticated: true });

function isValidInput(input, message) {
  if (!input.validity.valid) {
    displayBanner(message, "error");
    input.classList.add("invalid");
    return false;
  }
  input.classList.remove("invalid");
  return true;
}

export async function onLogin(event) {
  event.preventDefault();

  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");

  if (!isValidInput(emailInput, "Please enter a valid email address.")) return;
  if (!isValidInput(passwordInput, "Password must be at least 8 characters."))
    return;

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const response = await login({ email, password });

    const token = response.accessToken;
    const user = {
      name: response.name,
      email: response.email,
      bio: response.bio,
      avatar: response.avatar,
      banner: response.banner,
    };

    if (token) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("currentUser", JSON.stringify(user));

      displayBanner(`Welcome back, ${response.name}!`, "success");

      setTimeout(() => {
        window.location.pathname = "/";
      }, 3000);
    } else {
      throw new Error("Login successful, but no token was returned.");
    }
  } catch (error) {
    console.error("Login failed:", error);
    displayBanner(
      error.message || "Invalid login credentials. Please try again.",
      "error",
    );
  }
}