import React, { useContext, useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import { Search, ShoppingCart, X, User, Heart } from 'lucide-react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { formatCategoryName } from '../../utils/seoHelpers';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();

  // Search States
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchRef = useRef(null);
  const { getTotalCartCount, product_list, token, userData, getWishlistCount } = useContext(StoreContext);

  // Sticky Scroll Logic — ref guard prevents setState on every scroll tick;
  // only fires on the actual false→true and true→false transitions.
  const isStickyRef = useRef(false);
  useEffect(() => {
    const handleScroll = () => {
      const shouldBeSticky = window.scrollY > 50;
      if (isStickyRef.current !== shouldBeSticky) {
        isStickyRef.current = shouldBeSticky;
        setIsSticky(shouldBeSticky);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounce Logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 300);
    return () => clearTimeout(handler);
  }, [inputValue]);

  // Fuzzy Match Logic
  const fuzzyMatch = (productName, query) => {
    const name = productName.toLowerCase();
    const q = query.toLowerCase().trim();
    if (!q) return true;

    // Check if all typed characters appear in order inside the name
    let i = 0;
    for (const char of name) {
      if (char === q[i]) i++;
      if (i === q.length) return true;
    }
    return false;
  };

  // Filter Logic
  useEffect(() => {
    if (debouncedValue.trim() === "") {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const filtered = product_list.filter(product =>
      fuzzyMatch(product.name, debouncedValue)
    );
    setSearchResults(filtered);
    setShowDropdown(true);
  }, [debouncedValue, product_list]);

  // Click Outside to Close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);
  const closeMobileMenu = () => setShowMobileMenu(false);

  const handleSearchClick = (product) => {
    navigate(`/product/${product.id}`);
    setShowDropdown(false);
    setInputValue("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className={`navbar-wrapper ${isSticky ? 'sticky' : ''}`}>
      <div className='navbar'>
        <div className="navbar-left">
          <button
            type="button"
            className={`hamburger-icon ${showMobileMenu ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label={showMobileMenu ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={showMobileMenu}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
          <Link to='/' onClick={() => setMenu("home")}>
            <img src={assets.logo} className="logo" alt="El-Masry" />
          </Link>
        </div>

        <div className="navbar-center">
          <div className="navbar-search-bar" ref={searchRef}>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/search?q=${inputValue}`);
                    setShowDropdown(false);
                  }
                }}
                type="text"
                placeholder="ابحث هنا | Search here"
                dir="auto"
                aria-label="ابحث عن منتج"
              />
            </div>

            {showDropdown && inputValue && (
              <div className="search-dropdown">
                {searchResults.length > 0 ? (
                  searchResults.slice(0, 6).map((product, index) => (
                    <button
                      key={product.id}
                      type="button"
                      className="search-dropdown-item"
                      style={{ '--i': index }}
                      onClick={() => handleSearchClick(product)}
                    >
                      <img
                        src={(product.images && product.images.length > 0) ? product.images[0] : assets.logo}
                        alt={product.name}
                      />
                      <div className="info">
                        <p className="category">{formatCategoryName(product.category)}</p>
                        <p className="name">{product.name}</p>
                         <p className="price">{product.price} ج.م</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="search-no-results" role="status">لم يتم العثور على منتجات</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="navbar-right">
          <div className="navbar-actions">
            <ThemeToggle />
            <Link to='/wishlist' className="action-item wishlist-link">
              <Heart size={24} color="#FFFFFF" />
              {getWishlistCount() > 0 && <span className="wishlist-badge">{getWishlistCount()}</span>}
            </Link>
            <Link to='/cart' className="action-item cart-link">
              <ShoppingCart size={24} color="#FFFFFF" />
              {getTotalCartCount() > 0 && <span className="cart-badge">{getTotalCartCount()}</span>}
            </Link>
            {!token ? (
              <button className="signin-btn" onClick={() => navigate('/login')}>
                <User size={20} />
                <span>تسجيل الدخول</span>
              </button>
            ) : (
              <Link to='/profile' className="profile-link-btn">
                <User size={20} color="#FFFFFF" />
                <span className="user-name">{userData?.firstName}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className={`mobile-menu ${showMobileMenu ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-header">
            <img src={assets.logo} className="mobile-logo" alt="El-Masry" />
            <button type="button" onClick={closeMobileMenu} className="mobile-close-btn" aria-label="إغلاق القائمة">
              <X size={28} aria-hidden="true" />
            </button>
          </div>
          <nav className="mobile-nav">
            <Link to='/' onClick={() => { setMenu("home"); closeMobileMenu() }} className={menu === "home" ? "active" : ""}>الرئيسية</Link>
            <a href='#categories-section' onClick={() => { setMenu("categories"); closeMobileMenu() }}>الفئات</a>
            <a href='#products-section' onClick={() => { setMenu("products"); closeMobileMenu() }}>المنتجات</a>
            <a href='#footer' onClick={() => { setMenu("contact"); closeMobileMenu() }}>اتصل بنا</a>
          </nav>
        </div>
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      </div>
    </div>
  )
}

export default Navbar;
