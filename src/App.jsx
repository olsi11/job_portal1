import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import SignUp from "./pages/SignUp/SignUp";
import CreateJob from "./pages/CreateJob/CreateJob";
import JobDetails from "./components/JobDetails/JobDatails";
import ForgotPass from "./pages/ForgotPass/ForgotPass";
import Competitions from "./pages/Competitions/Competitons";
import Header from "./components/Header/Header";
import NewPass from "./pages/NewPass/NewPass";
import Category from "./pages/Category/Category";
import MyCompetitions from "./pages/MyCompetitions/MyCompetitons";
import AllCompetitions from "./pages/AllCompetions/AllCompetitons";
import Apply from "./pages/Apply/Apply";
import Notify from "./pages/Notify/Notify";
import Footer from "./components/Footer/Footer";

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/createjob" element={<CreateJob />} />
                <Route path="/update-job/:id" element={<CreateJob />} />
                <Route path="/job-details/:id" element={<JobDetails />} />
                <Route path="/forgotpass" element={<ForgotPass />} />
                <Route path="/competitions" element={<Competitions />} />
                <Route path="/newpass" element={<NewPass />} />
                <Route path="/category/:categoryName" element={<Category />} />
                <Route path="/my-competitions" element={<MyCompetitions />} />
                <Route path="/all-competitions" element={<AllCompetitions />} />
                <Route path="/apply/:id" element={<Apply />} />
                <Route path="/notifications" element={<Notify />} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
                
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
