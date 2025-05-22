import { useState, useEffect } from "react";
import { supabase } from "../../Context/Context";
import { useParams, useNavigate } from "react-router-dom";

function Apply() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [loading, setLoading] = useState(true);
    const [job, setJob] = useState(null);

    useEffect(() => {
        // Fetch the job details and createdBy field from the Job_form table
        const fetchJob = async () => {
            try {
                const { data, error } = await supabase
                    .from("Jobs_form")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (error) {
                    console.error("Error fetching job:", error.message);
                    setLoading(false);
                    return;
                }

                setJob(data);
                setCreatedBy(data?.createdBy || "");
            } catch (error) {
                console.error("Error fetching job:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { error } = await supabase
                .from("Apply_form")
                .insert([{ name, email, phone, coverLetter, job_id: id, createdBy }]);

            if (error) {
                console.error("Error inserting application:", error.message);
                alert("Failed to submit application. Please try again.");
                return;
            }

            alert("Application submitted successfully!");
            navigate(-1);
        } catch (error) {
            console.error("Error submitting application:", error.message);
            alert("Failed to submit application. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    <p className="text-center text-lg md:text-xl">Loading...</p>
                </div>
            ) : job ? (
                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md md:max-w-lg lg:max-w-2xl transition-all duration-300 hover:shadow-xl">
                    <img src={job?.photo} alt={job?.name || "Job Image"} className="mb-4 w-full h-48 object-cover rounded" />
                    <h1 className="text-xl md:text-2xl font-bold mb-4">{job.name}</h1>

                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md md:max-w-lg lg:max-w-2xl transition-all duration-300 hover:shadow-xl">
                    <h1 className="text-xl md:text-2xl font-bold mb-4">Job Not Found</h1>
                    <p className="text-gray-700">The job you are trying to apply for does not exist.</p>
                </div>
            )}
            {job && !loading && (
                <>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl text-blue-500 font-extrabold mb-8 transition-all duration-300">
                        Application Form
                    </h1>
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white text-gray-800 shadow-2xl rounded-lg px-6 md:px-10 pt-8 pb-10 mb-6 w-full max-w-md md:max-w-lg transition-all duration-300 hover:shadow-xl"
                    >
                        <div className="mb-6">
                            <label htmlFor="name" className="block text-gray-700 text-sm md:text-base font-semibold mb-2">
                                Name:
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-2 md:py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-2">
                                Phone:
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="coverLetter" className="block text-gray-700 text-sm font-semibold mb-2">
                                Cover Letter:
                            </label>
                            <textarea
                                id="coverLetter"
                                name="coverLetter"
                                rows="4"
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                required
                                className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 transition-all duration-300 hover:scale-105 text-white font-bold py-2 md:py-3 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            Submit Application
                        </button>
                    </form>
                </>
            )}
            <button
                onClick={() => navigate(-1)}
                className="text-blue-500 hover:underline mt-6 text-lg font-medium transition-all duration-300 hover:scale-105"
            >
                Back to Job Details
            </button>
        </div>
    );
}

export default Apply;
