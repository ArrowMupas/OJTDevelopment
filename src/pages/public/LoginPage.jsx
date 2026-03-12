import { supabase } from "../../supabaseClient";

export default function Login() {
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173/admindashboard",
      },
    });

    if (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card card-body max-w-xl p-10 flex flex-col justify-center items-center gap-8 bg-green-500 text-white">
        <div
          className="w-30  aspect-square bg-white rounded-full p-1 flex items-center justify-center cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          <img
            className="w-full h-full object-contain"
            src="https://yelvewyjonvcyucwjcti.supabase.co/storage/v1/object/public/NEAMotorpoolBucket/national_electrification_logo.png"
            alt="Logo"
          />
        </div>
        <h2 className="font-bold tracking-tight uppercase text-2xl text-center ">
          Transport Operations Services Unit
          <br />
          National Electrification Administration
        </h2>
        <button
          className="btn bg-white text-black border-[#e5e5e5]"
          onClick={loginWithGoogle}
        >
          <svg
            aria-label="Google logo"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <g>
              <path d="m0 0H512V512H0" fill="#fff"></path>
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
      </div>
    </div>
  );
}
