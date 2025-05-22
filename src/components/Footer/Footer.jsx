import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer >
            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between">
                <div className="text-blue-900 font-extrabold text-2xl mb-6 md:mb-0 tracking-wide flex items-center gap-2">
                    
                    Job Portal <span className="text-blue-400 text-base font-normal ml-2">&copy; {new Date().getFullYear()}</span>
                </div>
                <div className="flex space-x-8 text-blue-700 text-base font-medium">
                    <Link to="/" className="hover:text-blue-500 hover:underline transition duration-200">Home</Link>
                    <Link to="/profile" className="hover:text-blue-500 hover:underline transition duration-200">Profile</Link>
                    <a href="mailto:support@jobportal.com" className="hover:text-blue-500 hover:underline transition duration-200">Contact</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;