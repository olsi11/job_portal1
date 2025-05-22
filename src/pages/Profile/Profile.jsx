import React, { useState, useEffect } from "react";
import { supabase } from "../../Context/Context";

function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newUsername, setNewUsername] = useState("");
    const [updateMessage, setUpdateMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false); // shtohet

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                if (session) {
                    setUserData(session.user);
                }
            } catch (error) {
                console.error("Error fetching user data:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleUpdateUsername = async () => {
        setUpdateLoading(true); // fillon loading
        try {
            const { error } = await supabase.auth.updateUser({
                data: { username: newUsername },
            });
            if (error) throw error;

            setUserData((prev) => ({
                ...prev,
                user_metadata: { ...prev.user_metadata, username: newUsername },
            }));
            setUpdateMessage("Username updated successfully!");
            setIsEditing(false); 
        } catch (error) {
            console.error("Error updating username:", error.message);
            setUpdateMessage("Failed to update username.");
        } finally {
            setUpdateLoading(false); // ndalon loading
        }
    };

    if (loading) {
        return <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
            <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
        </div>;
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700">
            <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Profile</h1>
            {userData ? (
                <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-xl">
                    <p className="text-lg mb-6">
                        <span className="font-semibold text-gray-800">Email:</span> {userData.email}
                    </p>
                    <p className="text-lg mb-6">
                        <span className="font-semibold text-gray-800">Username:</span> {userData.user_metadata?.username || "N/A"}
                    </p>
                    <div className="mt-6">
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    placeholder="Enter new username"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <div className="flex space-x-4">
                                    <button
                                        onClick={handleUpdateUsername}
                                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                                        disabled={updateLoading}
                                    >
                                        {updateLoading ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition"
                                        disabled={updateLoading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Edit Username
                            </button>
                        )}
                        {updateMessage && <p className="text-sm mt-4 text-gray-500">{updateMessage}</p>}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">No user found!</p>
            )}
        </div>
    );
}

export default Profile;
