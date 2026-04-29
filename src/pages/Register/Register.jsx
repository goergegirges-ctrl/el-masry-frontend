import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { supabase } from '../../utils/supabaseClient';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import { useLanguage } from '../../context/LanguageContext';
import './Register.css';

/* ── Icons (shared with Login, inlined for isolation) ── */
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="oauth-icon">
        <path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.6-.2-2.3H12v4.3h5.9c-.3 1.4-1 2.5-2.2 3.3v2.7h3.5c2-1.9 3.3-4.7 3.3-8z"/>
        <path fill="#34A853" d="M12 23c2.9 0 5.3-.9 7.1-2.6l-3.5-2.7c-1 .7-2.2 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.5v2.8C4.3 20.7 7.9 23 12 23z"/>
        <path fill="#FBBC05" d="M6 14.3c-.2-.7-.3-1.4-.3-2.3 0-.8.1-1.6.3-2.3V6.9H2.5C1.8 8.5 1.3 10.2 1.3 12s.5 3.5 1.2 5.1L6 14.3z"/>
        <path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 2.2 14.9 1.3 12 1.3 7.9 1.3 4.3 3.6 2.5 6.9L6 9.7c.9-2.5 3.2-4.3 6-4.3z"/>
    </svg>
);

const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="oauth-icon">
        <path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
);

const EyeIcon = ({ open }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {open ? (
            <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </>
        ) : (
            <>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
            </>
        )}
    </svg>
);

/* Password strength helper */
const getStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score; // 0-4
};

const strengthLabels = { 0: '', 1: 'Weak', 2: 'Fair', 3: 'Good', 4: 'Strong' };
const strengthColors = { 0: '', 1: 'var(--danger)', 2: 'var(--warning)', 3: 'var(--info)', 4: 'var(--success)' };

const Register = () => {
    const { setToken, setUserData, syncUserWishlist } = useContext(StoreContext);
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [data, setData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState(null);
    const [showPw, setShowPw] = useState(false);

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const onRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosClient.post('/api/users/register', data);
            if (response.data.success) {
                setToken(response.data.token);
                setUserData(response.data.user);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                await syncUserWishlist(response.data.token, response.data.user);
                toast.success(t('auth_accountCreated'));
                navigate('/');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(t('auth_registerError'));
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = async (provider) => {
        setOauthLoading(provider);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.origin + '/auth/callback',
                },
            });
            if (error) throw error;
        } catch (err) {
            console.error(`${provider} OAuth error:`, err);
            toast.error(t('auth_oauthError'));
            setOauthLoading(null);
        }
    };

    const strength = getStrength(data.password);

    return (
        <div className="rp-shell">
            <div className="rp-blob rp-blob-1" aria-hidden="true" />
            <div className="rp-blob rp-blob-2" aria-hidden="true" />

            <div className="rp-card">
                {/* Header */}
                <div className="rp-header">
                    <span className="rp-kicker">{t('auth_createBtn')}</span>
                    <h1 className="rp-title">{t('auth_createAccount')}</h1>
                    <p className="rp-sub">{t('auth_tagline')}</p>
                </div>

                {/* OAuth — first for new users who skip form entirely */}
                <div className="rp-socials rp-socials-top">
                    <button
                        type="button"
                        id="btn-google-register"
                        className="rp-soc"
                        onClick={() => handleOAuth('google')}
                        disabled={loading || oauthLoading !== null}
                    >
                        {oauthLoading === 'google' ? <span className="rp-spinner rp-spinner-dark" /> : <GoogleIcon />}
                        {t('auth_continueGoogle')}
                    </button>
                    <button
                        type="button"
                        id="btn-facebook-register"
                        className="rp-soc"
                        onClick={() => handleOAuth('facebook')}
                        disabled={loading || oauthLoading !== null}
                    >
                        {oauthLoading === 'facebook' ? <span className="rp-spinner rp-spinner-dark" /> : <FacebookIcon />}
                        {t('auth_continueFacebook')}
                    </button>
                </div>

                {/* Divider */}
                <div className="rp-divider">
                    <span>{t('auth_orContinueWith')}</span>
                </div>

                {/* Registration form */}
                <form onSubmit={onRegister} className="rp-form" noValidate>
                    {/* Name row */}
                    <div className="rp-name-row">
                        <div className="rp-field">
                            <label htmlFor="reg-firstName" className="rp-label">{t('auth_firstName')}</label>
                            <div className="rp-input-wrap">
                                <span className="rp-icon rp-icon-lead" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                        <circle cx="12" cy="7" r="4"/>
                                    </svg>
                                </span>
                                <input
                                    id="reg-firstName"
                                    name="firstName"
                                    type="text"
                                    autoComplete="given-name"
                                    placeholder="Ahmed"
                                    value={data.firstName}
                                    onChange={onChangeHandler}
                                    className="rp-input"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="rp-field">
                            <label htmlFor="reg-lastName" className="rp-label">{t('auth_lastName')}</label>
                            <div className="rp-input-wrap">
                                <span className="rp-icon rp-icon-lead" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                        <circle cx="12" cy="7" r="4"/>
                                    </svg>
                                </span>
                                <input
                                    id="reg-lastName"
                                    name="lastName"
                                    type="text"
                                    autoComplete="family-name"
                                    placeholder="El-Masry"
                                    value={data.lastName}
                                    onChange={onChangeHandler}
                                    className="rp-input"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="rp-field">
                        <label htmlFor="reg-email" className="rp-label">{t('auth_email')}</label>
                        <div className="rp-input-wrap">
                            <span className="rp-icon rp-icon-lead" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                            </span>
                            <input
                                id="reg-email"
                                name="email"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={data.email}
                                onChange={onChangeHandler}
                                className="rp-input"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="rp-field">
                        <label htmlFor="reg-password" className="rp-label">{t('auth_password')}</label>
                        <div className="rp-input-wrap">
                            <span className="rp-icon rp-icon-lead" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                            </span>
                            <input
                                id="reg-password"
                                name="password"
                                type={showPw ? 'text' : 'password'}
                                autoComplete="new-password"
                                placeholder="Min. 8 characters"
                                value={data.password}
                                onChange={onChangeHandler}
                                className="rp-input"
                                required
                            />
                            <button
                                type="button"
                                className="rp-icon rp-icon-trail rp-pw-toggle"
                                onClick={() => setShowPw(v => !v)}
                                aria-label={showPw ? t('auth_hidePassword') : t('auth_showPassword')}
                            >
                                <EyeIcon open={showPw} />
                            </button>
                        </div>

                        {/* Strength bar */}
                        {data.password && (
                            <div className="rp-strength" role="status" aria-label={`Password strength: ${strengthLabels[strength]}`}>
                                <div className="rp-strength-bars">
                                    {[1, 2, 3, 4].map(i => (
                                        <span
                                            key={i}
                                            className="rp-strength-bar"
                                            style={{ background: i <= strength ? strengthColors[strength] : 'var(--line-200)' }}
                                        />
                                    ))}
                                </div>
                                <span className="rp-strength-lbl" style={{ color: strengthColors[strength] }}>
                                    {strengthLabels[strength]}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button type="submit" className="rp-btn rp-btn-primary" disabled={loading || oauthLoading !== null}>
                        {loading ? <span className="rp-spinner" /> : t('auth_createBtn')}
                    </button>
                </form>

                {/* Footer */}
                <p className="rp-footer">
                    {t('auth_haveAccount')}{' '}
                    <Link to="/login" className="rp-link">{t('auth_loginBtn')}</Link>
                </p>

                {/* Trust */}
                <div className="rp-trust">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <polyline points="9 12 11 14 15 10"/>
                    </svg>
                    SSL secured · © 2026 El-Masry Electronics
                </div>
            </div>
        </div>
    );
};

export default Register;
