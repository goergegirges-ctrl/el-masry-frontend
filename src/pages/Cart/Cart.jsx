import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { ShoppingBag } from 'lucide-react';

const Cart = () => {

  const { cartItems, product_list, addToCart, removeFromCart, deleteFromCart, getTotalCartAmount, url } = useContext(StoreContext);

  const navigate = useNavigate();

  return (
    <div className='cart'>
      <div className="cart-content">
        <div className="cart-items">
          <h2 className='cart-title'>Your Shopping Cart</h2>
          {product_list.some(item => cartItems[item.id] > 0) ? (
            product_list.map((item, index) => {
              if (cartItems[item.id] > 0) {
                return (
                  <div key={index} className='cart-item-card'>
                    <div className="cart-item-info">
                      <img src={(item.images && item.images.length > 0) ? item.images[0] : assets.logo} alt={item.name} />
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
                      <button onClick={() => deleteFromCart(item.id)} className='remove-btn'>Remove</button>
                    </div>
                  </div>
                )
              }
              return null;
            })
          ) : (
            <div className="empty">
              <div className="ring"><ShoppingBag size={28} strokeWidth={1.75} /></div>
              <h4>Your cart is empty</h4>
              <p>Add some products to get started</p>
              <button className="btn btn-primary md" onClick={() => navigate('/')}>Continue Shopping</button>
            </div>
          )}
        </div>

        <div className="cart-summary-container">
          <div className="cart-total">
            <h3>Order Summary</h3>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()} ج.م</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p className='delivery-note'>Determined after confirmation</p>
            </div>
            <hr />
            <div className="cart-total-details total-row">
              <b>Total</b>
              <b>{getTotalCartAmount()} ج.م</b>
            </div>
            <button
              className='checkout-btn'
              onClick={() => navigate('/order')}
              disabled={getTotalCartAmount() === 0}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
