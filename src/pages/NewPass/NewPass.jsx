import React from "react";
import { useState } from "react";
import Inputs from "../../components/Inputs/Inputs";
import Button from "../../components/Button/Button";
import { supabase } from "../../Context/Context";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function NewPass() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
    
    const handleNewPassword = async () => {
        setLoading(true);
        setError("");
        try {
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
            const { error } = await supabase.auth.updateUser({
                password: password,
            });
            if (error) {
                setError(error.message);
            } else {
                console.log("Password updated successfully.");
                navigate("/login"); // Redirect to login page after successful password update
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4f4f4f4]">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">New Password</h1>
                <div className="flex flex-col space-y-4">
                    <Inputs
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Inputs
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                        text={loading ? "Updating..." : "Update Password"}
                        onClick={handleNewPassword}
                        className={`w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                    />
                    {loading && (
                        <div className="flex justify-center mt-2">
                            <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                        </div>
                    )}
                </div>
                {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                <p className="mt-4 text-sm text-gray-600">Remembered your password? <Link to="/login" className="text-blue-500 hover:underline">Login</Link></p>
            </div>
        </div>
    );
}

export default NewPass;