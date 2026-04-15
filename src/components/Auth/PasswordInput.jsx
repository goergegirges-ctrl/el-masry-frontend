import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './PasswordInput.css';

const PasswordInput = ({ label, name, value, onChange, placeholder, required = true, autoFocus = false }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="password-input-wrapper">
            <label className="auth-label" htmlFor={name}>{label}</label>
            <div className="auth-input-container">
                <input
                    id={name}
                    name={name}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    autoFocus={autoFocus}
                    className="auth-input"
                    autoComplete="current-password"
                />
                <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </div>
    );
};

export default PasswordInput;
