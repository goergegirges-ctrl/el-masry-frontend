import React, { useContext, useState, useMemo } from 'react'
import './productDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import ProductItem from '../productItem/productItem'

const ProductDisplay = ({ category }) => {

  const { product_list, search, showSearch, loading } = useContext(StoreContext);
  const [sortOption, setSortOption] = useState("relevant");

  // Normalize category by removing "ال" article prefix for comparison
  const normalizeCategory = (cat) => cat ? cat.replace(/^ال/, '') : '';

  const processedProducts = useMemo(() => {
    let products = [...product_list];

    // Filter
    products = products.filter(item => {
      const isHomepage = category === "All" && !showSearch;
      const featuredMatch = !isHomepage || item.isFeatured;
      const categoryMatch = (category === "All" || normalizeCategory(category) === normalizeCategory(item.category));
      const searchMatch = !showSearch || search.trim() === "" || item.name.toLowerCase().includes(search.toLowerCase());
      return featuredMatch && categoryMatch && searchMatch;
    });

    // Sort
    if (sortOption === "low-high") {
      products.sort((a, b) => a.price - b.price);
    } else if (sortOption === "high-low") {
      products.sort((a, b) => b.price - a.price);
    } else if (sortOption === "newest") {
      // Newest arrivals first
      products.reverse();
    }

    return products;
  }, [product_list, category, search, showSearch, sortOption]);

  return (
    <div className='product-display' id='products-section'>
      <div className="product-display-header">
        <h2>{showSearch && search ? `Search results for "${search}"` : 'Top products near you'}</h2>
        <div className="product-sort">
          <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
            <option value="relevant">Relevant</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      <div className="product-display-list">
        {loading ? (
          // Skeleton Loaders
          Array(8).fill(0).map((_, index) => (
            <div key={index} className="skeleton-card">
              <div className="skeleton-image"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text short"></div>
            </div>
          ))
        ) : processedProducts.length > 0 ? (
          processedProducts.map((item, index) => (
            <ProductItem
              key={index}
              id={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              images={item.images}
              stock={item.stock}
              condition={item.condition}
              isActive={item.isActive}
              category={item.category}
            />
          ))
        ) : (
          <div className="no-products-found">
            <p>{category === "All" && !showSearch ? "No featured products yet" : "No products found"}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDisplay
