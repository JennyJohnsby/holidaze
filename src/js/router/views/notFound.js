export default function notFoundView() {
  const app = document.querySelector("#app");
  if (app) {
    app.innerHTML = `
      <div class="flex flex-col items-center justify-center py-24">
        <div class="bg-[var(--brand-purple)] text-[var(--brand-beige)] rounded-2xl shadow-xl px-10 py-16 max-w-lg w-full text-center">
          <h1 class="text-7xl font-extrabold mb-6">404</h1>
          <p class="text-lg mb-8 opacity-90">
            Sorry, the page you are looking for cannot be found.
          </p>
          <a href="/"
             class="px-6 py-3 rounded-full font-medium shadow-sm 
                    bg-yellow-200 text-yellow-900 
                    hover:bg-yellow-300 focus:outline-none 
                    focus:ring-2 focus:ring-yellow-300 transition-all">
            ⬅ Back to Home
          </a>
        </div>
      </div>
    `;
  }
}