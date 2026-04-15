import React, { useState } from 'react';
import './LazyImage.css';

const LazyImage = ({ src, alt, className, fallback = "/fallback-product.png" }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div className={`lazy-image-container ${className || ''} ${loaded ? 'loaded' : 'loading'}`}>
            {!loaded && !error && <div className="skeleton-loader"></div>}
            <img
                src={error ? fallback : src}
                alt={alt}
                className={`lazy-image ${loaded ? 'visible' : 'hidden'}`}
                onLoad={() => setLoaded(true)}
                onError={() => {
                    setError(true);
                    setLoaded(true);
                }}
                loading="lazy"
            />
        </div>
    );
};

export default LazyImage;
