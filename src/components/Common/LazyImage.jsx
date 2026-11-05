import React, { useState } from 'react';
import logoMark from '@/assets/logo-mark.svg';
import './LazyImage.css';

const LazyImage = ({ src, alt, className, fallback = logoMark }) => {
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
                decoding="async"
            />
        </div>
    );
};

export default LazyImage;
