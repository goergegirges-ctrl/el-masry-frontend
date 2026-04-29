import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import ProductItem from '../../components/productItem/productItem';
import { Link } from 'react-router-dom';
import { Heart, Home } from 'lucide-react';
import './Wishlist.css';
import { useLanguage } from '../../context/LanguageContext';

const Wishlist = () => {
    const { wishlist, product_list } = useContext(StoreContext);
    const { t } = useLanguage();

    // Filter product_list based on IDs in wishlist
    const wishlistedProducts = product_list.filter(product => wishlist.includes(product.id));

    return (
        <div className='wishlist-page'>
            <div className="wishlist-header">
                <Heart size={32} className="heart-icon" fill="#ff4c24" stroke="#ff4c24" />
                <h1>{t('wish_title')}</h1>
            </div>

            {wishlistedProducts.length > 0 ? (
                <div className='wishlist-grid'>
                    {wishlistedProducts.map((item) => (
                        <ProductItem
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            price={item.price}
                            description={item.description}
                            images={item.images}
                            stock={item.stock}
                            condition={item.condition}
                            brand={item.brand}
                        />
                    ))}
                </div>
            ) : (
                <div className='wishlist-empty'>
                    <div className="empty-icon-wrapper">
                        <Heart size={64} color="#CBD5E0" />
                    </div>
                    <h2>{t('wish_empty')}</h2>
                    <p>{t('wish_emptyMsg')}</p>
                    <Link to="/" className="return-btn">
                        <Home size={20} />
                        {t('wish_returnToShop')}
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Wishlist;
