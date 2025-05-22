import React, { useEffect, useState } from "react";
import { supabase } from "../../Context/Context";
import { useNavigate } from "react-router-dom";

function Notify() {
    const [jobForms, setJobForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobForms();
        // eslint-disable-next-line
    }, []);

    const fetchJobForms = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('Notify')
                .select('*');
            if (error) {
                console.error("Error fetching data:", error);
            } else {
                setJobForms(data);
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        }
        setLoading(false);
    };

    const handleRead = async (id) => {
        const { error } = await supabase
            .from('Notify')
            .delete()
            .eq('id', id);
        if (!error) {
            setJobForms(jobForms.filter(form => form.id !== id));
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
                        <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                    </div>
                ) : jobForms.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                                <th className="px-6 py-3"></th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {jobForms.map((form) => (
                                <tr key={form.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{form.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{form.contactNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => navigate(`/job-details/${form.id}`)}
                                            className="text-blue-500 hover:underline"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleRead(form.id)}
                                            className="text-green-500 hover:underline"
                                        >
                                            Read
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No notifications available.</p>
                )}
            </div>
        </div>
    );
}

export default Notify;