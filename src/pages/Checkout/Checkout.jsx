import React, { useContext, useState, useEffect } from 'react';
import './Checkout.css';
import { StoreContext } from '../../context/StoreContext';
import axiosClient from "../../utils/axiosClient";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useLanguage } from '../../context/LanguageContext';

const Checkout = () => {
    const { getTotalCartAmount, product_list, cartItems, url, token, userData, setCartItems } = useContext(StoreContext);
    const { t } = useLanguage();
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
            let response = await axiosClient.post("/api/order/create", orderData);
            if (response.data.success) {
                setCartItems({});
                toast.success(t('co_success'));
                navigate("/order-success", { state: { orderId: response.data.orderId } });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(t('co_serverError'));
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className='checkout-container'>
            <form onSubmit={onPlaceOrder} className='checkout-form'>
                <div className="checkout-left">
                    <h2>{t('co_shippingDetails')}</h2>
                    <div className="multi-fields">
                        <div className="field">
                            <label htmlFor="co-firstName">{t('co_firstName')}</label>
                            <input id="co-firstName" required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder={t('co_firstName')} />
                        </div>
                        <div className="field">
                            <label htmlFor="co-lastName">{t('co_lastName')}</label>
                            <input id="co-lastName" required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder={t('co_lastName')} />
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="co-email">{t('co_email')}</label>
                        <input id="co-email" required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder={t('co_email')} />
                    </div>
                    <div className="field">
                        <label htmlFor="co-phone">{t('co_phone')}</label>
                        <input id="co-phone" required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder={t('co_phone')} />
                    </div>
                    <div className="multi-fields">
                        <div className="field">
                            <label htmlFor="co-city">{t('co_city')}</label>
                            <input id="co-city" required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder={t('co_city')} />
                        </div>
                        <div className="field">
                            <label htmlFor="co-zip">{t('co_zip')}</label>
                            <input id="co-zip" name='zip' onChange={onChangeHandler} value={data.zip} type="text" placeholder={t('co_zip')} />
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="co-street">{t('co_street')}</label>
                        <input id="co-street" required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder={t('co_street')} />
                    </div>

                    <div className="payment-static">
                        <span className="payment-static-label">{t('co_paymentMethod')}:</span>
                        <span className="payment-static-value">{t('co_cod')}</span>
                    </div>
                </div>

                <div className="checkout-right">
                    <div className="cart-total">
                        <h2>{t('co_orderSummary')}</h2>
                        <div>
                            <div className="cart-total-details">
                                <p>{t('co_subtotal')}</p>
                                <p>{getTotalCartAmount()} ج.م</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <p>{t('co_delivery')}</p>
                                <p>50 ج.م</p>
                            </div>
                            <hr />
                            <div className="cart-total-details total-row">
                                <b>{t('co_total')}</b>
                                <b>{getTotalCartAmount() + 50} ج.م</b>
                            </div>
                        </div>
                        <button type='submit' className='place-order-btn' disabled={isProcessing}>
                            {isProcessing ? t('co_processing') : t('co_placeOrder')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
