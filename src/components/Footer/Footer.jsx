import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} className="footer-logo" alt="El-Masry" />
          <p>​"El-Masry for Screen Parts & Electronics is your premier destination for high-quality electronic components and professional screen parts. We are committed to providing original products and exceptional service to keep your devices running perfectly."</p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li>About us</li>
            <li>Delivery</li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+201031451015</li>
            <li>+201229424078</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2026 © El-Masry-Electronics.com - All Rights Reserved</p>
    </div>
  )
}

export default Footer
