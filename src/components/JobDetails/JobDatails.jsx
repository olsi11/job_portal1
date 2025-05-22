import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../Context/Context";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";


function JobDetails() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobDetails = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("Jobs_form")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (error) {
                    console.error("Error fetching job details:", error);
                } else {
                    setJob(data);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [id]);

    const handleApplyClick = () => {
        navigate(`/apply/${job.id}`);
    };
    console.log(job);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
                    <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>

                </div>
            ) : job ? (
                <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl mx-4 sm:mx-auto transition-all duration-500 hover:scale-[1.01] hover:shadow-blue-200">
                    <div className="w-full overflow-hidden rounded-t-2xl border border-gray-200 mb-6 transition-all duration-300 hover:shadow-lg">
                        <img
                            src={job.photo}
                            alt={job.name}
                            className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
                        />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center tracking-tight transition-all duration-300 hover:tracking-wider">
                        {job.name}
                    </h1>
                    <div className="space-y-4">
                        <p className="text-gray-700 transition-colors duration-300 hover:text-blue-700">
                            <span className="font-semibold">City:</span> {job.city}
                        </p>
                        <p className="text-gray-700 transition-colors duration-300 hover:text-blue-700">
                            <span className="font-semibold">Salary:</span> {job.salary}
                        </p>
                        <p className="text-gray-700 transition-colors duration-300 hover:text-blue-700">
                            <span className="font-semibold">Email Contact:</span> {job.contactEmail}
                        </p>
                        <p className="text-gray-700 transition-colors duration-300 hover:text-blue-700">
                            <span className="font-semibold">Number Contact:</span> {job.contactNumber}
                        </p>
                        <p className="text-gray-700 transition-colors duration-300 hover:text-blue-700">
                            <span className="font-semibold">Deadline Date:</span> {job.deadline}
                        </p>
                        {(typeof job.lat === "number" && typeof job.lng === "number" && !isNaN(job.lat) && !isNaN(job.lng)) ? (
                        
                            <MapContainer center={[job.lat, job.lng]} zoom={13} scrollWheelZoom={false} style={{ height: "300px", width: "100%" }}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[job.lat, job.lng]}>
                                    <Popup>
                                        {job.name} <br /> {job.city}
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        ) : (
                            <div className="text-gray-500 italic">Location not available</div>
                        )}
                        <ul>
                            <li className="text-gray-700 transition-colors duration-300 hover:text-blue-700">
                                <span className="font-semibold">Requirements:</span>{" "}
                                {Array.isArray(job.requirements) && job.requirements.length > 0
                                    ? job.requirements.join(", ")
                                    : "N/A"}
                            </li>
                        </ul>
                    </div>
                    <button
                        onClick={handleApplyClick}
                        className="mt-8 w-full bg-blue-500 text-white py-3 px-4 rounded-xl font-semibold shadow-md hover:bg-blue-600 hover:scale-105 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        Apply Now
                    </button>
                </div>
            ) : (
                <p className="text-lg font-semibold text-gray-700">Job not found.</p>
            )}
        </div>
    );
}

export default JobDetails;
