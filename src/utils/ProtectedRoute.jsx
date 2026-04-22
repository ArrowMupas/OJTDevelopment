import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const isDev = import.meta.env.DEV;

  useEffect(() => {
    const handleSession = async (session) => {
      if (isDev) {
        setAuthenticated(true);
        setLoading(false);
        return;
      }

      if (!session) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const userEmail = session.user.email;

        const { data, error } = await supabase
          .from("users")
          .select("email")
          .eq("email", userEmail)
          .single();

        if (error || !data) {
          await supabase.auth.signOut();
          setAuthenticated(false);
        } else {
          setAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth check error:", err.message);
        setAuthenticated(false);
      }

      setLoading(false);
    };

    const checkInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      await handleSession(session);
    };

    // initial check
    checkInitialSession();

    // listen for login/logout changes (IMPORTANT for OAuth)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, [isDev]);

  // ⏳ loading UI
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-green-600"></span>
      </div>
    );
  }

  // ❌ not allowed → login page
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ allowed → render page
  return children;
}
