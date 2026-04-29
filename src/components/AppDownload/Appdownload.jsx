import React from 'react'
import './Appdownload.css'
import { assets } from '../../assets/assets'
import { useLanguage } from '../../context/LanguageContext'

const Appdownload = () => {
  const { t } = useLanguage();
  return (
    <div className='app-download' id='app-download'>
      <p>{t('app_soon')} <br />{t('app_name')}</p>
      <div className="app-download-platforms">
        <img src={assets.play_store} alt="Get it on Google Play" />
        <img src={assets.app_store} alt="Download on the App Store" />
      </div>
    </div>
  )
}

export default Appdownload
