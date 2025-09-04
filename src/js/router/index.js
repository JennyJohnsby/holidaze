export default async function router(
  pathname = window.location.pathname.split("?")[0],
) {
  console.log("Routing to:", pathname);

  switch (pathname) {
    case "/":
      await import("./views/home.js");
      break;

    // Auth routes
    case "/auth/":
      await import("./views/auth.js");
      break;
    case "/auth/login/":
      await import("./views/login.js");
      break;
    case "/auth/register/":
      await import("./views/register.js");
      break;

    // Venue routes
    case "/venues/":
      await import("./views/venues.js"); 
      break;
    case "/venues/create/":
      await import("./views/venueCreate.js");
      break;
    case "/venues/edit/":
      await import("./views/venueEdit.js");
      break;

    // Profile
    case "/profile/":
      await import("./views/profile.js");
      break;

    // 404 fallback
    default:
      await import("./views/notFound.js");
  }
}
