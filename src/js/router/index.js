export default async function router(
  pathname = window.location.pathname.split("?")[0]
) {
  console.debug("[Router] navigating to:", pathname);

  try {
    let module;

    switch (pathname) {
      case "/":
        module = await import("./views/home.js");
        break;

      case "/auth/":
        module = await import("./views/auth.js");
        break;

      case "/auth/login/":
        module = await import("./views/login.js");
        break;

      case "/auth/register/":
        module = await import("./views/register.js");
        break;

      case "/venues/":
        module = await import("./views/venues.js");
        break;

      case "/venues/create/":
        module = await import("./views/venueCreate.js");
        break;

      case "/venues/edit/":
        module = await import("./views/venueEdit.js");
        break;

      case "/profile/":
        module = await import("./views/profile.js");
        break;

      case "/bookings/":
        module = await import("./views/bookings.js");
        break;

      case "/bookings/edit/":
        module = await import("./views/bookingEdit.js");
        break;

      case "/bookings/create/":
        module = await import("./views/bookingCreate.js");
        break;

      default:
        module = await import("./views/notFound.js");
        break;
    }

    if (module && typeof module.default === "function") {
      module.default();
    }
  } catch (err) {
    console.error("[Router] Failed to load view:", err);

    try {
      const module = await import("./views/notFound.js");
      if (module && typeof module.default === "function") {
        module.default();
      }
    } catch (nestedErr) {
      console.error("[Router] Critical: Failed to load notFound view:", nestedErr);
      const app = document.querySelector("#app");
      if (app) {
        app.innerHTML =
          "<p class='text-center text-red-500 py-20'>Something went wrong loading this page.</p>";
      }
    }
  }
}