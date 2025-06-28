import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../config/supabase";

export default function PrivateRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        // Cek session saat komponen mount
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
            setLoading(false);
        };
        getSession();

        // Listen perubahan session (login/logout)
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    if (loading) return null; // Atau tampilkan spinner

    if (!session) {
        // Jika belum login, redirect ke login
        return <Navigate to="/login" replace />;
    }

    // Jika sudah login, render children
    return children;
} 