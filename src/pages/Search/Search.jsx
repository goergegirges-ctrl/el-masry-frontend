import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import './Search.css';
import ProductItem from '../../components/productItem/productItem';
import { formatCategoryName } from '../../utils/seoHelpers';
import { useLanguage } from '../../context/LanguageContext';

const ITEMS_PER_PAGE = 40;

function getPageNumbers(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
    if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
}

const Search = () => {
    const { url } = useContext(StoreContext);
    const { t } = useLanguage();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('q') || "";
    const categoryQuery = queryParams.get('category') || "";

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filters, setFilters] = useState(() => ({
        minPrice: queryParams.get('minPrice') || "",
        maxPrice: queryParams.get('maxPrice') || "",
        sort: "newest"
    }));

    const fetchSearchResults = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/product/search`, {
                params: {
                    q: searchQuery,
                    category: categoryQuery,
                    ...filters
                }
            });
            if (response.data.success) {
                setResults(response.data.data);
            }
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSearchResults();
        setPage(1);
    }, [searchQuery, categoryQuery, filters.sort]);

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const applyPriceFilter = () => {
        fetchSearchResults();
        setPage(1);
    };

    const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
    const pagedResults = results.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    const hasPriceFilter = filters.minPrice !== "" || filters.maxPrice !== "";

    const renderPageNumbers = () =>
        getPageNumbers(page, totalPages).map((p, i) =>
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
        );

    return (
        <div className='search-page'>
            <Helmet>
                <title>{searchQuery ? `Search results for "${searchQuery}"` : "Browse Products"} | El-Masry</title>
            </Helmet>

            <div className={`search-sidebar${filtersOpen ? ' open' : ''}`}>
                <h3>{t('search_filters')}</h3>
                <div className="filter-group">
                    <label>{t('search_sortBy')}</label>
                    <div className="chip-group">
                        {[
                            { value: 'newest', label: t('search_newest') },
                            { value: 'price-low', label: t('search_priceLow') },
                            { value: 'price-high', label: t('search_priceHigh') },
                        ].map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                className={`chip${filters.sort === opt.value ? ' active' : ''}`}
                                onClick={() => setFilters(prev => ({ ...prev, sort: opt.value }))}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="filter-group">
                    <label>
                        {t('search_priceRange')}
                        {hasPriceFilter && <span className="filter-active-dot" />}
                    </label>
                    <div className="price-inputs">
                        <input name="minPrice" type="number" placeholder={t('search_min')} value={filters.minPrice} onChange={handleFilterChange} />
                        <input name="maxPrice" type="number" placeholder={t('search_max')} value={filters.maxPrice} onChange={handleFilterChange} />
                    </div>
                    <button onClick={applyPriceFilter} className="apply-btn">{t('search_applyPrice')}</button>
                </div>
            </div>

            <div className="search-main">
                <button
                    className="filter-toggle-btn"
                    onClick={() => setFiltersOpen(v => !v)}
                >
                    {filtersOpen ? t('search_hideFilters') : t('search_showFilters')}
                    {hasPriceFilter && !filtersOpen && <span className="filter-active-dot" />}
                </button>

                <div className="results-header">
                    <h2>{searchQuery ? `${t('search_resultsFor')} "${searchQuery}"` : t('search_allProducts')}</h2>
                    <span>{results.length} {t('search_productsFound')}</span>
                </div>

                {loading ? (
                    <div className="loading">{t('search_loading')}</div>
                ) : (
                    <>
                        <div className="results-grid">
                            {pagedResults.length > 0 ? (
                                pagedResults.map(item => (
                                    <ProductItem
                                        key={item.id}
                                        id={item.id}
                                        name={item.name}
                                        price={item.price}
                                        brand={item.brand}
                                        images={item.images}
                                        category={item.category}
                                        description={item.description}
                                        stock={item.stock}
                                        condition={item.condition}
                                    />
                                ))
                            ) : (
                                <div className="no-results">{t('search_noResults')}</div>
                            )}
                        </div>
                        {totalPages > 1 && (
                            <div className="pag-wrapper">
                                <div className="pag">
                                    <button disabled={page === 1} onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>‹</button>
                                    {renderPageNumbers()}
                                    <button disabled={page === totalPages} onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>›</button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Search;
