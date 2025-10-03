import { registerUser } from "../../api/auth/register.js"
import { loginUser } from "../../api/auth/login.js"
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
    userData.avatar = { url: avatarUrl, alt: formData.get("avatarAlt") || "" }
  }

  const bannerUrl = formData.get("bannerUrl")
  if (bannerUrl) {
    userData.banner = { url: bannerUrl, alt: formData.get("bannerAlt") || "" }
  }

  const { data, error } = await registerUser(userData)
  if (error || !data) {
    displayBanner(error || "An error occurred during registration.", "error")
    return
  }

  const login = await loginUser({ email: userData.email, password: userData.password })
  if (login.error || !login.data) {
    displayBanner("✅ Account created, but login failed. Please log in manually.", "error")
    setTimeout(() => (window.location.pathname = "/auth/login/"), 2000)
    return
  }

  localStorage.setItem("token", login.data.accessToken)
  localStorage.setItem("profile", JSON.stringify(login.data))

  displayBanner("🎉 Registration successful! Redirecting to your profile…", "success")

  setTimeout(() => {
    window.location.pathname = "/profile/"
  }, 1500)
}