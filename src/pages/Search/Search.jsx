import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import './Search.css';
import ProductItem from '../../components/productItem/productItem';
import { formatCategoryName } from '../../utils/seoHelpers';

const Search = () => {
    const { url } = useContext(StoreContext);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('q') || "";
    const categoryQuery = queryParams.get('category') || "";

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 12;
    const [filters, setFilters] = useState({
        minPrice: "",
        maxPrice: "",
        sort: "newest"
    });

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
    }

    useEffect(() => {
        fetchSearchResults();
        setPage(1);
    }, [searchQuery, categoryQuery, filters.sort]);

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const applyPriceFilter = () => {
        fetchSearchResults();
    }

    return (
        <div className='search-page'>
            <Helmet>
                <title>{searchQuery ? `Search results for "${searchQuery}"` : "Browse Products"} | El-Masry</title>
            </Helmet>
            <div className="search-sidebar">
                <h3>Filters</h3>
                <div className="filter-group">
                    <label>Sort By</label>
                    <div className="chip-group">
                        {[
                            { value: 'newest', label: 'Newest' },
                            { value: 'price-low', label: 'Price ↑' },
                            { value: 'price-high', label: 'Price ↓' },
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
                    <label>Price Range (ج.م)</label>
                    <div className="price-inputs">
                        <input name="minPrice" type="number" placeholder="Min" value={filters.minPrice} onChange={handleFilterChange} />
                        <input name="maxPrice" type="number" placeholder="Max" value={filters.maxPrice} onChange={handleFilterChange} />
                    </div>
                    <button onClick={applyPriceFilter} className="apply-btn">Apply Price</button>
                </div>
            </div>

            <div className="search-main">
                <div className="results-header">
                    <h2>{searchQuery ? `Results for "${searchQuery}"` : "All Products"}</h2>
                    <span>{results.length} products found</span>
                </div>

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <>
                        <div className="results-grid">
                            {results.length > 0 ? (
                                results.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map(item => (
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
                                <div className="no-results">No products matched your search.</div>
                            )}
                        </div>
                        {Math.ceil(results.length / ITEMS_PER_PAGE) > 1 && (
                            <div className="pag" style={{ justifyContent: 'center', marginTop: '32px' }}>
                                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                                {Array.from({ length: Math.ceil(results.length / ITEMS_PER_PAGE) }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        className={page === i + 1 ? 'active' : ''}
                                        onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button disabled={page === Math.ceil(results.length / ITEMS_PER_PAGE)} onClick={() => setPage(p => p + 1)}>›</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Search;
