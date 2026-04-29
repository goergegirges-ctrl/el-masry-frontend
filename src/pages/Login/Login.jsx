import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import AuthLayout from '../../components/Auth/AuthLayout';
import AuthInput from '../../components/Auth/AuthInput';
import PasswordInput from '../../components/Auth/PasswordInput';
import { useLanguage } from '../../context/LanguageContext';
import './Login.css';

const Login = () => {
    const { url, setToken, setUserData, syncUserWishlist } = useContext(StoreContext);
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await axiosClient.post('/api/users/login', data);
            if (response.data.success) {
                setToken(response.data.token);
                setUserData(response.data.user);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                await syncUserWishlist(response.data.token, response.data.user);
                toast.success(t('auth_welcomeToast'));
                navigate("/");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(t('auth_loginError'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout title={t('auth_welcomeBack')}>
            <form onSubmit={onLogin} className="auth-form-content">
                <div className="auth-fields">
                    <AuthInput
                        label={t('auth_email')}
                        name="email"
                        type="email"
                        inputMode="email"
                        placeholder="example@elmasry.com"
                        value={data.email}
                        onChange={onChangeHandler}
                        autoFocus={true}
                    />

                    <PasswordInput
                        label={t('auth_password')}
                        name="password"
                        placeholder="••••••••"
                        value={data.password}
                        onChange={onChangeHandler}
                    />
                </div>

                <div className="auth-options">
                    <Link to="/forgot-password" className="auth-forgot-link">
                        {t('auth_forgotPassword')}
                    </Link>
                </div>

                <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="auth-spinner"></div>
                    ) : (
                        t('auth_loginBtn')
                    )}
                </button>

                <div className="auth-footer">
                    <span>{t('auth_noAccount')}</span>
                    <Link to="/register" className="auth-link">
                        {t('auth_register')}
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;
