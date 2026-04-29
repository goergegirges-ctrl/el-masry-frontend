import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './PasswordInput.css';
import { useLanguage } from '../../context/LanguageContext';

const PasswordInput = ({ label, name, value, onChange, placeholder, required = true, autoFocus = false }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useLanguage();

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
                    aria-label={showPassword ? t('auth_hidePassword') : t('auth_showPassword')}
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </div>
    );
};

export default PasswordInput;
