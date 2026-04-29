import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './productItem.css'
import { assets } from '../../assets/assets'
import logoMark from '@/assets/logo-mark.svg'
import { StoreContext } from '../../context/StoreContext'
import LazyImage from '../Common/LazyImage'
import { Heart } from 'lucide-react'
import { formatCategoryName } from '../../utils/seoHelpers'
import { useLanguage } from '../../context/LanguageContext'

const ProductItem = React.memo(({ id, name, price, description, images, stock, condition, isActive, brand, category }) => {

  const { cartItems, addToCart, removeFromCart, url, wishlist, toggleWishlist } = useContext(StoreContext)
  const { t } = useLanguage();
  const isWishlisted = wishlist.includes(id);
  const navigate = useNavigate();

  const isOutOfStock = stock <= 0;

  const productImageUrl = (images && images.length > 0)
    ? images[0]
    : logoMark;

  const handleCardKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(`/product/${id}`, { state: { from: window.location.pathname } });
    }
  };

  return (
    <div
      className='product-item'
      onClick={() => navigate(`/product/${id}`, { state: { from: window.location.pathname } })}
      role="link"
      tabIndex={0}
      onKeyDown={handleCardKeyDown}
      aria-label={name}
    >
      <div className="product-item-img-container">

        {isOutOfStock && (
          <span className="badge out-of-stock">{t('pi_outOfStock')}</span>
        )}

        <button
          type="button"
          className="wishlist-btn-container"
          onClick={(e) => { e.stopPropagation(); toggleWishlist(id); }}
          aria-label={isWishlisted ? `${t('pi_removeFromWishlist')} ${name}` : `${t('pi_addToWishlist')} ${name}`}
          aria-pressed={isWishlisted}
        >
          <Heart size={20} fill={isWishlisted ? "#ff4c24" : "none"} stroke={isWishlisted ? "#ff4c24" : "#888"} aria-hidden="true" />
        </button>

        <LazyImage
          src={productImageUrl}
          alt={`${formatCategoryName(category)} من المصري إلكترونك`}
          className='product-item-image'
        />

        {!isOutOfStock && (
          !cartItems[id]
            ? <button
                type="button"
                className='add-btn-container'
                onClick={(e) => { e.stopPropagation(); addToCart(id); }}
                aria-label={`${t('pi_addToCart')} ${name}`}
              >
                <span className='add-icon-plus' aria-hidden="true">+</span>
              </button>
            : <div className='product-item-counter' onClick={(e) => e.stopPropagation()}>
                <button type="button" className="counter-btn" onClick={() => removeFromCart(id)} aria-label={`${t('pi_decreaseQty')} ${name}`}>
                  <img src={assets.remove_icon_red} alt="" aria-hidden="true" />
                </button>
                <p aria-live="polite">{cartItems[id]}</p>
                <button type="button" className="counter-btn" onClick={() => addToCart(id)} aria-label={`${t('pi_increaseQty')} ${name}`}>
                  <img src={assets.add_icon_green} alt="" aria-hidden="true" />
                </button>
              </div>
        )}
      </div>

      <div className="product-item-info">
        <div className="product-item-header">
          {category && <p className="product-category-label">{formatCategoryName(category)}</p>}
          {brand && <p className="product-brand">{brand}</p>}
          <p className="product-name">{name}</p>
        </div>
        <p className="product-item-description">{description}</p>
        <div className="product-item-footer">
          <p className="product-item-price">{price} ج.م</p>
          <p className={`stock-status-text ${isOutOfStock ? 'out' : 'in'}`}>
            {isOutOfStock ? t('pi_outOfStock') : t('pi_inStock')}
          </p>
          {condition && <span className="item-condition">{condition}</span>}
        </div>
      </div>
    </div>
  )
})

export default ProductItem
