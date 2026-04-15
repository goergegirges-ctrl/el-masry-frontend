import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { assets, category_list } from '../../assets/assets';
import './ProductDetails.css';
import Reviews from '../../components/Reviews/Reviews';
import { Heart } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { formatCategoryName } from '../../utils/seoHelpers';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { product_list, addToCart, cartItems, url, token, userData, setUserData, wishlist, toggleWishlist } = useContext(StoreContext);

    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [activeThumb, setActiveThumb] = useState(0);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${url}/api/product/list`); 
                if (response.data.success) {
                    const found = response.data.data.find(p => p.id === id);
                    if (found) {
                        setProduct(found);
                        const defaultImage = (found.images && found.images.length > 0)
                            ? found.images[0]
                            : assets.logo;
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

    const renderDescription = (desc) => {
        if (!desc) return <p>No description available for this product.</p>;

        const lines = desc.split('\n').filter(line => line.trim() !== '');
        const isStructured = lines.every(line => line.includes(':') || line.includes('|'));

        if (isStructured) {
            return (
                <table className="description-table">
                    <thead>
                        <tr>
                            <th>المواصفة</th>
                            <th>القيمة</th>
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
                <div className='breadcrumb-custom'>
                    <Link to="/">Home</Link>
                    <span className="separator">/</span>
                    {product.category && (
                        <>
                            <Link to={`/category/${categorySlug}`}>{formatCategoryName(product.category)}</Link>
                            <span className="separator">/</span>
                        </>
                    )}
                    <span className="current">{product.name}</span>
                </div>
                <div className='back-link' onClick={() => navigate(location.state?.from || `/category/${categorySlug}`)}>
                    ← Back to {formatCategoryName(product.category) || 'Category'}
                </div>
            </div>

            <div className='product-details-container'>
                {/* Left Side: Images */}
                <div className='product-images-section'>
                    <div className='main-image-container'>
                        <img src={mainImage} alt={product.name} />
                        <button className={`wishlist-float ${isWishlisted ? 'active' : ''}`} onClick={() => toggleWishlist(id)}>
                            <Heart size={24} fill={isWishlisted ? "#ff4c24" : "none"} stroke={isWishlisted ? "#ff4c24" : "currentColor"} />
                        </button>
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
                        <span style={{
                            padding: "6px 16px",
                            borderRadius: "20px",
                            background: "#D1FAE5",
                            color: "#065F46",
                            fontWeight: "600",
                            fontSize: "14px",
                            display: "inline-block",
                            marginBottom: "10px"
                        }}>✓ In Stock</span>
                    ) : (
                        <span style={{
                            padding: "6px 16px",
                            borderRadius: "20px",
                            background: "#FEE2E2",
                            color: "#991B1B",
                            fontWeight: "600",
                            fontSize: "14px",
                            display: "inline-block",
                            marginBottom: "10px"
                        }}>✗ Out of Stock</span>
                    )}
                    <h1>{product.name}</h1>
                    <div className="mpn-sku">
                        <span>MPN: <strong>{product.partNumber || 'N/A'}</strong></span>
                        <span className="dot">•</span>
                        <span>SKU: <strong>{product.sku || product.id.slice(-8)}</strong></span>
                    </div>

                    <p className='price'>{product.price} ج.م</p>

                    <div className='description'>
                        <h3>Description</h3>
                        {renderDescription(product.description)}
                    </div>

                    <div className='product-actions'>
                        {product.stock > 0 ? (
                            <button
                                className='add-to-cart-big'
                                onClick={() => addToCart(id)}
                                disabled={cartItems?.[id] >= product.stock}
                            >
                                {cartItems?.[id] ? `In Cart (${cartItems[id]})` : 'Add to Cart'}
                            </button>
                        ) : (
                            <button className='add-to-cart-big disabled' disabled>Out of Stock</button>
                        )}
                    </div>

                    <div className='product-meta'>
                        <div className='meta-item'>
                            <b>Condition:</b> <span>{product.condition || 'New'}</span>
                        </div>
                        <div className='meta-item'>
                            <b>Category:</b> <span>{formatCategoryName(product.category)}</span>
                        </div>
                        <div className='meta-item'>
                            <b>Status:</b> <span>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                        </div>
                    </div>

                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                        <div className='specifications'>
                            <h3>Technical Specifications</h3>
                            <div className="specs-grid">
                                {Object.entries(product.specifications).map(([key, val]) => (
                                    <div key={key} className="spec-row">
                                        <label>{key}</label>
                                        <span>{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="product-bottom-section">
                <Reviews productId={id} />
            </div>
        </div>
    );
};

export default ProductDetails;
