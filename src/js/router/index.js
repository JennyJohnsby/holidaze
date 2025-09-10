export default async function router(
  pathname = window.location.pathname.split("?")[0],
) {
  console.log(pathname);
  switch (pathname) {
    case "/":
      await import("./views/home.js");
      break;
    case "/auth/":
      await import("./views/auth.js");
      break;
    case "/auth/login/":
      await import("./views/login.js");
      break;
    case "/auth/register/":
      await import("./views/register.js");
      break;
    case "/venues/":
      await import("./views/venues.js");
      break;
    case "/venues/create/":
      await import("./views/venueCreate.js");
      break;
    case "/profile/":
      await import("./views/profile.js");
      break;
    default:
      await import("./views/notFound.js");
  }
}