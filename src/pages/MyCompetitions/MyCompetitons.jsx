import { useState, useEffect } from "react";
import { supabase } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function MyCompetitions() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            const { data: session, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
                console.error("Error getting session:", sessionError);
                setLoading(false);
                return;
            }
            if (session?.session) {
                const user = session.session.user;
                const { data, error } = await supabase
                    .from("Jobs_form")
                    .select("*")
                    .eq("createdBy", user.email);
                if (error) {
                    console.error("Error fetching jobs:", error);
                } else {
                    setJobs(data || []);
                }
            } else {
                console.error("No active session found.");
            }
            setLoading(false);
        };

        fetchJobs();
    }, []);

    const handleDelete = async (id) => {
        const { error } = await supabase.from("Jobs_form").delete().eq("id", id);
        if (error) {
            console.error("Error deleting job:", error);
        } else {
            // Remove the deleted job from the state
            setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
        }
    };

    // Ky funksion dërgon userin te CreateJob me të dhënat për update
    const handleUpdate = async (job) => {
        // Fito të dhënat më të fundit nga databaza (opsionale, për siguri)
        const { data, error } = await supabase
            .from("Jobs_form")
            .select("*")
            .eq("id", job.id)
            .single();

        if (error) {
            console.error("Error fetching job for update:", error);
            return;
        }

        // Dërgo te CreateJob me të dhënat e sakta
        navigate(`/update-job/${job.id}`, { state: { product: data } });
    };

    return (
        <div>
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
            <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
           
        </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                    {jobs.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 text-lg">No competitions found.</div>
                    ) : (
                        jobs.map((job) => (
                            <div
                                key={job.id}
                                className="border p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col justify-between h-full bg-gradient-to-r from-blue-50 to-blue-100"
                            >
                                <Link to={`/job-details/${job.id}`}>
                                    <div className="flex-grow">
                                        {job.photo && (
                                            <img
                                                src={job.photo}
                                                alt={job.name}
                                                className="w-full h-56 object-cover rounded-t-lg transition-transform duration-300 hover:scale-105"
                                            />
                                        )}
                                    </div>
                                </Link>
                                <div className="px-4 py-2 flex flex-col justify-between">
                                    <h3 className="text-xl font-bold text-gray-800">{job.name}</h3>
                                    <p className="text-gray-700 text-sm mt-2">{job.position}</p>
                                    <p className="text-2xl font-extrabold text-blue-900 mt-4">{job.salary} $</p>
                                    <div className="flex justify-between mt-4">
                                        <button
                                            onClick={() => handleUpdate(job)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded transition-all duration-300 hover:scale-105"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(job.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded transition-all duration-300 hover:scale-105"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default MyCompetitions;
