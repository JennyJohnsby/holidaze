import { registerUser } from "../../api/auth/register";
import { displayBanner } from "../../utilities/banners";
import { authGuard } from "../../utilities/authGuard";

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

  try {
    const response = await registerUser(userData);
    console.log("Registration successful:", response);

    displayBanner(
      "Registration successful! Redirecting to auctions",
      "success",
    );

    setTimeout(() => {
      window.location.pathname = "/";
    }, 3000);
  } catch (error) {
    console.error("Error during registration:", error);

    displayBanner(
      error.message || "An error occurred during registration.",
      "error",
    );
  }
}