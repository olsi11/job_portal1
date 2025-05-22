import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../Context/Context";
import { useNavigate } from "react-router-dom";




function AuthGuard({ children }) {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setIsLoggedIn(!!user);

            if (user) {
                // Fetch the user's role from the database
                const { data, error } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', user.id)
                    .single();  

                if (error) {
                    console.error("Error fetching user role:", error.message);
                } else {
                    setUserRole(data.role);
                }
            }
        };
        checkUser();
    }, []);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login", { state: { from: location.pathname } });
        }
    }, [isLoggedIn, navigate, location.pathname]);

    return (
        <>
            {children}
        </>
    );
}

export default AuthGuard;