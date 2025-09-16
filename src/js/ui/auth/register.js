import { registerUser } from "../../api/auth/register.js";
import { displayBanner } from "../../utilities/banners.js";
import { authGuard } from "../../utilities/authGuard.js";

authGuard({ redirectIfAuthenticated: true });

export async function onRegister(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const userData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    bio: formData.get("bio") || "",
    venueManager: formData.has("venueManager"),
  };

  const avatarUrl = formData.get("avatarUrl");
  const bannerUrl = formData.get("bannerUrl");

  if (avatarUrl && avatarUrl.length > 300) {
    displayBanner("Avatar image URL must be 300 characters or less.", "error");
    return;
  }

  if (bannerUrl && bannerUrl.length > 300) {
    displayBanner("Banner image URL must be 300 characters or less.", "error");
    return;
  }

  if (avatarUrl) {
    userData.avatar = {
      url: avatarUrl,
      alt: formData.get("avatarAlt") || "",
    };
  }

  if (bannerUrl) {
    userData.banner = {
      url: bannerUrl,
      alt: formData.get("bannerAlt") || "",
    };
  }

  if (!userData.email || !userData.password) {
    displayBanner("Email and password are required.", "error");
    return;
  }

  if (userData.password.length < 8) {
    displayBanner("Password must be at least 8 characters.", "error");
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Registering...";

  try {
    const user = await registerUser(userData);

    displayBanner(`Welcome, ${user.name}! Registration successful.`, "success");

    setTimeout(() => {
      window.location.pathname = "/";
    }, 2000);
  } catch (error) {
    console.error("[Register UI] Registration failed:", error);

    let message = "An error occurred during registration. Please try again.";
    if (error.message) {
      message = error.message;
    }
    if (error.details && error.details.length > 0) {
      message += ` (${error.details[0].message})`;
    }

    displayBanner(message, "error");

    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
}