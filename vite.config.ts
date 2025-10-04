import { defineConfig } from 'vite'
import { resolve } from "path";
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  appType: "mpa",
  base: "",
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "./index.html"),
        login: resolve(__dirname, "./auth/login/index.html"),
        register: resolve(__dirname, "./auth/register/index.html"),
        profile: resolve(__dirname, "./profile/index.html"),
        bookings: resolve(__dirname, "./bookings/index.html"),
        editBookings: resolve(__dirname, "./bookings/edit/index.html"),
        venues: resolve(__dirname, "./venues/index.html"),
        editVenues: resolve(__dirname, "./venues/edit/index.html"),
        createVenues: resolve(__dirname, "./venues/create/index.html")
      },
    },
  },
  plugins: [
    tailwindcss(),
  ],
})
