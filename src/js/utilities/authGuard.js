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
  const token = localStorage.getItem("authToken")
  let user = null

  try {
    user = JSON.parse(localStorage.getItem("currentUser")) || null
  } catch {
    user = null
  }

  const currentPath = window.location.pathname

  // 🚨 If NOT logged in and guard says redirect
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

  // ✅ If already logged in but visiting login/register
  if (token && redirectIfAuthenticated) {
    if (currentPath === "/auth/login/" || currentPath === "/auth/register/") {
      displayBanner(
        `You are already logged in as ${user?.name || "user"}. <button id="logoutButton" class="banner__button">Logout</button>`,
        "warning",
        0 // persistent
      )

      document.body.addEventListener(
        "click",
        (event) => {
          if (event.target.id === "logoutButton") {
            localStorage.removeItem("authToken")
            localStorage.removeItem("currentUser")
            window.location.href = "/auth/login/"
          }
        },
        { once: true }
      )
    }
  }
}