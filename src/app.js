import React from "react";
import router from "./js/router";

export default function App() {

  return router(window.location.pathname);
}