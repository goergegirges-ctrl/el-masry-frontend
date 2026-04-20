import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { Star } from 'lucide-react';
import axiosClient from '../../utils/axiosClient';
import { toast } from 'react-toastify';
import './Reviews.css';

const StarRating = ({ value, onChange }) => {
    const [hovered, setHovered] = useState(0);
    const active = hovered || value;

    return (
        <div
            className="star-input"
            onMouseLeave={() => setHovered(0)}
            role="radiogroup"
            aria-label="تقييم المنتج"
        >
            {[1, 2, 3, 4, 5].map(n => (
                <span
                    key={n}
                    role="radio"
                    aria-checked={n === value}
                    aria-label={`${n} من 5 نجوم`}
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
            toast.error("Please login to write a review");
            return;
        }

        try {
            const response = await axiosClient.post('/api/reviews/add', {
                productId,
                ...newReview
            });

            if (response.data.success) {
                toast.success("Review submitted!");
                setNewReview({ rating: 5, comment: "" });
                fetchReviews();
            }
        } catch (error) {
            toast.error("Failed to submit review");
        }
    };

    return (
        <div className='reviews-section'>
            <h3>Customer Reviews / آراء العملاء</h3>

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
                    <p className="no-reviews">No reviews yet. Be the first to review!</p>
                )}
            </div>

            {token ? (
                <form onSubmit={submitReview} className="review-form">
                    <h4>Write a Review / اكتب تقييمك</h4>
                    <div className="rating-input">
                        <label>Rating:</label>
                        <StarRating
                            value={newReview.rating}
                            onChange={(n) => setNewReview({ ...newReview, rating: n })}
                        />
                    </div>
                    <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder="Share your thoughts about this product..."
                        required
                    />
                    <button type="submit">Submit Review</button>
                </form>
            ) : (
                <div className="login-prompt">
                    Please <a href="/login">login</a> to write a review.
                </div>
            )}
        </div>
    );
};

export default Reviews;
