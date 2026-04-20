import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'

const LoginPopup = ({ setShowLogin }) => {

  const [currState, setCurrState] = useState("Sign Up")

  const isSignUp = currState === "Sign Up"

  return (
    <div className='login-popup'>
      <form className="login-popup-container" onSubmit={(e) => e.preventDefault()}>
        <div className="login-popup-title">
          <h2>{isSignUp ? "إنشاء حساب / Sign Up" : "تسجيل الدخول / Log In"}</h2>
          <button
            type="button"
            onClick={() => setShowLogin(false)}
            className="login-popup-close"
            aria-label="إغلاق / Close"
          >
            <img src={assets.cross_icon} alt="" aria-hidden="true" />
          </button>
        </div>

        <div className="login-popup-inputs">
          {isSignUp && (
            <div className="input-group">
              <label htmlFor="popup-name">الاسم / Full name</label>
              <input id="popup-name" type="text" placeholder="e.g. Ahmed Hassan" required />
            </div>
          )}
          <div className="input-group">
            <label htmlFor="popup-email">البريد الإلكتروني / Email</label>
            <input id="popup-email" type="email" placeholder="example@email.com" required />
          </div>
          <div className="input-group">
            <label htmlFor="popup-password">كلمة المرور / Password</label>
            <input id="popup-password" type="password" placeholder="••••••••" required />
          </div>
        </div>

        <button type="submit">
          {isSignUp ? "إنشاء الحساب / Create account" : "تسجيل الدخول / Log in"}
        </button>

        <div className="login-popup-condition">
          <input id="popup-terms" type="checkbox" required />
          <label htmlFor="popup-terms">
            أوافق على <a href="/privacy">شروط الاستخدام وسياسة الخصوصية</a> / I agree to the <a href="/privacy">terms of use and privacy policy</a>.
          </label>
        </div>

        {isSignUp
          ? <p>لديك حساب بالفعل؟ <button type="button" className="auth-switch-btn" onClick={() => setCurrState("Login")}>تسجيل الدخول / Log in</button></p>
          : <p>ليس لديك حساب؟ <button type="button" className="auth-switch-btn" onClick={() => setCurrState("Sign Up")}>إنشاء حساب / Sign up</button></p>
        }
      </form>
    </div>
  )
}

export default LoginPopup
