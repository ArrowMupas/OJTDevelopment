import { supabase } from "../../supabaseClient";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loginWithGoogle = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/vehicle-requests`,
      },
    });

    if (error) {
      console.error("Login error:", error.message);
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  // Email/password login
  // const loginWithEmail = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   const { error } = await supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   });
  //   if (error) {
  //     setErrorMsg(error.message);
  //   }
  //   setLoading(false);
  // };

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex min-h-screen items-start justify-center px-8 py-15 sm:items-center"
    >
      <div className="flex w-full max-w-lg flex-col items-center gap-5">
        {/* Logo */}
        <div
          className="flex size-30 cursor-pointer items-center justify-center rounded-full bg-green-100 p-2 transition-transform duration-300 hover:scale-105"
          onClick={() => (window.location.href = "/")}
        >
          <img
            className="h-full w-full object-contain"
            src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/national_electrification_logo.png"
            alt="Logo"
          />
        </div>

        {/* Heading */}
        <h2 className="text-center text-5xl font-bold uppercase sm:text-5xl">
          Transport Operations Services Unit
        </h2>

        <p className="mx-auto max-w-2xl px-4 text-center text-lg leading-relaxed">
          Only authorized employees are allowed to access anything beyond this
          page
        </p>

        {/* Google Login */}
        <button
          onClick={loginWithGoogle}
          disabled={loading}
          className="btn btn-block btn-xl btn-outline rounded-2xl py-8 uppercase"
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
          {loading ? "Redirecting..." : "Login with Google"}
        </button>

        {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

        {/* <>
          <div className="flex w-full items-center gap-4">
            <hr className="flex-1 border-gray-300" />
            <span className="text-sm text-gray-500 uppercase">or</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <form
            onSubmit={loginWithEmail}
            className="flex w-full flex-col gap-4"
          >
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition-colors duration-300 hover:bg-green-700"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-2 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-semibold text-green-600 hover:underline"
            >
              Sign up
            </a>
          </p>

          <p className="mt-2 text-center text-xs text-gray-500">
            By logging in, you agree to our Terms and Privacy Policy.
          </p>
        </> */}
      </div>
    </motion.div>
  );
}
