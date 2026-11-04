import React, { useContext, useState, useEffect } from 'react';
import './Checkout.css';
import { StoreContext } from '../../context/StoreContext';
import axiosClient from "../../utils/axiosClient";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useLanguage } from '../../context/LanguageContext';

const Checkout = () => {
    const { quoteReady, quoteError, cartQuote, refreshQuote, getTotalCartAmount, product_list, cartItems, url, token, userData, setCartItems } = useContext(StoreContext);
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
        if (!Object.values(cartItems).some(q => q > 0)) {
            navigate("/cart");
        }
    }, [cartItems]);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(data => ({ ...data, [name]: value }))
    };

    const onPlaceOrder = async (event) => {
        event.preventDefault();
        if (!quoteReady || quoteError) { refreshQuote(); toast.error('يرجى انتظار تحديث الأسعار / Wait for current prices'); return; }
        setIsProcessing(true);

        const orderItems = Object.entries(cartItems).filter(([,quantity]) => quantity > 0).map(([productId,quantity]) => ({ productId,quantity }));

        let orderData = {
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
                    {quoteError && <p role="alert">{quoteError} <button type="button" onClick={refreshQuote}>إعادة المحاولة / Retry</button></p>}
                    {!quoteReady && <p role="status">تحديث الأسعار / Updating prices…</p>}
                    <div className="cart-total">
                        <h2>{t('co_orderSummary')}</h2>
                        {cartQuote?.items.map(item => <div key={item.productId} className="cart-total-details"><span>{item.name} × {item.quantity}</span><span>{item.hasOffer && <del>{item.originalPrice} EGP </del>} {item.price} EGP</span></div>)}
                        <div>
                            <div className="cart-total-details">
                                <p>{t('co_subtotal')}</p>
                                <p>{getTotalCartAmount()} ج.م</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <p>{t('co_delivery')}</p>
                                <p>{cartQuote?.deliveryFee ?? 50} ج.م</p>
                            </div>
                            <hr />
                            <div className="cart-total-details total-row">
                                <b>{t('co_total')}</b>
                                <b>{getTotalCartAmount() + (cartQuote?.deliveryFee ?? 50)} ج.م</b>
                            </div>
                        </div>
                        <button type='submit' className='place-order-btn' disabled={isProcessing || !quoteReady || !!quoteError}>
                            {isProcessing ? t('co_processing') : t('co_placeOrder')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
