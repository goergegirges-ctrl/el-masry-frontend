import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import AuthLayout from '../../components/Auth/AuthLayout';
import AuthInput from '../../components/Auth/AuthInput';
import PasswordInput from '../../components/Auth/PasswordInput';
import './Register.css';

const Register = () => {
    const { url, setToken, setUserData, syncUserWishlist } = useContext(StoreContext);
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
            const response = await axios.post(`${url}/api/users/register`, data);
            if (response.data.success) {
                setToken(response.data.token);
                setUserData(response.data.user);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                await syncUserWishlist(response.data.token, response.data.user);
                toast.success("Account created! مرحباً بك في المصري للإلكترونيات");
                navigate("/");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during registration. حدث خطأ أثناء التسجيل");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout 
            titleAr="إنشاء حساب جديد" 
            titleEn="Create New Account"
        >
            <form onSubmit={onRegister} className="auth-form-content">
                <div className="auth-fields">
                    <div className="auth-input-row">
                        <AuthInput 
                            label="الاسم الأول | First Name"
                            name="firstName"
                            placeholder="Ahmed"
                            value={data.firstName}
                            onChange={onChangeHandler}
                            autoFocus={true}
                        />
                        <AuthInput 
                            label="اسم العائلة | Last Name"
                            name="lastName"
                            placeholder="El-Masry"
                            value={data.lastName}
                            onChange={onChangeHandler}
                        />
                    </div>
                    
                    <AuthInput 
                        label="البريد الإلكتروني | Email"
                        name="email"
                        type="email"
                        inputMode="email"
                        placeholder="example@elmasry.com"
                        value={data.email}
                        onChange={onChangeHandler}
                    />
                    
                    <PasswordInput 
                        label="كلمة المرور | Password"
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
                        "إنشاء الحساب | Create Account"
                    )}
                </button>

                <div className="auth-footer">
                    <span>لديك حساب بالفعل؟ | Already have an account?</span>
                    <Link to="/login" className="auth-link">
                        تسجيل الدخول | Login
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Register;
