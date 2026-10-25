import React, { useState, useEffect } from 'react'
import "./Home.css";
import Header from '../../components/Header/Header'
import PromoBanner from '../../components/PromoBanner/PromoBanner'
import ExploreCategories from '../../components/ExploreCategories/ExploreCategories'
import ProductDisplay from '../../components/productDisplay/productDisplay'
import AppDownload from '../../components/AppDownload/Appdownload'
import HighlightedProduct from '../../components/HighlightedProduct/HighlightedProduct';
import SEO from '../../components/SEO/SEO';
import { Info, Truck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Home = ({ selectedProduct, setSelectedProduct }) => {
  const { t } = useLanguage();
  const [category, setCategory] = useState('All')

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "المصري للإلكترونيات",
    "alternateName": "El-Masry Electronics",
    "url": "https://elmasry-electronics.com/",
    "logo": "https://elmasry-electronics.com/logo.svg",
    "telephone": ["+201229424078", "+201031451015"],
    "sameAs": ["https://www.facebook.com/share/1DJTkEEifq/"]
  };

  // Scroll to a section if requested by mobile Categories nav
  useEffect(() => {
    const target = sessionStorage.getItem('scrollTo');
    if (target) {
      sessionStorage.removeItem('scrollTo');
      setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    }
  }, []);

  return (
    <div>
      <SEO
        title="المصري للإلكترونيات | قطع غيار شاشات، كوفات، ليدات وتيكونات في مصر"
        description="+664 قطعة غيار للشاشات والكاميرات: COF، LED، T-CON، بوردات. بحث بكود الموديل وتوصيل لحد الورشة."
        keywords="المصري إلكترونيكس, كوفات, ليدات, تيكونات, قطع غيار شاشات, مصر, المصري للإلكترونيات"
        url="https://elmasry-electronics.com/"
        jsonLd={organizationJsonLd}
      />
      {selectedProduct && <HighlightedProduct product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      
      {/* Homepage Announcement Notice Banner */}
      <div className="home-notice-banner">
        <div className="home-notice-inner">
          <Info className="home-notice-icon" size={20} strokeWidth={2} />
          <p className="home-notice-text">{t('home_noticeText')}</p>
        </div>
      </div>

      <Header />

      {/* Shipping & COD Trust Bar */}
      <div className="home-shipping-bar reveal-on-scroll">
        <div className="home-shipping-inner">
          <div className="home-shipping-icon-wrap">
            <Truck size={24} strokeWidth={2} />
          </div>
          <p className="home-shipping-text">{t('home_shippingMessage')}</p>
        </div>
      </div>

      <PromoBanner />
      <div className="reveal-on-scroll"><ExploreCategories category={category} setCategory={setCategory} /></div>
      <div className="reveal-on-scroll"><ProductDisplay category={category} /></div>
      <div className="reveal-on-scroll"><AppDownload /></div>
    </div>
  )
}

export default Home

