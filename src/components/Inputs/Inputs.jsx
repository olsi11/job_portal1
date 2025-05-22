import React from "react";

function Inputs({ type, placeholder, value, onChange, name, className }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            className={className}
        />
    );
}

export default Inputs;
