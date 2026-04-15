import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Reviews.css';

const Reviews = ({ productId }) => {
    const { url, token } = useContext(StoreContext);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/reviews/${productId}`);
            if (response.data.success) {
                setReviews(response.data.data);
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
            const response = await axios.post(`${url}/api/reviews/add`, {
                productId,
                ...newReview
            }, { headers: { Authorization: `Bearer ${token}` } });

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
            <h3>Customer Reviews</h3>

            <div className="reviews-list">
                {reviews.length > 0 ? (
                    reviews.map(rev => (
                        <div key={rev.id} className="review-item">
                            <div className="review-meta">
                                <strong>{rev.username}</strong>
                                <span className="rating">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
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
                    <h4>Write a Review</h4>
                    <div className="rating-input">
                        <label>Rating:</label>
                        <select value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}>
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Very Good</option>
                            <option value="3">3 - Good</option>
                            <option value="2">2 - Fair</option>
                            <option value="1">1 - Poor</option>
                        </select>
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
