// @ts-expect-error: No type declarations for JS router module
import router from "./js/router";


export default function App() {
  return router(window.location.pathname);
}
