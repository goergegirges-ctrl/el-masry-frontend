import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { Star } from 'lucide-react';
import axiosClient from '../../utils/axiosClient';
import { toast } from 'react-toastify';
import './Reviews.css';
import { useLanguage } from '../../context/LanguageContext';

const StarRating = ({ value, onChange, t }) => {
    const [hovered, setHovered] = useState(0);
    const active = hovered || value;

    return (
        <div
            className="star-input"
            onMouseLeave={() => setHovered(0)}
            role="radiogroup"
            aria-label={t('rev_ratingLabel')}
        >
            {[1, 2, 3, 4, 5].map(n => (
                <span
                    key={n}
                    role="radio"
                    aria-checked={n === value}
                    aria-label={`${n} ${t('rev_starsOf5')}`}
                    tabIndex={n === value ? 0 : -1}
                    className="star-radio"
                    onMouseEnter={() => setHovered(n)}
                    onClick={() => onChange(n)}
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                            e.preventDefault();
                            onChange(Math.min(n + 1, 5));
                        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                            e.preventDefault();
                            onChange(Math.max(n - 1, 1));
                        } else if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onChange(n);
                        }
                    }}
                >
                    <Star
                        size={28}
                        className="star-icon"
                        fill={n <= active ? '#00B4D8' : 'none'}
                        stroke={n <= active ? '#00B4D8' : '#0A1628'}
                        aria-hidden="true"
                    />
                </span>
            ))}
            <span className="star-label" aria-hidden="true">{value} / 5</span>
        </div>
    );
};

const StarDisplay = ({ rating }) => (
    <span className="star-display">
        {[1, 2, 3, 4, 5].map(n => (
            <Star
                key={n}
                size={16}
                fill={n <= rating ? '#00B4D8' : 'none'}
                stroke={n <= rating ? '#00B4D8' : '#0A1628'}
            />
        ))}
    </span>
);

const Reviews = ({ productId }) => {
    const { token } = useContext(StoreContext);
    const { t } = useLanguage();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/api/reviews/${productId}`);
            if (response.data.success) {
                const sorted = [...response.data.data].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setReviews(sorted);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const submitReview = async (e) => {
        e.preventDefault();
        if (!token) {
            toast.error(t('rev_loginRequired'));
            return;
        }

        try {
            const response = await axiosClient.post('/api/reviews/add', {
                productId,
                ...newReview
            });

            if (response.data.success) {
                toast.success(t('rev_submitted'));
                setNewReview({ rating: 5, comment: "" });
                fetchReviews();
            }
        } catch (error) {
            toast.error(t('rev_failed'));
        }
    };

    return (
        <div className='reviews-section'>
            <h3>{t('rev_title')}</h3>

            <div className="reviews-list">
                {reviews.length > 0 ? (
                    reviews.map(rev => (
                        <div key={rev.id} className="review-item">
                            <div className="review-meta">
                                <strong>{rev.username}</strong>
                                <StarDisplay rating={rev.rating} />
                            </div>
                            <p>{rev.comment}</p>
                            <small>{new Date(rev.createdAt).toLocaleDateString()}</small>
                        </div>
                    ))
                ) : (
                    <p className="no-reviews">{t('rev_noReviews')}</p>
                )}
            </div>

            {token ? (
                <form onSubmit={submitReview} className="review-form">
                    <h4>{t('rev_writeReview')}</h4>
                    <div className="rating-input">
                        <label>{t('rev_rating')}</label>
                        <StarRating
                            value={newReview.rating}
                            onChange={(n) => setNewReview({ ...newReview, rating: n })}
                            t={t}
                        />
                    </div>
                    <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder={t('rev_placeholder')}
                        required
                    />
                    <button type="submit">{t('rev_submit')}</button>
                </form>
            ) : (
                <div className="login-prompt">
                    {(() => {
                        const parts = t('rev_loginRequired').split('{link}');
                        return <>{parts[0]}<a href="/login">{t('rev_loginLink')}</a>{parts[1]}</>;
                    })()}
                </div>
            )}
        </div>
    );
};

export default Reviews;
