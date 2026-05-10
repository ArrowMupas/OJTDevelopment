import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function RoleRouter() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/login", { replace: true });
        return;
      }

      const { data } = await supabase
        .from("users")
        .select("role")
        .eq("email", session.user.email)
        .maybeSingle();

      if (!data) {
        navigate("/login", { replace: true });
        return;
      }

      const role = data.role;

      if (role === "admin") {
        navigate("/vehicle-requests", { replace: true });
      } else if (role === "mechanic") {
        navigate("/repairs", { replace: true });
      } else if (role === "guard") {
        navigate("/entry-exit-monitoring", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    };

    run();
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <span className="loading loading-spinner loading-lg text-green-600"></span>
    </div>
  );
}
