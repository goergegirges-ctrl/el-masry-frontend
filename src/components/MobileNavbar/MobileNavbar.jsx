import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, Heart } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import './MobileNavbar.css';

const MobileNavbar = () => {
    const { getTotalCartAmount, token } = useContext(StoreContext);
    const { t } = useLanguage();

    return (
        <div className="mobile-bottom-nav">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <Home size={20} />
                <span>{t('mob_home')}</span>
            </NavLink>
            <NavLink to="/search" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <Search size={20} />
                <span>{t('mob_search')}</span>
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <div className="cart-icon-wrapper">
                    <ShoppingCart size={20} />
                    {getTotalCartAmount() > 0 && <span className="badge">{getTotalCartAmount()}</span>}
                </div>
                <span>{t('mob_cart')}</span>
            </NavLink>
            <NavLink to={token ? "/profile" : "/login"} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <User size={20} />
                <span>{t('mob_account')}</span>
            </NavLink>
        </div>
    );
};

export default MobileNavbar;
