import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import AuthLayout from '../../components/Auth/AuthLayout';
import AuthInput from '../../components/Auth/AuthInput';
import PasswordInput from '../../components/Auth/PasswordInput';
import { useLanguage } from '../../context/LanguageContext';
import './Register.css';

const Register = () => {
    const { url, setToken, setUserData, syncUserWishlist } = useContext(StoreContext);
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onRegister = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await axiosClient.post('/api/users/register', data);
            if (response.data.success) {
                setToken(response.data.token);
                setUserData(response.data.user);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                await syncUserWishlist(response.data.token, response.data.user);
                toast.success(t('auth_accountCreated'));
                navigate("/");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(t('auth_registerError'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout title={t('auth_createAccount')}>
            <form onSubmit={onRegister} className="auth-form-content">
                <div className="auth-fields">
                    <div className="auth-input-row">
                        <AuthInput
                            label={t('auth_firstName')}
                            name="firstName"
                            placeholder="Ahmed"
                            value={data.firstName}
                            onChange={onChangeHandler}
                            autoFocus={true}
                        />
                        <AuthInput
                            label={t('auth_lastName')}
                            name="lastName"
                            placeholder="El-Masry"
                            value={data.lastName}
                            onChange={onChangeHandler}
                        />
                    </div>

                    <AuthInput
                        label={t('auth_email')}
                        name="email"
                        type="email"
                        inputMode="email"
                        placeholder="example@elmasry.com"
                        value={data.email}
                        onChange={onChangeHandler}
                    />

                    <PasswordInput
                        label={t('auth_password')}
                        name="password"
                        placeholder="••••••••"
                        value={data.password}
                        onChange={onChangeHandler}
                    />
                </div>

                <button
                    type="submit"
                    className="auth-submit-btn"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="auth-spinner"></div>
                    ) : (
                        t('auth_createBtn')
                    )}
                </button>

                <div className="auth-footer">
                    <span>{t('auth_haveAccount')}</span>
                    <Link to="/login" className="auth-link">
                        {t('auth_loginBtn')}
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Register;
