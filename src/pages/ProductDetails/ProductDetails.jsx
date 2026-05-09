import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { category_list } from '../../assets/assets';
import logoMark from '@/assets/logo-mark.svg';
import './ProductDetails.css';
import Reviews from '../../components/Reviews/Reviews';
import ProductItem from '../../components/productItem/productItem';
import { Heart } from 'lucide-react';
import axiosClient from '../../utils/axiosClient';
import SEO from '../../components/SEO/SEO';
import { formatCategoryName } from '../../utils/seoHelpers';
import { useLanguage } from '../../context/LanguageContext';


const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { product_list, addToCart, cartItems, wishlist, toggleWishlist } = useContext(StoreContext);
    const { t } = useLanguage();

    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [activeThumb, setActiveThumb] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosClient.get(`/api/product/${id}`);
                if (response.data.success && response.data.data) {
                    const found = response.data.data;
                    setProduct(found);
                    setMainImage(found.images?.[0] ?? logoMark);
                } else {
                    setNotFound(true);
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        if (product_list && product_list.length > 0) {
            const foundProduct = product_list.find(p => p.id === id);
            if (foundProduct) {
                setProduct(foundProduct);
                setMainImage(foundProduct.images?.[0] ?? logoMark);
                setLoading(false);
            } else {
                fetchProduct();
            }
        } else {
            fetchProduct();
        }
    }, [id, product_list]);

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
    };

    if (loading) {
        return <div className="page-spinner" />;
    }

    if (notFound || !product) {
        return (
            <div className="pdp-not-found">
                <p>{t('pdp_noDesc')}</p>
                <Link to="/">← {t('pdp_home')}</Link>
            </div>
        );
    }

    const handleThumbClick = (img, index) => {
        setMainImage(img);
        setActiveThumb(index);
    };

    return (
        <div className='product-details'>
            <SEO 
                title={`${product.name} | المصري إلكترونيكس`}
                description={`اشتري ${product.name} بأفضل سعر في مصر من المصري إلكترونيكس. ${product.mpn || product.sku || ''}`}
                url={`https://elmasry-electronics.com/product/${id}`}
                image={mainImage}
            />
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
                    <div className='main-image-container'>
                        <img src={mainImage} alt={product.name} />
                        <div className="tip-wrap wishlist-float-wrap">
                            <button className={`wishlist-float ${isWishlisted ? 'active' : ''}`} onClick={() => toggleWishlist(id)}>
                                <Heart size={22} fill={isWishlisted ? 'var(--danger)' : 'none'} stroke={isWishlisted ? 'var(--danger)' : 'currentColor'} />
                            </button>
                            <span className="tip">{isWishlisted ? t('pdp_removeWishlist') : t('pdp_addWishlist')}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Details */}
                <div className='product-info-section'>
                    {product.brand && <p className="p-brand">{product.brand}</p>}
                    <h1>{product.name}</h1>
                    <div className="pdp-meta-row">
                        {product.stock > 0 ? (
                            <span className="details-stock-badge in-stock">{t('pdp_inStock')}</span>
                        ) : (
                            <span className="details-stock-badge out-of-stock">{t('pdp_outOfStock')}</span>
                        )}
                        {product.condition && (
                            <span className="pdp-condition-badge">{product.condition}</span>
                        )}
                    </div>

                    <p className='price'>{product.price} <span className="price-currency">ج.م</span></p>

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
                            <button className='add-to-cart-big' disabled>{t('pdp_outOfStockBtn')}</button>
                        )}
                    </div>

                    <div className="pdp-tabs" role="tablist">
                        <button
                            className={`pdp-tab${activeTab === 'description' ? ' active' : ''}`}
                            onClick={() => setActiveTab('description')}
                            role="tab"
                        >
                            {t('pdp_description')}
                        </button>
                        <button
                            className={`pdp-tab${activeTab === 'details' ? ' active' : ''}`}
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
                                <span className="meta-label">{t('pdp_condition')}</span>
                                <span className="meta-value">{product.condition || 'New'}</span>
                            </div>
                            <div className='meta-item'>
                                <span className="meta-label">{t('pdp_category')}</span>
                                <span className="meta-value">{formatCategoryName(product.category)}</span>
                            </div>
                            <div className='meta-item'>
                                <span className="meta-label">{t('pdp_status')}</span>
                                <span className="meta-value">{product.stock > 0 ? t('hp_inStock') : t('pi_outOfStock')}</span>
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
