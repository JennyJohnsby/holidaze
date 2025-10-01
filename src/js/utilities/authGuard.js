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
  let auth;
  try {
    auth = JSON.parse(localStorage.getItem("auth")) || null;
  } catch {
    auth = null;
  }

  const accessToken = auth?.accessToken || null;
  const user = auth?.profile || {};
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
    return;
  }

  
  if (accessToken && redirectIfAuthenticated) {
    if (currentPath === "/auth/login/" || currentPath === "/auth/register/") {
      displayBanner(
        `You are already logged in as ${user.name || "user"}. <button id="logoutButton" class="banner__button">Logout</button>`,
        "warning",
        0 
      );

      
      document.body.addEventListener(
        "click",
        (event) => {
          if (event.target.id === "logoutButton") {
            localStorage.removeItem("auth");
            window.location.href = "/auth/login/";
          }
        },
        { once: true }
      );
    }
  }
}
