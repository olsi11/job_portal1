import React, { useState } from "react";
import Inputs from "../../components/Inputs/Inputs";
import Button from "../../components/Button/Button";
import { supabase } from "../../Context/Context";

function ForgotPass() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async () => {
        setLoading(true);
        setError("");
        setMessage("");
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: "http://localhost:5173/newpass",
            });
            if (error) {
                setError(error.message);
            } else {
                setMessage("Password reset email sent! Check your inbox.");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Forgot Password</h1>
                <Inputs
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                    text={loading ? "Sending..." : "Send Reset Email"}
                    onClick={handleForgotPassword}
                    className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                />
                {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
                {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
}

export default ForgotPass;