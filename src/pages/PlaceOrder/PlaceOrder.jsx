import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"
import { useNavigate } from "react-router-dom"

const PlaceOrder = () => {

  const { getTotalCartAmount, product_list, cartItems, url, setCartItems } = useContext(StoreContext);
  const [isProcessing, setIsProcessing] = useState(false);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    phone: ""
  })

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!data.firstName) tempErrors.firstName = "Required";
    if (!data.phone) tempErrors.phone = "Required";
    else if (!/^01[0125][0-9]{8}$/.test(data.phone)) tempErrors.phone = "Invalid Egyptian Phone Number";
    if (!data.city) tempErrors.city = "Required";
    if (!data.street) tempErrors.street = "Required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(data => ({ ...data, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }

  const navigate = useNavigate();

  const placeOrder = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsProcessing(true);
    let orderItems = [];
    product_list.map((item) => {
      if (cartItems[item.id] > 0) {
        let itemInfo = { ...item };
        itemInfo["quantity"] = cartItems[item.id];
        itemInfo["productId"] = item.id;
        orderItems.push(itemInfo);
      }
    })

    let orderData = {
      customer: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        address: data.street,
        city: data.city,
        phone: data.phone
      },
      items: orderItems,
      subtotal: getTotalCartAmount(),
    }

    try {
      let response = await axios.post(url + "/api/order/create", orderData);
      if (response.data.success) {
        alert("Order Placed Successfully!");
        setCartItems({}); // Clear cart
        navigate("/"); // Redirect to home
      }
      else {
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Error connecting to server");
    } finally {
      setIsProcessing(false);
    }
  }

  const isFormValid = data.firstName && data.phone && data.city && data.street && !errors.phone;

  return (
    <div className='checkout-container'>
      <h2 className="page-title">Checkout</h2>
      <form onSubmit={placeOrder} className='place-order'>
        <div className="place-order-left">
          <p className="section-title">1. Customer Information</p>
          <div className="multi-fields">
            <div className="input-group">
              <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' className={errors.firstName ? 'error-input' : ''} />
              {errors.firstName && <span className='error-msg'>{errors.firstName}</span>}
            </div>
            <div className="input-group">
              <input name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name (Optional)' />
            </div>
          </div>
          <div className="input-group">
            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address (Optional)' />
          </div>
          <div className="input-group">
            <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone (01xxxxxxxxx)' className={errors.phone ? 'error-input' : ''} />
            {errors.phone && <span className='error-msg'>{errors.phone}</span>}
          </div>

          <p className="section-title">2. Delivery Address</p>
          <div className="input-group">
            <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' className={errors.city ? 'error-input' : ''} />
            {errors.city && <span className='error-msg'>{errors.city}</span>}
          </div>
          <div className="input-group">
            <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Full Address / Street' className={errors.street ? 'error-input' : ''} />
            {errors.street && <span className='error-msg'>{errors.street}</span>}
          </div>
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <p className="section-title">3. Order Summary</p>
            <div className='summary-items'>
              {product_list.map((item, index) => {
                if (cartItems[item.id] > 0) {
                  return (
                    <div key={index} className='summary-item'>
                      <span>{item.name} x {cartItems[item.id]}</span>
                      <span>{item.price * cartItems[item.id]} ج.م</span>
                    </div>
                  )
                }
                return null;
              })}
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()} ج.م</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p className='note'>To be determined</p>
            </div>
            <hr />
            <div className="cart-total-details total-row">
              <b>Total</b>
              <b>{getTotalCartAmount()} ج.م</b>
            </div>
            <button
              type='submit'
              className='submit-btn'
              disabled={!isFormValid || isProcessing}
            >
              {isProcessing ? "PLACING ORDER..." : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PlaceOrder
