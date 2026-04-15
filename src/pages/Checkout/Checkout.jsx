import React, { useContext, useState, useEffect } from 'react';
import './Checkout.css';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const Checkout = () => {
    const { getTotalCartAmount, product_list, cartItems, url, token, userData, setCartItems } = useContext(StoreContext);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const [data, setData] = useState({
        firstName: userData?.firstName || "",
        lastName: userData?.lastName || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
        street: "",
        city: "",
        zip: "",
        paymentMethod: "Cash on Delivery"
    });

    useEffect(() => {
        if (getTotalCartAmount() === 0) {
            navigate("/cart");
        }
    }, [cartItems]);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(data => ({ ...data, [name]: value }))
    };

    const onPlaceOrder = async (event) => {
        event.preventDefault();
        setIsProcessing(true);

        let orderItems = [];
        product_list.forEach((item) => {
            if (cartItems[item.id] > 0) {
                let itemInfo = { ...item };
                itemInfo["quantity"] = cartItems[item.id];
                itemInfo["productId"] = item.id;
                orderItems.push(itemInfo);
            }
        });

        let orderData = {
            userId: token ? userData?.id : null,
            customer: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone
            },
            shippingAddress: {
                street: data.street,
                city: data.city,
                zip: data.zip
            },
            items: orderItems,
            subtotal: getTotalCartAmount(),
            deliveryFee: 50, // Static for example
            paymentMethod: data.paymentMethod
        };

        try {
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            let response = await axios.post(url + "/api/order/create", orderData, config);
            if (response.data.success) {
                setCartItems({});
                toast.success("Order Placed Successfully!");
                navigate("/order-success", { state: { orderId: response.data.orderId } });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error connecting to server");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className='checkout-container'>
            <form onSubmit={onPlaceOrder} className='checkout-form'>
                <div className="checkout-left">
                    <h2>Shipping Details</h2>
                    <div className="multi-fields">
                        <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
                        <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
                    </div>
                    <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email Address' />
                    <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone Number' />
                    <div className="multi-fields">
                        <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
                        <input name='zip' onChange={onChangeHandler} value={data.zip} type="text" placeholder='Zip code (Optional)' />
                    </div>
                    <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street / Apartment / Floor' />

                    <h2 className="payment-title">Payment Method</h2>
                    <div className="payment-options">
                        <div className="payment-option">
                            <input type="radio" id="cod" name="paymentMethod" value="Cash on Delivery" checked={data.paymentMethod === "Cash on Delivery"} onChange={onChangeHandler} />
                            <label htmlFor="cod">Cash on Delivery</label>
                        </div>
                        <div className="payment-option disabled">
                            <input type="radio" id="card" name="paymentMethod" value="Credit Card" disabled />
                            <label htmlFor="card">Credit Card (Coming Soon)</label>
                        </div>
                    </div>
                </div>

                <div className="checkout-right">
                    <div className="cart-total">
                        <h2>Order Summary</h2>
                        <div>
                            <div className="cart-total-details">
                                <p>Subtotal</p>
                                <p>{getTotalCartAmount()} ج.م</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <p>Delivery Fee</p>
                                <p>50 ج.م</p>
                            </div>
                            <hr />
                            <div className="cart-total-details total-row">
                                <b>Total</b>
                                <b>{getTotalCartAmount() + 50} ج.م</b>
                            </div>
                        </div>
                        <button type='submit' className='place-order-btn' disabled={isProcessing}>
                            {isProcessing ? "PROCESSING..." : "PLACE ORDER"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
