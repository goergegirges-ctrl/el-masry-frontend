import React, { useContext, useState, useMemo } from 'react'
import './productDisplay.css'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import ProductItem from '../productItem/productItem'
import { useLanguage } from '../../context/LanguageContext'

const HOMEPAGE_LIMIT = 50;

const ProductDisplay = ({ category }) => {
  const { product_list, search, showSearch, loading } = useContext(StoreContext);
  const { t } = useLanguage();
  const [sortOption, setSortOption] = useState('relevant');

  const isHomepage = category === 'All' && !showSearch;

  const normalizeCategory = (cat) => cat ? cat.replace(/^ال/, '') : '';

  const processedProducts = useMemo(() => {
    let products = [...product_list];

    // On homepage, show only featured products (mixed from all categories)
    if (isHomepage) {
      products = products.filter(item => item.isFeatured);
    } else {
      // Category filter
      if (category !== 'All') {
        products = products.filter(item =>
          normalizeCategory(category) === normalizeCategory(item.category)
        );
      }
      // Search filter
      if (showSearch && search.trim()) {
        products = products.filter(item =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
      }
    }

    // Sort
    if (sortOption === 'low-high') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'high-low') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'newest') {
      products.reverse();
    }

    // Cap homepage at 50
    if (isHomepage) {
      products = products.slice(0, HOMEPAGE_LIMIT);
    }

    return products;
  }, [product_list, category, search, showSearch, sortOption, isHomepage]);

  return (
    <div className="product-display" id="products-section">
      <div className="product-display-header">
        <h2>
          {showSearch && search
            ? `${t('pd_searchResultsFor')} "${search}"`
            : t('pd_topProducts')}
        </h2>
        <div className="product-sort">
          <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
            <option value="relevant">{t('pd_sortRelevant')}</option>
            <option value="low-high">{t('pd_sortPriceLow')}</option>
            <option value="high-low">{t('pd_sortPriceHigh')}</option>
            <option value="newest">{t('pd_sortNewest')}</option>
          </select>
        </div>
      </div>

      <div className="product-display-list">
        {loading ? (
          Array(8).fill(0).map((_, index) => (
            <div key={index} className="skeleton-card">
              <div className="skeleton-image"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text short"></div>
            </div>
          ))
        ) : processedProducts.length > 0 ? (
          processedProducts.map((item) => (
            <ProductItem
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              images={item.images}
              stock={item.stock}
              condition={item.condition}
              isActive={item.isActive}
              category={item.category}
            />
          ))
        ) : (
          <div className="no-products-found">
            <p>{isHomepage ? t('pd_noFeatured') : t('pd_noProducts')}</p>
          </div>
        )}
      </div>

      {isHomepage && processedProducts.length > 0 && (
        <div className="view-all-wrapper">
          <Link to="/search" className="view-all-btn">
            {t('pd_viewAll')}
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductDisplay;
