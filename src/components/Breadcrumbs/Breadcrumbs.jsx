import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { category_list } from '../../assets/assets';
import './Breadcrumbs.css';

const Breadcrumbs = () => {
    const location = useLocation();
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
                
                // Map category slug to Arabic name
                if (pathnames[index - 1] === 'category') {
                    const cat = category_list.find(c => c.category_slug === name);
                    if (cat) displayName = cat.category_name;
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
