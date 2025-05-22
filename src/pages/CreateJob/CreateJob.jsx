import { useState, useEffect } from "react";
import { supabase } from "../../Context/Context";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Inputs from "../../components/Inputs/Inputs";
import Button from "../../components/Button/Button";

function CreateJob() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    // Kontrollo nëse është për job apo notify
    const productToEdit = location.state?.product || null;
    const notifyToEdit = location.state?.notify || null;
    // Shto një state për të dalluar tabelën
    const isNotify = !!notifyToEdit;

    // Job states
    const [name, setName] = useState(productToEdit?.name || "");
    const [salary, setSalary] = useState(productToEdit?.salary || 0);
    const [category, setCategory] = useState(productToEdit?.category || "");
    const [photo, setPhoto] = useState(productToEdit?.photo || []);
    const [contactNumber, setContactNumber] = useState(productToEdit?.contactNumber || "");
    const [contactEmail, setContactEmail] = useState(productToEdit?.contactEmail || "");
    const [createdBy, setCreatedBy] = useState(productToEdit?.createdBy || "");
    const [deadline, setDeadline] = useState(productToEdit?.deadline || "");
    const [requirements, setRequirements] = useState(productToEdit?.requirements || "");

    // Notify states
    const [notifyName, setNotifyName] = useState(notifyToEdit?.name || "");
    const [notifyPhoto, setNotifyPhoto] = useState(notifyToEdit?.photo || []);
    const [notifyContactNumber, setNotifyContactNumber] = useState(notifyToEdit?.contactNumber || "");
    const [notifyContactEmail, setNotifyContactEmail] = useState(notifyToEdit?.contactEmail || "");
    const [notifyCreatedBy, setNotifyCreatedBy] = useState(notifyToEdit?.createdBy || "");

const [notifyLoading, setNotifyLoading] = useState(false);

// Kosovo cities array
// Kosovo cities with lat/lng (replace with your actual DB values if different)
const kosovoCities = [
    { name: "Ferizaj", lat: 42.3702, lng: 21.1550 },
    { name: "Mitrovica", lat: 42.8906, lng: 20.8664 },
    { name: "Gjakova", lat: 42.3803, lng: 20.4308 },
    { name: "Peja", lat: 42.6610, lng: 20.2883 },
    { name: "Vushtrri", lat: 42.8231, lng: 20.9675 },
    { name: "Shtime", lat: 42.4333, lng: 21.0333 },
    { name: "Obiliq", lat: 42.6861, lng: 21.0706 },
    { name: "Drenas", lat: 42.6136, lng: 20.9636 },
    { name: "Lipjan", lat: 42.5300, lng: 21.1200 },
    { name: "Fushë Kosovë", lat: 42.6406, lng: 21.0772 },
    { name: "Pristina", lat: 42.6629, lng: 21.1655 },
    { name: "Gjilan", lat: 42.4637, lng: 21.4691 },
    { name: "Kamenicë", lat: 42.5767, lng: 21.5806 },
    { name: "Dragash", lat: 42.0667, lng: 20.6500 },
];

const [city, setCity] = useState(
    productToEdit
        ? kosovoCities.find((c) => c.name === productToEdit.city)?.name || ""
        : ""
);

// Get lat/lng for selected city
const selectedCityObj = kosovoCities.find((c) => c.name === city);
const lat = selectedCityObj ? selectedCityObj.lat : null;
const lng = selectedCityObj ? selectedCityObj.lng : null;

useEffect(() => {
        const fetchUserData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setCreatedBy(session.user.email);
                setNotifyCreatedBy(session.user.email);
            }
        };
        fetchUserData();

        if (productToEdit) {
            setName(productToEdit.name);
            setSalary(productToEdit.salary);
            setCategory(productToEdit.category);
            setPhoto(productToEdit.photo || []);
            setContactNumber(productToEdit.contactNumber || "");
            setContactEmail(productToEdit.contactEmail || "");
            setDeadline(productToEdit.deadline || "");
            setCity(productToEdit.city || "");
            setRequirements(productToEdit.requirements || "");
        }
        if (notifyToEdit) {
            setNotifyName(notifyToEdit.name || "");
            setNotifyPhoto(notifyToEdit.photo || []);
            setNotifyContactNumber(notifyToEdit.contactNumber || "");
            setNotifyContactEmail(notifyToEdit.contactEmail || "");
            setNotifyCreatedBy(notifyToEdit.createdBy || "");
        }
    }, [productToEdit, notifyToEdit]);

    // Add missing states
    const [title, setTitle] = useState(notifyToEdit?.title || "");
    const [description, setDescription] = useState(notifyToEdit?.description || "");
    const [loading, setLoading] = useState(false);

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isNotify) {
            setNotifyLoading(true);
            if (!title || !description || !notifyCreatedBy) {
                alert("Please fill in all fields");
                setNotifyLoading(false);
                return;
            }
            if (id) {
                // Update notify
                const { error } = await supabase
                    .from("Notify")
                    .update({
                        title,
                        description,
                        name: notifyName,
                        photo: Array.isArray(notifyPhoto) ? notifyPhoto : [notifyPhoto],
                        contactNumber: notifyContactNumber,
                        contactEmail: notifyContactEmail,
                        createdBy: notifyCreatedBy
                    })
                    .eq("id", id);
                setNotifyLoading(false);
                if (error) {
                    console.error("Error updating notify:", error);
                } else {
                    navigate("/my-competitions");
                }
            } else {
                // Create notify
                const { error } = await supabase
                    .from("Notify")
                    .insert([
                        {
                            title,
                            description,
                            name: notifyName,
                            photo: Array.isArray(notifyPhoto) ? notifyPhoto : [notifyPhoto],
                            contactNumber: notifyContactNumber,
                            contactEmail: notifyContactEmail,
                            createdBy: notifyCreatedBy,
                        },
                    ]);
                setNotifyLoading(false);
                if (error) {
                    console.error("Error creating notify:", error);
                } else {
                    navigate("/my-competitions");
                }
            }
        } else {
            setLoading(true);
            if (!name || !city || !salary || !category || !photo || !contactNumber || !contactEmail || !deadline || !createdBy || !requirements) {
                alert("Please fill in all fields");
                setLoading(false);
                return;
            }
            if (id) {
                // Update job
                const { error } = await supabase
                    .from("Jobs_form")
                    .update({
                        name,
                        city,
                        salary,
                        category,
                        photo: Array.isArray(photo) ? photo : [photo],
                        contactNumber,
                        lat,
                        lng,
                        contactEmail,
                        deadline,
                        createdBy,
                        requirements: Array.isArray(requirements) ? requirements : [requirements],
                    })
                    .eq("id", id);

                setLoading(false);

                if (error) {
                    console.error("Error updating job:", error);
                } else {
                    navigate("/my-competitions");
                }
            } else {
                // Create new job AND notify
                const jobData = {
                    name,
                    city,
                    salary,
                    category,
                    photo: Array.isArray(photo) ? photo : [photo],
                    contactNumber,
                    contactEmail,
                    lat,
                    lng,
                    deadline,
                    createdBy,
                    requirements: Array.isArray(requirements) ? requirements : [requirements],
                };

                // Insert into Jobs_form
                const { error: jobError } = await supabase
                    .from("Jobs_form")
                    .insert([jobData]);

                // Insert into Notify (p.sh. vetëm disa fusha relevante)
                // Optionally insert into Notify if needed
                // const notifyData = {
                //     name,
                //     photo: Array.isArray(photo) ? photo : [photo],
                //     contactNumber,
                //     contactEmail,
                //     createdBy,
                // };
                // await supabase.from("Notify").insert([notifyData]);

                setLoading(false);

                if (jobError) {
                    console.error("Error creating job:", jobError);
                } else {
                    navigate("/my-competitions");
                }
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-blue-100 ">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-white p-10 rounded-3xl shadow-2xl border border-blue-200"
            >
                <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700 tracking-tight drop-shadow">
                    {isNotify
                        ? (notifyToEdit ? "Edit Notification" : "Create Notification")
                        : (productToEdit ? "Edit Job" : "Create Job")}
                </h2>
                <div className="space-y-7">
                    {isNotify ? (
                        <>
                            <Inputs
                                label="Title"
                                type="text"
                                id="title"
                                placeholder="Title"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <Inputs
                                label="Description"
                                type="text"
                                id="description"
                                placeholder="Description"
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <Inputs
                                label="Name"
                                type="text"
                                id="notifyName"
                                placeholder="Name"
                                name="notifyName"
                                value={notifyName}
                                onChange={(e) => setNotifyName(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <Inputs
                                label="Photo URL"
                                type="url"
                                id="notifyPhoto"
                                name="notifyPhoto"
                                placeholder="Enter photo URL"
                                value={notifyPhoto}
                                onChange={(e) => setNotifyPhoto(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <Inputs
                                label="Contact Number"
                                type="text"
                                id="notifyContactNumber"
                                placeholder="Enter contact number"
                                name="notifyContactNumber"
                                value={notifyContactNumber}
                                onChange={(e) => setNotifyContactNumber(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <Inputs
                                label="Contact Email"
                                type="email"
                                id="notifyContactEmail"
                                placeholder="Enter contact email"
                                name="notifyContactEmail"
                                value={notifyContactEmail}
                                onChange={(e) => setNotifyContactEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </>
                    ) : (
                        <>
                            <Inputs
                                label="Name"
                                type="text"
                                id="name"
                                placeholder="Name of the company"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <div>
                                <label htmlFor="city" className="block mb-2 text-sm font-medium text-blue-700">
                                    City
                                </label>
                                <select
                                    id="city"
                                    name="city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="" disabled>
                                        Select a city
                                    </option>
                                    {kosovoCities.map((cityObj) => (
                                        <option key={cityObj.name} value={cityObj.name}>
                                            {cityObj.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Inputs
                                label="Salary"
                                type="number"
                                id="salary"
                                placeholder="Salary"
                                name="salary"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <Inputs
                                label="Category"
                                type="text"
                                id="category"
                                placeholder="e.g. IT, Marketing"
                                name="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <Inputs
                                label="Photo URL"
                                type="url"
                                id="photo"
                                name="photo"
                                placeholder="Enter photo URL"
                                value={photo}
                                onChange={(e) => setPhoto(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <Inputs
                                label="Requirements"
                                type="text"
                                id="requirements"
                                placeholder="Enter requirements"
                                name="requirements"
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <Inputs
                                label="Contact Number"
                                type="text"
                                id="contactNumber"
                                placeholder="Enter contact number"
                                name="contactNumber"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <Inputs
                                label="Contact Email"
                                type="email"
                                id="contactEmail"
                                placeholder="Enter contact email"
                                name="contactEmail"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <Inputs
                                label="Deadline"
                                type="date"
                                id="deadline"
                                name="deadline"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </>
                    )}
                </div>
                <div className="flex justify-center mt-8">
                    <Button
                        type="submit"
                        className={`w-full py-3 px-4 rounded-xl font-semibold shadow-md transition-all duration-300 ${
                            isNotify ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
                        } ${loading || notifyLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading || notifyLoading}
                    >
                    Create
                        {isNotify ? (notifyToEdit ? "Update Notification" : "Create Notification") : (productToEdit ? "Update Job" : "Create Job")}
                    </Button>
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/my-competitions")}
                        className="text-blue-500 hover:underline"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>  
    );
}
           
      

export default CreateJob;