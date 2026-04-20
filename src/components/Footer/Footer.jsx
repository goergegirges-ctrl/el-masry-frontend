import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} className="footer-logo" alt="El-Masry Electronics" />
          <p>​"El-Masry for Screen Parts & Electronics is your premier destination for high-quality electronic components and professional screen parts. We are committed to providing original products and exceptional service to keep your devices running perfectly."</p>
          <div className="footer-social-icons" aria-label="وسائل التواصل الاجتماعي / Social media">
            <img src={assets.facebook_icon} alt="" aria-hidden="true" />
            <img src={assets.twitter_icon} alt="" aria-hidden="true" />
            <img src={assets.linkedin_icon} alt="" aria-hidden="true" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li className="footer-placeholder">About us</li>
            <li className="footer-placeholder">Delivery</li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li><a href="tel:+201031451015" className="footer-phone">+20 103 145 1015</a></li>
            <li><a href="tel:+201229424078" className="footer-phone">+20 122 942 4078</a></li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2026 © El-Masry-Electronics.com - All Rights Reserved</p>
    </div>
  )
}

export default Footer
