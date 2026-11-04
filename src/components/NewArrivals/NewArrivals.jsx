import React, { useContext, useRef } from 'react';
import './NewArrivals.css';
import { StoreContext } from '../../context/StoreContext';
import ProductItem from '../productItem/productItem';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const NewArrivals = () => {
  const { product_list, storefrontSettings } = useContext(StoreContext);
  const { t, language } = useLanguage();
  const scrollRef = useRef(null);

  // Filter products with active NEW badge
  const newProducts = product_list.filter(p => p.isNew).sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  // Don't render if no NEW products
  if (newProducts.length === 0 && storefrontSettings.hide_empty_new_arrivals) return null;

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 320;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="new-arrivals-section" aria-label="وصل حديثاً">
      <div className="new-arrivals-header">
        <div className="new-arrivals-title-wrap">
          <Sparkles size={24} className="new-arrivals-icon" aria-hidden="true" />
          <h2 className="new-arrivals-title">{language === 'ar' ? 'وصل حديثاً' : 'New Arrivals'}</h2>
        </div>
      </div>

      <div className="new-arrivals-slider-wrapper">
        {!newProducts.length && <p>{language === 'ar' ? 'تابعنا لمعرفة أحدث المنتجات' : 'Check back for new arrivals'}</p>}
        <button className="na-scroll-btn left" onClick={() => scroll('left')} aria-label="السابق">
          <ChevronLeft size={22} aria-hidden="true" />
        </button>

        <div className="new-arrivals-grid" ref={scrollRef}>
          {newProducts.map(p => (
            <div className="new-arrivals-card-wrap" key={p.id}>
              <ProductItem
                id={p.id}
                name={p.name}
                price={p.price}
                description={p.description}
                images={p.images}
                stock={p.stock}
                condition={p.condition}
                isActive={p.isActive}
                brand={p.brand}
                category={p.category}
                effectivePrice={p.effectivePrice}
                hasOffer={p.hasOffer}
                discountPercent={p.discountPercent}
                isNew={p.isNew}
              />
            </div>
          ))}
        </div>

        <button className="na-scroll-btn right" onClick={() => scroll('right')} aria-label="التالي">
          <ChevronRight size={22} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

export default NewArrivals;
