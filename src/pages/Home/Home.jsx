import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LuArrowRightFromLine } from "react-icons/lu";
import { RxHamburgerMenu } from "react-icons/rx";
import { supabase } from "../../Context/Context";
import BannerSlider from "../../components/BannerSlider/BannerSlider";
import LiveChat from "../../components/LiveChat/LiveChat";

function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    // Animation for job cards on mount
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            let query = supabase.from('Jobs_form').select('*');
            if (search) {
                query = query.ilike('name', `%${search}%`);
            }
            if (selectedCity) {
                query = query.eq('city', selectedCity);
            }
            if (selectedCategory) {
                query = query.eq('category', selectedCategory);
            }
            const { data, error } = await query;
            if (error) {
                console.error("Error fetching jobs:", error);
                setJobs([]);
            } else {
                setJobs(data || []);
            }
            setLoading(false);
        };
        fetchJobs();
    }, [search, selectedCity, selectedCategory]);

    const fetchBanners = async () => {
        const { data, error } = await supabase.from('banners').select('*');
        if (error) {
            console.error("Error fetching banners:", error);
        } else {
            setBanners(data);
        }
    }
    useEffect(() => {
        fetchBanners();
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 py-12 px-2">
            {/* Hamburger Menu */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-6 left-4 z-50 text-blue-900 bg-white shadow-xl p-3 rounded-full transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                {isOpen ? <LuArrowRightFromLine className="rotate-180" /> : <RxHamburgerMenu />}
            </button>
            {/* Banner Section */}
            <div className="max-w-5xl mx-auto mt-10 mb-12">
                {banners.length > 0 && Array.isArray(banners[0].images) && banners[0].images.length > 0 && (
                    <BannerSlider images={banners[0].images} title={banners[0].title} />
                )}
            </div>
            {/* Search and Filters */}
            <form
                className="flex flex-wrap gap-4 items-center justify-center max-w-4xl mx-auto mb-10 bg-white/90 p-7 rounded-3xl shadow-2xl border border-blue-100"
                onSubmit={e => e.preventDefault()}
            >
                <input
                    type="text"
                    placeholder="Search jobs..."
                    className="flex-1 min-w-[180px] p-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 bg-blue-50 placeholder:text-blue-400"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                {/* City Dropdown */}
                <select
                    name="city"
                    className="text-blue-800 text-sm font-medium p-3 rounded-xl border border-blue-200 min-w-[110px] focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white transition-all duration-300"
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                >
                    <option value="" disabled>
                        City
                    </option>
                    <option value="Prishtina">Prishtine</option>
                    <option value="Gjilan">Gjilan</option>
                    <option value="Vushtrri">Vushtrri</option>
                    <option value="Rahovec">Rahovec</option>
                    <option value="Gjakova">Gjakova</option>
                    <option value="Ferizaj">Ferizaj</option>
                    <option value="Suharekë">Suharekë</option>
                    <option value="Prizren">Prizren</option>
                    <option value="Mitrovica">Mitrovica</option>
                    <option value="Pejë">Pejë</option>
                    <option value="Decan">Decan</option>
                    <option value="Drenas">Drenas</option>
                    <option value="Obiliq">Obiliq</option>
                    <option value="Lipjan">Lipjan</option>
                    <option value="Kamenicë">Kamenicë</option>
                    <option value="Shtime">Shtime</option>
                    <option value="Kaçanik">Kaçanik</option>
                    <option value="Fushë Kosovë">Fushë Kosovë</option>
                    <option value="Mitrovicë">Mitrovicë</option>
                    <option value="Zubin Potok">Zubin Potok</option>
                    <option value="Zvecan">Zvecan</option>
                    <option value="Leposaviq">Leposaviq</option>
                </select>
                {/* Category Dropdown */}
                <select
                    name="category"
                    className="text-blue-800 text-sm font-medium p-3 rounded-xl border border-blue-200 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white transition-all duration-300"
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                >
                    <option value="" disabled>
                        Category
                    </option>
                    <option value="Restaurants">Restaurants</option>
                    <option value="It">IT</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Finance">Finance</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Food">Food</option>
                </select>
                <button
                    type="button"
                    onClick={() => {
                        setSearch("");
                        setSelectedCity("");
                        setSelectedCategory("");
                    }}
                    className="bg-blue-100 text-blue-800 px-5 py-2 rounded-xl text-sm hover:bg-blue-200 transition-all duration-300 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Reset
                </button>
            </form>
            {/* Jobs List */}
            <div className="max-w-7xl mx-auto mt-14 min-h-[200px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
            <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
        </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {jobs.map((job, idx) => (
                            <div
                                key={job.id}
                                className={`relative flex flex-col w-full h-[440px] bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow-2xl rounded-3xl overflow-hidden border border-blue-100 transition-all duration-500
                                    hover:scale-105 hover:shadow-3xl hover:border-blue-400 group opacity-0 translate-y-10`}
                                style={{
                                    animation: `fadeInUp 0.7s cubic-bezier(.23,1.01,.32,1) ${idx * 0.09 + 0.1}s forwards`
                                }}
                            >
                                {/* Decorative background blob */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full opacity-30 blur-2xl z-0"></div>
                                <div className="h-[170px] flex items-center justify-center bg-gradient-to-tr from-blue-50 to-blue-200 relative transition-all duration-500 z-10">
                                    <img
                                        src={job.photo}
                                        alt={job.name}
                                        className="max-h-[110px] max-w-full w-auto object-contain rounded-xl shadow bg-white p-2 transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex flex-col flex-1 p-7 z-10">
                                    <div>
                                        <h2 className="text-2xl font-extrabold text-blue-900 mb-1 transition-colors duration-300 drop-shadow-sm">{job.name}</h2>
                                        <p className="text-blue-700 font-semibold mb-2">{job.position}</p>
                                        <div className="flex gap-2 text-xs text-blue-500 mb-4">
                                            <span className="bg-blue-100/70 px-3 py-1 rounded-full font-medium shadow-sm">{job.city}</span>
                                            <span className="bg-blue-100/70 px-3 py-1 rounded-full font-medium shadow-sm">{job.category}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-auto">
                                        <Link to={`/job-details/${job.id}`}>
                                            <button className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-7 py-2.5 rounded-2xl hover:from-blue-600 hover:to-blue-500 transition-colors font-bold shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                                                View Details
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                                {/* Subtle shadow at bottom */}
                                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-blue-200/40 to-transparent z-0"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div>
            </div>
            {/* Custom animation for fadeInUp */}
            <style>
                {`
                @keyframes fadeInUp {
                    0% {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                `}
            </style>
        </div>
    );
}

export default Home;
