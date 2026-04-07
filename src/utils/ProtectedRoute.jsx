import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      const userEmail = session.user.email;

      // 🔐 check if email is allowed
      const { data, error } = await supabase
        .from("users")
        .select("email")
        .eq("email", userEmail)
        .single();

      if (data) {
        setAuthenticated(true);
      } else {
        await supabase.auth.signOut();
        setAuthenticated(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return null;

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
