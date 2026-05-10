import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const isDev = import.meta.env.DEV;

  useEffect(() => {
    const checkSession = async () => {
      if (isDev) {
        setAuthenticated(true);
        setLoading(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("email")
        .eq("email", session.user.email)
        .maybeSingle();

      if (error || !data) {
        setAuthenticated(false);
      } else {
        setAuthenticated(true);
      }

      setLoading(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      checkSession();
    });

    return () => subscription.unsubscribe();
  }, [isDev]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-green-600"></span>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
