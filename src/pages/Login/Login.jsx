import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import AuthLayout from '../../components/Auth/AuthLayout';
import AuthInput from '../../components/Auth/AuthInput';
import PasswordInput from '../../components/Auth/PasswordInput';
import './Login.css';

const Login = () => {
    const { url, setToken, setUserData, syncUserWishlist } = useContext(StoreContext);
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
            const response = await axios.post(`${url}/api/users/login`, data);
            if (response.data.success) {
                setToken(response.data.token);
                setUserData(response.data.user);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                await syncUserWishlist(response.data.token, response.data.user);
                toast.success("Welcome back! مرحباً بعودتك");
                navigate("/");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during login. حدث خطأ أثناء تسجيل الدخول");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout 
            titleAr="مرحباً بعودتك" 
            titleEn="Welcome Back"
        >
            <form onSubmit={onLogin} className="auth-form-content">
                <div className="auth-fields">
                    <AuthInput 
                        label="البريد الإلكتروني | Email"
                        name="email"
                        type="email"
                        inputMode="email"
                        placeholder="example@elmasry.com"
                        value={data.email}
                        onChange={onChangeHandler}
                        autoFocus={true}
                    />
                    
                    <PasswordInput 
                        label="كلمة المرور | Password"
                        name="password"
                        placeholder="••••••••"
                        value={data.password}
                        onChange={onChangeHandler}
                    />
                </div>

                <div className="auth-options">
                    <Link to="/forgot-password" style={{ color: '#718096', fontSize: '14px', textDecoration: 'none' }}>
                        نسيت كلمة المرور؟ | Forgot Password?
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
                        "تسجيل الدخول | Login"
                    )}
                </button>

                <div className="auth-footer">
                    <span>ليس لديك حساب؟ | Don't have an account?</span>
                    <Link to="/register" className="auth-link">
                        إنشاء حساب | Register
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;
