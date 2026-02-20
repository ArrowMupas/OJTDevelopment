export default function HomePage() {
  return (
    <body class="bg-gradient-to-br from-[#085907] to-white-100">
      <div class="flex flex-col items-center justify-center min-h-screen">
        <h1 class="text-4xl font-bold text-white-200 mb-6">
          Welcome to NEA Transportation
        </h1>
        <p class="text-lg text-gray-700 mb-4 text-center max-w-md">
          Your trusted partner for efficient and reliable transportation
          services. We are committed to providing top-notch solutions for all
          your transportation needs.
        </p>
        <a
          href="/Contact"
          class="btn btn-success px-6 py-3 text-lg font-semibold"
        >
          Contact Us
        </a>
      </div>
    </body>
  );
}
