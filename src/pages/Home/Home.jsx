import React, { useState, useEffect } from 'react'
import "./Home.css";
import Header from '../../components/Header/Header'
import PromoBanner from '../../components/PromoBanner/PromoBanner'
import ExploreCategories from '../../components/ExploreCategories/ExploreCategories'
import ProductDisplay from '../../components/productDisplay/productDisplay'
import AppDownload from '../../components/AppDownload/Appdownload'
import HighlightedProduct from '../../components/HighlightedProduct/HighlightedProduct';

const Home = ({ selectedProduct, setSelectedProduct }) => {

  const [category, setCategory] = useState('All')

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
      {selectedProduct && <HighlightedProduct product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      <Header />
      <PromoBanner />
      <div className="reveal-on-scroll"><ExploreCategories category={category} setCategory={setCategory} /></div>
      <div className="reveal-on-scroll"><ProductDisplay category={category} /></div>
      <div className="reveal-on-scroll"><AppDownload /></div>
    </div>
  )
}

export default Home
