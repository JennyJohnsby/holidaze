import { loginUser } from "../../api/auth/login.js";
import { displayBanner } from "../../utilities/banners.js";
import { authGuard } from "../../utilities/authGuard.js";

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
  if (!isValidInput(passwordInput, "Password must be at least 8 characters.")) return;

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    const auth = await loginUser({ email, password });

    if (auth?.accessToken) {
      localStorage.setItem("auth", JSON.stringify(auth));

      displayBanner(`Welcome back, ${auth.profile.name}!`, "success");

      setTimeout(() => {
        window.location.pathname = `/profile/${auth.profile.name}`;
      }, 1500);
    } else {
      throw new Error("Login successful, but no token was returned.");
    }
  } catch (error) {
    console.error("[Login UI] Login failed:", error);
    displayBanner(
      error.message || "Invalid login credentials. Please try again.",
      "error"
    );
  }
}