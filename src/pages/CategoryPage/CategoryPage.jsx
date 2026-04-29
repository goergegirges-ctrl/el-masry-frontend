import React, { useContext, useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import { category_list } from '../../assets/assets';
import ProductItem from '../../components/productItem/productItem';
import './CategoryPage.css';
import { formatCategoryName } from '../../utils/seoHelpers';
import { useLanguage } from '../../context/LanguageContext';

const ITEMS_PER_PAGE = 40;

function getPageNumbers(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
    if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
}

const CategoryPage = () => {
    const { categorySlug } = useParams();
    const navigate = useNavigate();
    const { product_list, loading, url } = useContext(StoreContext);
    const { t } = useLanguage();
    const [page, setPage] = useState(1);

    // Map slug back to Arabic name for filtering
    const currentCategory = useMemo(() => {
        return category_list.find(cat => cat.category_slug === categorySlug);
    }, [categorySlug]);

    const filteredProducts = useMemo(() => {
        if (!currentCategory) return [];
        return product_list.filter(item => item.category === currentCategory.category_name);
    }, [product_list, currentCategory]);

    const pageCount = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const pagedProducts = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProducts, page]);

    useEffect(() => { setPage(1); }, [categorySlug]);

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
                    <h1>{t('cat_title')}</h1>
                    <p>{t('cat_subtitle')}</p>
                </div>
                <div className="categories-grid-circular">
                    {category_list.map((item) => (
                        <div
                            key={item.category_slug}
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
        return <div className='category-page error-state'><h1>{t('cat_notFound')}</h1></div>;
    }

    return (
        <div className='category-page'>
            <div className='breadcrumb-wrapper'>
                <div className='back-link' onClick={() => navigate('/')}>
                    <ChevronLeft size={16} aria-hidden="true" />{t('cat_backHome')}
                </div>
            </div>
            <div className="category-header">
                <h1>{formatCategoryName(currentCategory.category_name)}</h1>
                <p>{filteredProducts.length} {t('cat_productsFound')}</p>
            </div>

            <div className="product-display-list">
                {pagedProducts.length > 0 ? (
                    pagedProducts.map((item) => (
                        <ProductItem
                            key={item.id}
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
                        <p>{t('cat_noProducts')}</p>
                    </div>
                )}
            </div>

            {pageCount > 1 && (
                <div className="pag-wrapper">
                    <div className="pag">
                        <button disabled={page === 1} onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>‹</button>
                        {getPageNumbers(page, pageCount).map((p, i) =>
                            p === '...' ? (
                                <span key={`ell-${i}`} className="ellipsis">…</span>
                            ) : (
                                <button
                                    key={p}
                                    className={page === p ? 'active' : ''}
                                    onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                >
                                    {p}
                                </button>
                            )
                        )}
                        <button disabled={page === pageCount} onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>›</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
