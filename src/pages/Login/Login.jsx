import React, { useState } from "react";
import Inputs from "../../components/Inputs/Inputs";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import { supabase } from "../../Context/Context";
import { useEffect } from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                console.log("User already logged in:", data.session);
                // Redirect or perform actions if user is already logged in
            }
        };
        checkSession();
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
            } else {
                console.log("Login successful:", data);
                window.location.href = "/"; 
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4f4f4f4]">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h1>
                <div className="flex flex-col space-y-4">
                    <Inputs
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Inputs
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {loading && (
                    <div className="flex justify-center mt-4">
                        <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                    </div>
                )}
                <div className="h-4"></div>
                <Button
                    text={loading ? "Logging in..." : "Login"}
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 mt-6"
                    disabled={loading}
                />
                <p className="text-sm text-gray-600 mt-4 text-center">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-500 hover:underline">
                        Sign Up
                    </Link>
                </p>
                <p className="text-sm text-gray-600 mt-2 text-center">
                    Forgot your password?{" "}
                    <Link to="/forgotpass" className="text-blue-500 hover:underline">
                        Reset Password
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;