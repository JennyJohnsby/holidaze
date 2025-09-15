import { registerUser } from "../../api/auth/register.js";
import { displayBanner } from "../../utilities/banners.js";
import { authGuard } from "../../utilities/authGuard.js";

authGuard({ redirectIfAuthenticated: true });

export async function onRegister(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  // Build user object from form
  const userData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    bio: formData.get("bio") || "",
    venueManager: formData.has("venueManager"),
  };

  const avatarUrl = formData.get("avatarUrl");
  if (avatarUrl) {
    userData.avatar = {
      url: avatarUrl,
      alt: formData.get("avatarAlt") || "",
    };
  }

  const bannerUrl = formData.get("bannerUrl");
  if (bannerUrl) {
    userData.banner = {
      url: bannerUrl,
      alt: formData.get("bannerAlt") || "",
    };
  }

  // Client-side validation
  if (!userData.email || !userData.password) {
    displayBanner("Email and password are required.", "error");
    return;
  }
  if (userData.password.length < 8) {
    displayBanner("Password must be at least 8 characters.", "error");
    return;
  }

  // Handle loading state
  const submitButton = form.querySelector("button[type='submit']");
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Registering...";

  try {
    // Call API
    const { user } = await registerUser(userData);

    // Success feedback
    displayBanner(`Welcome, ${user.name}! Registration successful.`, "success");

    // Redirect after short delay
    setTimeout(() => {
      window.location.pathname = "/";
    }, 2000);
  } catch (error) {
    console.error("[Register UI] Registration failed:", error);

    // Pick best error message
    let message = "An error occurred during registration. Please try again.";
    if (error.message) {
      message = error.message;
    }
    if (error.details && error.details.length > 0) {
      // Append first API validation detail if available
      message += ` (${error.details[0].message})`;
    }

    displayBanner(message, "error");

    // Reset button so user can retry
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
}
