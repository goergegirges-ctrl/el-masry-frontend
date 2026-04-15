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
                    <select name="sort" value={filters.sort} onChange={handleFilterChange}>
                        <option value="newest">Newest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
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
                    <div className="results-grid">
                        {results.length > 0 ? (
                            results.map(item => (
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
                )}
            </div>
        </div>
    )
}

export default Search;
