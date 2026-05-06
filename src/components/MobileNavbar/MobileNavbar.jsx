import React, { useContext, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingCart, Heart, User, X } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { category_list } from '../../assets/assets';
import { formatCategoryName } from '../../utils/seoHelpers';
import './MobileNavbar.css';

const MobileNavbar = () => {
  const { getTotalCartCount, getWishlistCount, token, categories } = useContext(StoreContext);
  const { t } = useLanguage();
  const [showCatsSheet, setShowCatsSheet] = useState(false);

  // Use live categories from context; fall back to static list while loading
  const catList = categories && categories.length > 0 ? categories : category_list;

  return (
    <>
      <div className="mobile-bottom-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <Home size={20} />
          <span>{t('mob_home')}</span>
        </NavLink>

        <button
          type="button"
          className={`nav-item${showCatsSheet ? ' active' : ''}`}
          onClick={() => setShowCatsSheet(true)}
        >
          <LayoutGrid size={20} />
          <span>{t('mob_categories')}</span>
        </button>

        <NavLink
          to="/cart"
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <div className="cart-icon-wrapper">
            <ShoppingCart size={20} />
            {getTotalCartCount() > 0 && (
              <span className="badge">{getTotalCartCount()}</span>
            )}
          </div>
          <span>{t('mob_cart')}</span>
        </NavLink>

        <NavLink
          to="/wishlist"
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <div className="cart-icon-wrapper">
            <Heart size={20} />
            {getWishlistCount() > 0 && (
              <span className="badge">{getWishlistCount()}</span>
            )}
          </div>
          <span>{t('mob_wishlist')}</span>
        </NavLink>

        <NavLink
          to={token ? '/profile' : '/login'}
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <User size={20} />
          <span>{t('mob_account')}</span>
        </NavLink>
      </div>

      {showCatsSheet && (
        <>
          <div
            className="cats-backdrop"
            onClick={() => setShowCatsSheet(false)}
            aria-hidden="true"
          />
          <div className="cats-sheet" role="dialog" aria-modal="true" aria-label={t('mob_categories')}>
            <div className="cats-sheet-header">
              <span>{t('mob_categories')}</span>
              <button
                type="button"
                className="cats-sheet-close"
                onClick={() => setShowCatsSheet(false)}
                aria-label={t('nav_closeMenu')}
              >
                <X size={20} />
              </button>
            </div>
            <div className="cats-sheet-list">
              {catList.map((cat, i) => (
                <Link
                  key={i}
                  to={`/category/${cat.slug || cat.category_slug}`}
                  className="cats-sheet-item"
                  onClick={() => setShowCatsSheet(false)}
                >
                  {formatCategoryName(cat.nameAr || cat.category_name)}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileNavbar;
