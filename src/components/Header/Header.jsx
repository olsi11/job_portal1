import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../Context/Context";
import { FaRegUserCircle } from "react-icons/fa"; // Example icon from react-icons
import { IoIosNotificationsOutline } from "react-icons/io";




function Header() {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [notificationsCount, setNotificationsCount] = useState(0);

    useEffect(() => {
        const fetchNotificationsCount = async () => {
            const { data, error } = await supabase
                .from('Notify')
                .select('id', { count: 'exact' });

            if (error) {
                console.error("Error fetching notifications count:", error.message);
            } else {
                setNotificationsCount(data.length || 0);
            }
        };

        fetchNotificationsCount();
    }, []);

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

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error signing out:", error.message);
        } else {
            setIsLoggedIn(false);
            window.location.href = "/login";
        }
    };

    const handleNotificationsClick = () => {
        window.location.href = "/notifications";
    }


    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Job Portal</Link>
                <nav className="space-x-4 flex flex-wrap justify-center md:justify-end items-center">
                    {userRole !== "Business" && (
                        <Link to="/" className={`relative ${location.pathname === "/" ? "text-blue-600 font-bold" : "text-gray-600 hover:text-gray-800"}`}>
                            Home
                        </Link>
                    )}

                    {userRole !== "Employee" && userRole !== "Admin" && userRole === "Business" && (
                        <Link to="/my-competitions" className={`relative ${location.pathname === "/my-competitions" ? "text-blue-600 font-bold" : "text-gray-600 hover:text-gray-800"}`}>
                            My Competitions
                        </Link>
                    )}

                    

                    

                    {userRole !== "Employee" && userRole !== "Business" && userRole === "Admin" && (
                        <Link to="/all-competitions" className={`relative ${location.pathname === "/all-competitions" ? "text-blue-600 font-bold" : "text-gray-600 hover:text-gray-800"}`}>
                            All Competitions
                        </Link>
                    )}

                    {userRole !== "Employee" && userRole !== "Admin" && userRole === "Business" && (
                        <Link to="/createjob" className={`relative ${location.pathname === "/createjob" ? "text-blue-600 font-bold" : "text-gray-600 hover:text-gray-800"}`}>
                            Create Job
                        </Link>
                    )}

                    {userRole !== "Employee" && userRole !== "Business" && userRole === "Admin" && (
                        <button onClick={handleNotificationsClick}  className={`relative flex items-center ${location.pathname === "/notifications" ? "text-blue-600 font-bold" : "text-gray-600 hover:text-gray-800"}`}>
                            <IoIosNotificationsOutline className="text-gray-600" size={22} />
                            {notificationsCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
                                    {notificationsCount}
                                </span>
                            )}
                            
                        </button>
                    )}

                    <Link to="/profile" className={`relative flex items-center ${location.pathname === "/profile" ? "text-blue-600 font-bold" : "text-gray-600 hover:text-gray-800"}`}>
                        <FaRegUserCircle className="mr-2 text-gray-600" size={20} /> Profile
                    </Link>
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-800">Logout</button>
                    ) : (
                        <>
                            <Link to="/login" className={`relative ${location.pathname === "/login" ? "px-3 py-1 bg-blue-800 text-white rounded" : "px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-800"}`}>
                                Login
                            </Link>
                            <Link to="/signup" className={`relative ${location.pathname === "/signup" ? "px-3 py-1 bg-green-800 text-white rounded" : "px-3 py-1 bg-green-600 text-white rounded hover:bg-green-800"}`}>
                                Sign Up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );

}


export default Header;
