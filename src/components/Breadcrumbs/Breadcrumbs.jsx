import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { Link, useLocation } from 'react-router-dom';
import { formatCategoryName } from '../../utils/seoHelpers';
import './Breadcrumbs.css';

const Breadcrumbs = () => {
    const location = useLocation();
    const { categories } = useContext(StoreContext);
    const { language } = useLanguage();
    const pathnames = location.pathname.split('/').filter(x => x);

    if (location.pathname === '/' || pathnames[0] === 'product') return null;

    return (
        <nav className="breadcrumbs-nav">
            <Link to="/">Home</Link>
            {pathnames.map((name, index) => {
                // If it's the 'category' segment, we might want to skip it if it's followed by a slug
                if (name === 'category' && pathnames[index + 1]) {
                    return null;
                }

                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;

                // Human friendly names
                let displayName = name.charAt(0).toUpperCase() + name.slice(1);
                
                // Map category slug to Arabic display name (with brand suffix)
                if (pathnames[index - 1] === 'category') {
                    const cat = categories.find(c => c.slug === name);
                    if (cat) displayName = language === 'ar' ? cat.nameAr : cat.nameEn;
                }

                if (name === 'order') displayName = 'Checkout';

                return (
                    <span key={index}>
                        <span className="separator">/</span>
                        {isLast ? (
                            <span className="current">{displayName}</span>
                        ) : (
                            <Link to={routeTo}>{displayName}</Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
