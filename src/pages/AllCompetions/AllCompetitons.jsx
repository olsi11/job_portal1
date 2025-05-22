import React, { useState, useEffect } from "react";
import { supabase } from "../../Context/Context";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";

function AllCompetitions() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            const { data, error } = await supabase
                .from('Jobs_form')
                .select('*');
            if (error) {
                console.error("Error fetching jobs:", error);
            } else {
                setJobs(data);
            }
        };

        fetchJobs();
    }, []);

    const deleteJob = async (id) => {
        const { error } = await supabase
            .from('Jobs_form')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting job:", error);
        } else {
            setJobs(jobs.filter((job) => job.id !== id));
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.name && job.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">All Competitions Dashboard</h1>
            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    placeholder="Search by buisness name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 w-full max-w-md"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                    <div key={job.id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{job.name}</h2>
                        <p className="text-gray-600 mb-4">{job.position}</p>
                        <div className="flex justify-between items-center">
                            <Link to={`/job-details/${job.id}`}>
                                <Button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors" text={"View Details"} />
                            </Link>
                            <Button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                                text={"Delete"}
                                onClick={() => deleteJob(job.id)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllCompetitions;