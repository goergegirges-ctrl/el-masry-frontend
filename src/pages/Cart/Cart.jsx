import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';
import logoMark from '@/assets/logo-mark.svg';
import { ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Cart = () => {

  const { cartItems, product_list, addToCart, removeFromCart, deleteFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className='cart'>
      <div className="cart-content">
        <div className="cart-items">
          <h2 className='cart-title'>{t('cart_title')}</h2>
          {product_list.some(item => cartItems[item.id] > 0) ? (
            product_list.map((item, index) => {
              if (cartItems[item.id] > 0) {
                return (
                  <div key={index} className='cart-item-card'>
                    <div className="cart-item-info">
                      <img src={(item.images && item.images.length > 0) ? item.images[0] : logoMark} alt={item.name} />
                      <div className='cart-item-details'>
                        <p className='item-name'>{item.name}</p>
                        <p className='item-price'>{item.price} ج.م</p>
                      </div>
                    </div>
                    <div className='cart-item-actions'>
                      <div className='quantity-controls'>
                        <button onClick={() => removeFromCart(item.id)} disabled={cartItems[item.id] <= 1}>−</button>
                        <span>{cartItems[item.id]}</span>
                        <button onClick={() => addToCart(item.id)}>+</button>
                      </div>
                      <p className='item-total'>{item.price * cartItems[item.id]} ج.م</p>
                      <button onClick={() => deleteFromCart(item.id)} className='remove-btn'>{t('cart_remove')}</button>
                    </div>
                  </div>
                )
              }
              return null;
            })
          ) : (
            <div className="empty">
              <div className="ring"><ShoppingBag size={28} strokeWidth={1.75} /></div>
              <h4>{t('cart_empty')}</h4>
              <p>{t('cart_emptyMsg')}</p>
              <button className="btn btn-primary md" onClick={() => navigate('/')}>{t('cart_continue')}</button>
            </div>
          )}
        </div>

        <div className="cart-summary-container">
          <div className="cart-total">
            <h3>{t('cart_summary')}</h3>
            <div className="cart-total-details">
              <p>{t('cart_subtotal')}</p>
              <p>{getTotalCartAmount()} ج.م</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>{t('cart_delivery')}</p>
              <p className='delivery-note'>{t('cart_deliveryTbd')}</p>
            </div>
            <hr />
            <div className="cart-total-details total-row">
              <b>{t('cart_total')}</b>
              <b>{getTotalCartAmount()} ج.م</b>
            </div>
            <button
              className='checkout-btn'
              onClick={() => navigate('/order')}
              disabled={getTotalCartAmount() === 0}
            >
              {t('cart_checkout')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
