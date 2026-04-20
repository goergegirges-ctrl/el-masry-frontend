import React from 'react'
import './Appdownload.css'
import { assets } from '../../assets/assets'

const Appdownload = () => {
  return (
    <div className='app-download' id='app-download'>
      <p>Soon <br />El-Masry App</p>
      <div className="app-download-platforms">
        <img src={assets.play_store} alt="Get it on Google Play" />
        <img src={assets.app_store} alt="Download on the App Store" />
      </div>
    </div>
  )
}

export default Appdownload
