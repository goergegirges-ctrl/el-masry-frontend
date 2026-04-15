import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, Heart } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import './MobileNavbar.css';

const MobileNavbar = () => {
    const { getTotalCartAmount, token } = useContext(StoreContext);

    return (
        <div className="mobile-bottom-nav">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <Home size={20} />
                <span>Home</span>
            </NavLink>
            <NavLink to="/search" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <Search size={20} />
                <span>Search</span>
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <div className="cart-icon-wrapper">
                    <ShoppingCart size={20} />
                    {getTotalCartAmount() > 0 && <span className="badge">{getTotalCartAmount()}</span>}
                </div>
                <span>Cart</span>
            </NavLink>
            <NavLink to={token ? "/profile" : "/login"} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <User size={20} />
                <span>Account</span>
            </NavLink>
        </div>
    );
};

export default MobileNavbar;
