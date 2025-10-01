import { registerUser } from "../../api/auth/register.js"
import { displayBanner } from "../../utilities/banners.js"
import { authGuard } from "../../utilities/authGuard.js"

authGuard({ redirectIfAuthenticated: true })

export async function onRegister(event) {
  event.preventDefault()

  const form = event.target
  const formData = new FormData(form)

  const userData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    bio: formData.get("bio") || "",
    venueManager: formData.has("venueManager"),
  }

  const avatarUrl = formData.get("avatarUrl")
  if (avatarUrl) {
    userData.avatar = {
      url: avatarUrl,
      alt: formData.get("avatarAlt") || "",
    }
  }

  const bannerUrl = formData.get("bannerUrl")
  if (bannerUrl) {
    userData.banner = {
      url: bannerUrl,
      alt: formData.get("bannerAlt") || "",
    }
  }

  const { data, error } = await registerUser(userData)

  if (error || !data) {
    displayBanner(error || "An error occurred during registration.", "error")
    return
  }

  displayBanner("Registration successful! Redirecting…", "success")

  setTimeout(() => {
    window.location.pathname = "/auth/login/"
  }, 1500)
}