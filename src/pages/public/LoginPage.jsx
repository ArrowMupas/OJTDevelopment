import { supabase } from "../../supabaseClient";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/admindashboard` },
    });

    if (error) console.error("Login error:", error.message);
  };

  // Email/password login
  const loginWithEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setErrorMsg(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-linear-to-br from-emerald-100 via-green-100 to-green-200 py-4 sm:py-14">
      <div className="max-w-md w-full card bg-base-100 rounded-3xl shadow-sm p-7 flex flex-col items-center gap-4">
        {/* Logo */}
        <div
          className="size-25 bg-green-100 rounded-full p-2 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => (window.location.href = "/")}
        >
          <img
            className="w-full h-full object-contain"
            src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/national_electrification_logo.png"
            alt="Logo"
          />
        </div>

        {/* Heading */}
        <h2 className="text-center text-xl sm:text-3xl font-bold text-green-800  ">
          Transport Operations Services Unit
        </h2>
        <span className="text-green-600 text-lg sm:text-sm font-semibold">
          Motorpool
        </span>

        {/* Google Login */}
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 text-sm py-3 rounded uppercase font-bold shadow-sm hover:bg-gray-100 transition-all duration-300 border border-gray-300"
        >
          <svg
            aria-label="Google logo"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <g>
              <path d="M0 0H512V512H0" fill="#fff"></path>
              <path
                fill="#34a853"
                d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
              ></path>
              <path
                fill="#4285f4"
                d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
              ></path>
              <path
                fill="#fbbc02"
                d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
              ></path>
              <path
                fill="#ea4335"
                d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
              ></path>
            </g>
          </svg>
          Login with Google
        </button>

        {/* Divider */}
        <div className="flex items-center w-full gap-4">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-400 text-sm uppercase">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Email / Password Login */}
        <form onSubmit={loginWithEmail} className="w-full flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup */}
        <p className="text-gray-500 text-sm text-center mt-2">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-green-600 font-semibold hover:underline"
          >
            Sign up
          </a>
        </p>

        <p className="text-xs text-gray-400 mt-2 text-center">
          By logging in, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
