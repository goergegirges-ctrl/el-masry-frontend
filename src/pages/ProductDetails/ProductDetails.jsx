import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { category_list } from '../../assets/assets';
import logoMark from '@/assets/logo-mark.svg';
import './ProductDetails.css';
import Reviews from '../../components/Reviews/Reviews';
import ProductItem from '../../components/productItem/productItem';
import { Heart } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosClient from '../../utils/axiosClient';
import { Helmet } from 'react-helmet-async';
import { formatCategoryName } from '../../utils/seoHelpers';
import { useLanguage } from '../../context/LanguageContext';


const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { product_list, addToCart, cartItems, url, token, userData, setUserData, wishlist, toggleWishlist } = useContext(StoreContext);
    const { t } = useLanguage();

    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [activeThumb, setActiveThumb] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosClient.get('/api/product/list'); 
                if (response.data.success) {
                    const found = response.data.data.find(p => p.id === id);
                    if (found) {
                        setProduct(found);
                        const defaultImage = (found.images && found.images.length > 0)
                            ? found.images[0]
                            : logoMark;
                        setMainImage(defaultImage);
                    }
                }
            } catch (err) {
                console.error("Error fetching product:", err);
            }
        };

        if (product_list && product_list.length > 0) {
            const foundProduct = product_list.find(p => p.id === id);
            if (foundProduct) {
                setProduct(foundProduct);
                const defaultImage = (foundProduct.images && foundProduct.images.length > 0)
                    ? foundProduct.images[0]
                    : (foundProduct.image ? (foundProduct.image.startsWith('http') ? foundProduct.image : `${url}/images/${foundProduct.image}`) : assets.logo);
                setMainImage(defaultImage);
            } else {
                fetchProduct();
            }
        } else {
            fetchProduct();
        }
    }, [id, product_list, url]);

    const isWishlisted = wishlist.includes(id);

    const categorySlug = useMemo(() => {
        if (!product?.category) return 'other';
        const cat = category_list.find(c => c.category_name === product.category);
        return cat ? cat.category_slug : 'other';
    }, [product]);

    const recommendedProducts = useMemo(() => {
        if (!product?.category || !product_list?.length) return [];
        return product_list
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 6);
    }, [product, product_list]);

    const renderDescription = (desc) => {
        if (!desc) return <p>{t('pdp_noDesc')}</p>;

        const lines = desc.split('\n').filter(line => line.trim() !== '');
        const isStructured = lines.every(line => line.includes(':') || line.includes('|'));

        if (isStructured) {
            return (
                <table className="description-table">
                    <thead>
                        <tr>
                            <th>{t('pdp_specName')}</th>
                            <th>{t('pdp_specValue')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lines.map((line, index) => {
                            const [key, ...valueParts] = line.split(/[:|]/);
                            const value = valueParts.join(':').trim();
                            return (
                                <tr key={index}>
                                    <td>{key.trim()}</td>
                                    <td>{value}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            );
        }

        return <p>{desc}</p>;
    }



    if (!product) {
        return (
            <div className='product-details-loading'>
                <div className='skeleton-pulse' style={{ height: '400px', width: '100%', borderRadius: '20px' }}></div>
            </div>
        );
    }

    const handleThumbClick = (img, index) => {
        setMainImage(img);
        setActiveThumb(index);
    }

    return (
        <div className='product-details'>
            <Helmet>
                <title>{product.name} | El-Masry Electronics</title>
                <meta name="description" content={product.description?.slice(0, 160) || `Buy ${product.name} at the best price on El-Masry.`} />
            </Helmet>
            <div className='breadcrumb-wrapper'>
                <nav className='crumbs' aria-label="breadcrumb">
                    <Link to="/">{t('pdp_home')}</Link>
                    <span className="sep">/</span>
                    {product.category && (
                        <>
                            <Link to={`/category/${categorySlug}`}>{formatCategoryName(product.category)}</Link>
                            <span className="sep">/</span>
                        </>
                    )}
                    <span className="current">{product.name}</span>
                </nav>
                <button type="button" className='back-link' onClick={() => navigate(location.state?.from || `/category/${categorySlug}`)}>
                    ← {t('pdp_backTo')} {formatCategoryName(product.category) || ''}
                </button>
            </div>

            <div className='product-details-container'>
                {/* Left Side: Images */}
                <div className='product-images-section'>
                    <div className='main-image-container'>
                        <img src={mainImage} alt={product.name} />
                        <div className="tip-wrap wishlist-float-wrap">
                            <button className={`wishlist-float ${isWishlisted ? 'active' : ''}`} onClick={() => toggleWishlist(id)}>
                                <Heart size={24} fill={isWishlisted ? "var(--danger)" : "none"} stroke={isWishlisted ? "var(--danger)" : "currentColor"} />
                            </button>
                            <span className="tip">{isWishlisted ? t('pdp_removeWishlist') : t('pdp_addWishlist')}</span>
                        </div>
                    </div>

                    {product.images && product.images.length > 1 && (
                        <div className='thumbnail-slider'>
                            {product.images.map((img, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail ${activeThumb === index ? 'active' : ''}`}
                                    onClick={() => handleThumbClick(img, index)}
                                >
                                    <img src={img} alt={`${product.name} ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side: Details */}
                <div className='product-info-section'>
                    {product.stock > 0 ? (
                        <span className="details-stock-badge in-stock">{t('pdp_inStock')}</span>
                    ) : (
                        <span className="details-stock-badge out-of-stock">{t('pdp_outOfStock')}</span>
                    )}
                    <h1>{product.name}</h1>

                    <p className='price'>{product.price} ج.م</p>

                    <div className='product-actions'>
                        {product.stock > 0 ? (
                            <button
                                className='add-to-cart-big'
                                onClick={() => addToCart(id)}
                                disabled={cartItems?.[id] >= product.stock}
                            >
                                {cartItems?.[id] ? `${t('pdp_inCart')} (${cartItems[id]})` : t('pdp_addToCart')}
                            </button>
                        ) : (
                            <button className='add-to-cart-big disabled' disabled>{t('pdp_outOfStockBtn')}</button>
                        )}
                    </div>

                    <div className="tabs" role="tablist">
                        <button
                            className={`tab${activeTab === 'description' ? ' active' : ''}`}
                            onClick={() => setActiveTab('description')}
                            role="tab"
                        >
                            {t('pdp_description')}
                        </button>
                        <button
                            className={`tab${activeTab === 'details' ? ' active' : ''}`}
                            onClick={() => setActiveTab('details')}
                            role="tab"
                        >
                            {t('pdp_details')}
                        </button>
                    </div>

                    {activeTab === 'description' && (
                        <div className='description'>
                            {renderDescription(product.description)}
                        </div>
                    )}
                    {activeTab === 'details' && (
                        <div className='product-meta'>
                            <div className='meta-item'>
                                <b>{t('pdp_condition')}</b> <span>{product.condition || 'New'}</span>
                            </div>
                            <div className='meta-item'>
                                <b>{t('pdp_category')}</b> <span>{formatCategoryName(product.category)}</span>
                            </div>
                            <div className='meta-item'>
                                <b>{t('pdp_status')}</b> <span>{product.stock > 0 ? t('hp_inStock') : t('pi_outOfStock')}</span>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {recommendedProducts.length > 0 && (
                <div className="recommended-section">
                    <h2 className="recommended-title">{t('pdp_recommended')}</h2>
                    <div className="recommended-grid">
                        {recommendedProducts.map(p => (
                            <ProductItem
                                key={p.id}
                                id={p.id}
                                name={p.name}
                                price={p.price}
                                description={p.description}
                                images={p.images}
                                stock={p.stock}
                                condition={p.condition}
                                isActive={p.isActive}
                                brand={p.brand}
                                category={p.category}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="product-bottom-section">
                <Reviews productId={id} />
            </div>
        </div>
    );
};

export default ProductDetails;
