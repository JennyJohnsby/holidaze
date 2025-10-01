import { updateProfile } from "../../api/profile/update.js"
import { displayBanner } from "../../utilities/banners.js"

export async function onUpdateProfile(event) {
  event.preventDefault()

  const form = event.target
  const formData = new FormData(form)

  const bio = formData.get("bio")?.trim()
  const avatarUrl = formData.get("avatarUrl")?.trim()
  const avatarAlt = formData.get("avatarAlt")?.trim()
  const bannerUrl = formData.get("bannerUrl")?.trim()
  const bannerAlt = formData.get("bannerAlt")?.trim()

  const profileData = {}
  if (bio) profileData.bio = bio
  if (avatarUrl) profileData.avatar = { url: avatarUrl, alt: avatarAlt || "" }
  if (bannerUrl) profileData.banner = { url: bannerUrl, alt: bannerAlt || "" }

  const { data, error } = await updateProfile(profileData)

  if (error || !data) {
    console.error("[Profile UI] Failed to update:", error)
    displayBanner(error || "Failed to update profile.", "error")
    return
  }

  // Update currentUser in localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (currentUser) {
    const updatedUser = { ...currentUser, ...data }
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))
  }

  displayBanner("Profile updated successfully!", "success")

  setTimeout(() => {
    window.location.pathname = `/profile/`
  }, 1500)
}