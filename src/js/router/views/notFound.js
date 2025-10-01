export default function notFoundView() {
  const app = document.querySelector("#app");
  if (app) {
    app.innerHTML = `
      <div class="text-center py-20">
        <h1 class="text-4xl font-bold mb-4">404</h1>
        <p class="text-lg mb-6">Sorry, the page you are looking for cannot be found.</p>
        <a href="/" class="text-[var(--brand-purple)] hover:underline">
          Go back to Home
        </a>
      </div>
    `;
  }
}
