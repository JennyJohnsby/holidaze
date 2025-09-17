import { displayBanner } from "../utilities/banners.js";

export function authGuard({
  redirectIfAuthenticated = false,
  redirectIfNotAuthenticated = true,
  redirectUrlsIfNotAuthenticated = {
    default: "/auth/login/",
    register: "/auth/register/",
  },
  bannerDelay = 2000,
} = {}) {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const accessToken = user?.accessToken;
  const currentPath = window.location.pathname;

  if (!accessToken && redirectIfNotAuthenticated) {
    const redirectUrl = currentPath.includes("/auth/register/")
      ? redirectUrlsIfNotAuthenticated.register
      : redirectUrlsIfNotAuthenticated.default;

    if (currentPath !== redirectUrl) {
      displayBanner("You must be logged in to view this page.", "error");
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, bannerDelay);
    }
  } else if (accessToken && redirectIfAuthenticated) {
    if (currentPath === "/auth/login/" || currentPath === "/auth/register/") {
      displayBanner(
        `You are already logged in as ${user.name || "user"}. <button id="logoutButton" class="banner__button">Logout</button>`,
        "warning",
        0
      );

      document.addEventListener("click", (event) => {
        if (event.target.id === "logoutButton") {
          localStorage.removeItem("user");
          window.location.href = "/auth/login/";
        }
      });
    }
  }
}