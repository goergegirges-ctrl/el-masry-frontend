import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom"
import axiosClient from '../../utils/axiosClient'

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
      let response = await axiosClient.post("/api/order/create", orderData);
      if (response.data.success) {
        toast.success("تم تقديم الطلب بنجاح! / Order placed successfully!");
        setCartItems({});
        navigate("/");
      } else {
        toast.error(response.data.message || "حدث خطأ أثناء تقديم الطلب");
      }
    } catch (error) {
      console.error(error);
      toast.error("تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
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
              <label htmlFor="firstName">الاسم الأول / First Name *</label>
              <input id="firstName" required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' className={errors.firstName ? 'error-input' : ''} aria-describedby={errors.firstName ? 'firstName-error' : undefined} aria-invalid={!!errors.firstName} />
              {errors.firstName && <span id="firstName-error" className='error-msg' role="alert">{errors.firstName}</span>}
            </div>
            <div className="input-group">
              <label htmlFor="lastName">الاسم الأخير / Last Name</label>
              <input id="lastName" name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name (optional)' />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="email">البريد الإلكتروني / Email</label>
            <input id="email" name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address (optional)' />
          </div>
          <div className="input-group">
            <label htmlFor="phone">رقم الهاتف / Phone *</label>
            <input id="phone" required name='phone' onChange={onChangeHandler} value={data.phone} type="tel" inputMode="numeric" placeholder='01xxxxxxxxx' className={errors.phone ? 'error-input' : ''} aria-describedby={errors.phone ? 'phone-error' : 'phone-hint'} aria-invalid={!!errors.phone} />
            <span id="phone-hint" className='field-hint'>Egyptian mobile number (01x xxxx xxxx)</span>
            {errors.phone && <span id="phone-error" className='error-msg' role="alert">{errors.phone}</span>}
          </div>

          <p className="section-title">2. Delivery Address</p>
          <div className="input-group">
            <label htmlFor="city">المدينة / City *</label>
            <input id="city" required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='e.g. Cairo, Alexandria' className={errors.city ? 'error-input' : ''} aria-describedby={errors.city ? 'city-error' : undefined} aria-invalid={!!errors.city} />
            {errors.city && <span id="city-error" className='error-msg' role="alert">{errors.city}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="street">العنوان بالتفصيل / Full Address *</label>
            <input id="street" required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street, building, floor' className={errors.street ? 'error-input' : ''} aria-describedby={errors.street ? 'street-error' : undefined} aria-invalid={!!errors.street} />
            {errors.street && <span id="street-error" className='error-msg' role="alert">{errors.street}</span>}
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
