import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './productItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import LazyImage from '../Common/LazyImage'
import { Heart } from 'lucide-react'
import { formatCategoryName } from '../../utils/seoHelpers'

const ProductItem = ({ id, name, price, description, images, stock, condition, isActive, brand, category }) => {

  const { cartItems, addToCart, removeFromCart, url, wishlist, toggleWishlist } = useContext(StoreContext)
  const isWishlisted = wishlist.includes(id);
  const navigate = useNavigate();

  const isOutOfStock = stock <= 0;

  const productImageUrl = (images && images.length > 0)
    ? images[0]
    : assets.logo;

  return (
    <div className='product-item' onClick={() => navigate(`/product/${id}`, { state: { from: window.location.pathname } })}>
      <div className="product-item-img-container">

        {isOutOfStock && (
          <span className="badge out-of-stock">Out of Stock</span>
        )}

        <div className="wishlist-btn-container" onClick={(e) => { e.stopPropagation(); toggleWishlist(id); }}>
          <Heart size={20} fill={isWishlisted ? "#ff4c24" : "none"} stroke={isWishlisted ? "#ff4c24" : "#888"} />
        </div>

        <LazyImage
          src={productImageUrl}
          alt={`${formatCategoryName(category)} من المصري إلكترونك`}
          className='product-item-image'
        />

        {!isOutOfStock && (
          !cartItems[id]
            ? <div className='add-btn-container' onClick={(e) => { e.stopPropagation(); addToCart(id); }}>
              <span className='add-icon-plus'>+</span>
            </div>
            : <div className='product-item-counter' onClick={(e) => e.stopPropagation()}>
              <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="Remove" />
              <p>{cartItems[id]}</p>
              <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="Add" />
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
            {isOutOfStock ? "Out of Stock" : "In Stock"}
          </p>
          {condition && <span className="item-condition">{condition}</span>}
        </div>
      </div>
    </div>
  )
}

export default ProductItem
