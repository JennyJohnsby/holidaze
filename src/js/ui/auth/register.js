import { registerUser } from "../../api/auth/register.js";
import { loginUser } from "../../api/auth/login.js";
import { displayBanner } from "../../utilities/banners.js";
import { authGuard } from "../../utilities/authGuard.js";

authGuard({ redirectIfAuthenticated: true });

export async function onRegister(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const userData = {
    name: formData.get("name")?.trim(),
    email: formData.get("email")?.trim(),
    password: formData.get("password"),
    bio: formData.get("bio")?.trim() || "",
    venueManager: formData.has("venueManager"),
  };

  const avatarUrl = formData.get("avatarUrl")?.trim();
  const bannerUrl = formData.get("bannerUrl")?.trim();

  if (!userData.name || !userData.email || !userData.password) {
    displayBanner("Name, email and password are required.", "error");
    return;
  }

  const usernamePattern = /^[A-Za-z0-9_]+$/;
  if (!usernamePattern.test(userData.name)) {
    displayBanner("Username can only contain letters, numbers, and underscores (_).", "error");
    return;
  }

  if (
    !userData.email.endsWith("@stud.noroff.no") &&
    !userData.email.endsWith("@noroff.no")
  ) {
    displayBanner("Email must be a valid @stud.noroff.no or @noroff.no address.", "error");
    return;
  }

  if (userData.password.length < 8) {
    displayBanner("Password must be at least 8 characters long.", "error");
    return;
  }

  if (userData.bio.length > 160) {
    displayBanner("Bio must be less than 160 characters.", "error");
    return;
  }

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
      alt: formData.get("avatarAlt")?.trim() || "",
    };
  }

  if (bannerUrl) {
    userData.banner = {
      url: bannerUrl,
      alt: formData.get("bannerAlt")?.trim() || "",
    };
  }

  const submitButton = form.querySelector("button[type='submit']");
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Registering...";

  try {
    const response = await registerUser(userData);
    const newUser = response.data;

    displayBanner(`Welcome, ${newUser.name}! Registration successful.`, "success");

    const auth = await loginUser({
      email: userData.email,
      password: userData.password,
    });

    localStorage.setItem("auth", JSON.stringify(auth));

    setTimeout(() => {
      window.location.pathname = `/../profile/${newUser.name}`;
    }, 1500);
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