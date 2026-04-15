import React from 'react';
import './PasswordInput.css'; // Reuse container and input styles

const AuthInput = ({ label, name, value, onChange, placeholder, type = "text", inputMode = "text", required = true, autoFocus = false }) => {
    return (
        <div className="password-input-wrapper">
            <label className="auth-label" htmlFor={name}>{label}</label>
            <div className="auth-input-container">
                <input
                    id={name}
                    name={name}
                    type={type}
                    inputMode={inputMode}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    autoFocus={autoFocus}
                    className="auth-input"
                />
            </div>
        </div>
    );
};

export default AuthInput;
