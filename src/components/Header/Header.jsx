import React from 'react'
import './Header.css'
import { useLanguage } from '../../context/LanguageContext'

const Header = () => {
  const { t } = useLanguage();
  const scrollToProducts = () => {
    const section = document.getElementById('products-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className='header'>
      <div className="header-contents">
        <h1>El-Masry Electronics | المصري لقطع غيار الشاشات والكاميرات في مصر</h1>
        <p>{t('header_heroParagraph')}</p>
        <button onClick={scrollToProducts}>{t('header_cta')}</button>
      </div>
    </div>
  )
}

export default Header
