import { displayBanner } from "../utilities/banners.js"

export function authGuard({
  redirectIfAuthenticated = false,
  redirectIfNotAuthenticated = true,
  redirectUrlsIfNotAuthenticated = {
    default: "/auth/login/",
    register: "/auth/register/",
  },
  bannerDelay = 2000,
} = {}) {
  const token = localStorage.getItem("token")
  let user = null

  try {
    user = JSON.parse(localStorage.getItem("profile")) || null
  } catch {
    user = null
  }

  const currentPath = window.location.pathname

  if (!token && redirectIfNotAuthenticated) {
    const redirectUrl = currentPath.includes("/auth/register/")
      ? redirectUrlsIfNotAuthenticated.register
      : redirectUrlsIfNotAuthenticated.default

    if (currentPath !== redirectUrl) {
      displayBanner("You must be logged in to view this page.", "error")
      setTimeout(() => {
        window.location.href = redirectUrl
      }, bannerDelay)
    }
    return
  }

  if (token && redirectIfAuthenticated) {
    if (currentPath === "/auth/login/" || currentPath === "/auth/register/") {
      displayBanner(
        `You are already logged in as ${user?.name || "user"}. <button id="logoutButton" class="banner__button">Logout</button>`,
        "warning",
        0
      )

      document.body.addEventListener(
        "click",
        (event) => {
          if (event.target.id === "logoutButton") {
            localStorage.removeItem("token")
            localStorage.removeItem("profile")
            window.location.href = "/auth/login/"
          }
        },
        { once: true }
      )
    }
  }
}