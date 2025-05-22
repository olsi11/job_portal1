import React from "react";




function Button({ text, onClick, type, className }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${className}`}
        >
            {text}
        </button>
    );
}

export default Button;
