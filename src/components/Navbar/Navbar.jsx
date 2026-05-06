import React, { useContext, useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import logoHorizontal from '@/assets/logo-horizontal-light.svg';
import logoMark from '@/assets/logo-mark-mono-light.svg';
import { Search, ShoppingCart, User, Heart, Home, LayoutGrid, ChevronDown, LogOut, Package } from 'lucide-react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { useLanguage } from '../../context/LanguageContext';
import { formatCategoryName } from '../../utils/seoHelpers';

const Navbar = () => {
  const { t } = useLanguage();
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const searchRef = useRef(null);
  const categoriesRef = useRef(null);
  const userRef = useRef(null);
  const isStickyRef = useRef(false);

  const {
    getTotalCartCount, product_list, token, userData,
    getWishlistCount, setToken, setUserData, categories,
  } = useContext(StoreContext);

  // Sticky on scroll
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

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(inputValue), 300);
    return () => clearTimeout(handler);
  }, [inputValue]);

  // Fuzzy search
  const fuzzyMatch = (productName, query) => {
    const name = productName.toLowerCase();
    const q = query.toLowerCase().trim();
    if (!q) return true;
    let i = 0;
    for (const char of name) {
      if (char === q[i]) i++;
      if (i === q.length) return true;
    }
    return false;
  };

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    setSearchResults(product_list.filter(p => fuzzyMatch(p.name, debouncedValue)));
    setShowDropdown(true);
  }, [debouncedValue, product_list]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDropdown(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserDropdown(false);
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) setShowCategoriesDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchClick = (product) => {
    navigate(`/product/${product.id}`);
    setShowDropdown(false);
    setInputValue('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUserData(null);
    setShowUserDropdown(false);
    navigate('/');
  };

  return (
    <div className={`navbar-wrapper ${isSticky ? 'sticky' : ''}`}>
      <div className="navbar">

        {/* Left: Logo + Desktop Nav Links */}
        <div className="navbar-left">
          <Link to="/" className="logo-link">
            <img src={logoHorizontal} className="logo" alt="El-Masry Electronics" />
          </Link>

          <nav className="desktop-nav" aria-label="Main navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-pill${isActive ? ' active' : ''}`}
            >
              <Home size={15} aria-hidden="true" />
              <span>{t('nav_home')}</span>
            </NavLink>

            <div
              className="nav-pill categories-trigger"
              ref={categoriesRef}
              onMouseEnter={() => setShowCategoriesDropdown(true)}
              onMouseLeave={() => setShowCategoriesDropdown(false)}
            >
              <button
                type="button"
                onClick={() => setShowCategoriesDropdown(v => !v)}
                aria-expanded={showCategoriesDropdown}
                aria-haspopup="true"
              >
                <LayoutGrid size={15} aria-hidden="true" />
                <span>{t('nav_categories')}</span>
                <ChevronDown
                  size={12}
                  className={`chev ${showCategoriesDropdown ? 'open' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {showCategoriesDropdown && categories.length > 0 && (
                <div className="categories-dropdown" role="menu">
                  {categories.map((cat, i) => (
                    <Link
                      key={i}
                      to={`/category/${cat.slug || cat.category_slug}`}
                      className="cat-dropdown-item"
                      role="menuitem"
                      onClick={() => setShowCategoriesDropdown(false)}
                    >
                      {formatCategoryName(cat.nameAr || cat.category_name)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Center: Search */}
        <div className="navbar-center">
          <div className="navbar-search-bar" ref={searchRef}>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} aria-hidden="true" />
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
                placeholder={t('nav_searchPlaceholder')}
                dir="auto"
                aria-label={t('nav_searchLabel')}
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
                        src={product.images?.length > 0 ? product.images[0] : logoMark}
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
                  <div className="search-no-results" role="status">{t('nav_noResults')}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="navbar-right">
          <div className="navbar-actions">
            <LanguageSwitcher />
            <ThemeToggle />

            <Link to="/wishlist" className="action-item wishlist-link" aria-label={t('pi_addToWishlist')}>
              <Heart size={22} />
              {getWishlistCount() > 0 && (
                <span className="wishlist-badge">{getWishlistCount()}</span>
              )}
            </Link>

            <Link to="/cart" className="action-item cart-link" aria-label="Cart">
              <ShoppingCart size={22} />
              {getTotalCartCount() > 0 && (
                <span className="cart-badge">{getTotalCartCount()}</span>
              )}
            </Link>

            {/* User dropdown */}
            <div className="user-menu" ref={userRef}>
              <button
                type="button"
                className="user-menu-btn"
                onClick={() => setShowUserDropdown(v => !v)}
                aria-expanded={showUserDropdown}
                aria-haspopup="true"
              >
                <User size={18} aria-hidden="true" />
                {token && userData?.firstName && (
                  <span className="user-name-label">{userData.firstName}</span>
                )}
                <ChevronDown
                  size={12}
                  className={`chev ${showUserDropdown ? 'open' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {showUserDropdown && (
                <div className="user-dropdown" role="menu">
                  {!token ? (
                    <>
                      <Link
                        to="/login"
                        className="user-dropdown-item"
                        role="menuitem"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <User size={15} aria-hidden="true" />
                        {t('nav_login')}
                      </Link>
                      <Link
                        to="/register"
                        className="user-dropdown-item"
                        role="menuitem"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <Package size={15} aria-hidden="true" />
                        {t('auth_register')}
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/profile"
                        className="user-dropdown-item"
                        role="menuitem"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <User size={15} aria-hidden="true" />
                        {t('nav_profile')}
                      </Link>
                      <Link
                        to="/my-orders"
                        className="user-dropdown-item"
                        role="menuitem"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <Package size={15} aria-hidden="true" />
                        {t('orders_title')}
                      </Link>
                      <button
                        type="button"
                        className="user-dropdown-item danger"
                        role="menuitem"
                        onClick={handleLogout}
                      >
                        <LogOut size={15} aria-hidden="true" />
                        {t('profile_logout')}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
