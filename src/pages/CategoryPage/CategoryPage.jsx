import React, { useContext, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { category_list } from '../../assets/assets';
import ProductItem from '../../components/productItem/productItem';
import './CategoryPage.css';
import { formatCategoryName } from '../../utils/seoHelpers';

const CategoryPage = () => {
    const { categorySlug } = useParams();
    const navigate = useNavigate();
    const { product_list, loading, url } = useContext(StoreContext);

    // Map slug back to Arabic name for filtering
    const currentCategory = useMemo(() => {
        return category_list.find(cat => cat.category_slug === categorySlug);
    }, [categorySlug]);

    const filteredProducts = useMemo(() => {
        if (!currentCategory) return [];
        return product_list.filter(item => item.category === currentCategory.category_name);
    }, [product_list, currentCategory]);

    if (loading) {
        return (
            <div className='category-page'>
                <div className="category-header skeleton-pulse"></div>
                <div className="product-display-list">
                    {Array(4).fill(0).map((_, i) => (
                        <div key={i} className="skeleton-card">
                            <div className="skeleton-image"></div>
                            <div className="skeleton-text"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // If no category selected, show all categories as choice
    if (!categorySlug) {
        return (
            <div className='category-page selection-view'>
                <div className="category-header">
                    <h1>Explore Categories</h1>
                    <p>Select a category to view products</p>
                </div>
                <div className="categories-grid-circular">
                    {category_list.map((item, index) => (
                        <div 
                            key={index} 
                            className="category-card-circular"
                            onClick={() => navigate(`/category/${item.category_slug}`)}
                        >
                            <div className="circle-img-wrapper">
                                <img src={item.category_image} alt={item.category_name} />
                            </div>
                            <p>{formatCategoryName(item.category_name)}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!currentCategory) {
        return <div className='category-page error-state'><h1>Category Not Found</h1></div>;
    }

    return (
        <div className='category-page'>
            <div className='breadcrumb-wrapper'>
                <div className='back-link' onClick={() => navigate('/')}>
                    ← Back to Home
                </div>
            </div>
            <div className="category-header">
                <h1>{formatCategoryName(currentCategory.category_name)}</h1>
                <p>{filteredProducts.length} Products Found</p>
            </div>

            <div className="product-display-list">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((item, index) => (
                        <ProductItem
                            key={index}
                            id={item.id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            images={item.images}
                            stock={item.stock}
                            condition={item.condition}
                            category={item.category}
                        />
                    ))
                ) : (
                    <div className="no-products-found">
                        <p>No products available in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
