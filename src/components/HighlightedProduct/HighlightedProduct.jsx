import React, { useContext, useState } from 'react';
import './HighlightedProduct.css';
import { StoreContext } from '../../context/StoreContext';
import { X, ShoppingCart, CheckCircle, AlertCircle, Minus, Plus, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const HighlightedProduct = ({ product, onClose }) => {
    const { url, addToCart, wishlist, toggleWishlist } = useContext(StoreContext);
    const { t } = useLanguage();
    const isWishlisted = wishlist.includes(product.id);
    const [quantity, setQuantity] = useState(1);

    if (!product) return null;

    const handleIncrease = () => {
        if (quantity < product.stock) {
            setQuantity(prev => prev + 1);
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    return (
        <div className="highlighted-product-container">
            <div
                className="highlighted-product-card"
                role="dialog"
                aria-modal="true"
                aria-labelledby="hp-product-title"
            >
                <button
                    type="button"
                    className="close-highlight-btn"
                    onClick={onClose}
                    aria-label="إغلاق / Close"
                >
                    <X size={24} aria-hidden="true" />
                </button>

                <div className="highlight-image-section">
                    <img src={`${url}/images/${product.image}`} alt={product.name} />
                </div>

                <div className="highlight-details-section">
                    <div className="highlight-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <h2 id="hp-product-title">{product.name}</h2>
                            <button 
                                className="highlight-wishlist-btn" 
                                onClick={() => toggleWishlist(product.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}
                            >
                                <Heart size={24} fill={isWishlisted ? "#ff4c24" : "none"} stroke={isWishlisted ? "#ff4c24" : "#888"} />
                            </button>
                        </div>
                        <div className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                            {product.stock > 0 ? (
                                <>
                                    <CheckCircle size={14} /> {t('hp_inStock')}
                                </>
                            ) : (
                                <>
                                    <AlertCircle size={14} /> {t('hp_outOfStock')}
                                </>
                            )}
                        </div>
                    </div>

                    <p className="highlight-description">{product.description}</p>

                    <div className="highlight-footer">
                        <div className="highlight-price">
                            <span className="currency">ج.م</span>
                            <span className="amount">{product.price}</span>
                        </div>

                        {product.stock > 0 && (
                            <div className="quantity-selector">
                                <button className="qty-btn" onClick={handleDecrease} disabled={quantity <= 1}>
                                    <Minus size={16} />
                                </button>
                                <span className="qty-number">{quantity}</span>
                                <button className="qty-btn" onClick={handleIncrease} disabled={quantity >= product.stock}>
                                    <Plus size={16} />
                                </button>
                            </div>
                        )}

                        <button
                            className="highlight-add-btn"
                            onClick={() => {
                                addToCart(product.id, quantity);
                                onClose();
                            }}
                            disabled={product.stock <= 0}
                        >
                            <ShoppingCart size={20} />
                            {quantity > 1 ? `${quantity} ${t('hp_itemsToCart')}` : t('hp_addToCart')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HighlightedProduct;
