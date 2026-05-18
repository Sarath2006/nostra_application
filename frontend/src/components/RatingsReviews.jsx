import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext";
import "./RatingsReviews.css";
import { GoStar, GoStarFill } from "react-icons/go";


const RatingsReviews = ({ productId }) => {
  const { backendUrl, token, setShowLoginModal } = useContext(StoreContext);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    text: "",
  });

  const [sortBy, setSortBy] = useState("newest");
  const [hoverRating, setHoverRating] = useState(0);
  

  const sortedReviews = [...reviews].sort((a, b) => {
  if (sortBy === "rating") {
    return b.rating - a.rating;
  }
  return new Date(b.createdAt) - new Date(a.createdAt);
});

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const i of intervals) {
      const count = Math.floor(seconds / i.seconds);
      if (count >= 1)
        return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  };

  // Fetch reviews
  const fetchReviews = async () => {
    const res = await axios.get(`${backendUrl}/api/review/${productId}`);
  setReviews(res.data.reviews || []);
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const submitReview = async () => {
    if (!newReview.name || !newReview.text) return;

    try {
      await axios.post(
        `${backendUrl}/api/review/add`,
        { ...newReview, productId },
        { headers: { token } }
      );

      setNewReview({ name: "", rating: 5, text: "" });
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting review");
    }
  };

  const totalReviews = reviews.length;
  const avg =
    reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews || 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const getPercent = (count) =>
    totalReviews ? (count / totalReviews) * 100 : 0;

  return (
    <div className="ratings">

      {/* ===== SUMMARY ===== */}
      <div className="rating-summary">
        <div className="rating-left">
          <h1>{avg.toFixed(1)}</h1>
          <div className="stars">
            {"★".repeat(Math.round(avg))}
            {"☆".repeat(5 - Math.round(avg))}
          </div>
          <p>Based on {totalReviews} ratings</p>
        </div>

        <div className="rating-bars">
          {ratingCounts.map((r) => (
            <div key={r.star} className="bar-row">
              <span>{r.star} ★</span>
              <div className="bar">
                <div
                  className="fill "
                  style={{ width: `${getPercent(r.count)}%` }}
                />
              </div>
              <span>{r.count}</span>
            </div>
          ))}
        </div>
      </div>


      {/* ===== SORT ===== */}
<div className="sort-wrapper">
  <span>Sort by:</span>
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="sort-select"
  >
    <option value="newest">Newest</option>
    <option value="rating">Highest Rating</option>
  </select>
</div>

      {/* ===== REVIEWS ===== */}
      <div className="reviews-list">
        {reviews.length === 0 && (
          <p className="no-reviews">No reviews yet</p>
        )}

        {sortedReviews.map((r) => (
  <div key={r._id} className="review">
    <div className="review-header">
      <div className="review-user">
        <strong>{r.name}</strong>
       <span className="review-date">{timeAgo(r.createdAt)}</span>
      </div>

      <span className="stars">
        {"★".repeat(r.rating)}
        {"☆".repeat(5 - r.rating)}
      </span>
    </div>

    <p>{r.text}</p>
  </div>
))}
      </div>

      {/* ===== ADD REVIEW ===== */}
      {token ? (
        <div className="new-review">
          <input
            placeholder="Your name"
            value={newReview.name}
            onChange={(e) =>
              setNewReview((n) => ({ ...n, name: e.target.value }))
            }
          />

          <div className="star-input">
  {[1, 2, 3, 4, 5].map((star) => (
    <span
      key={star}
      onMouseEnter={() => setHoverRating(star)}
      onMouseLeave={() => setHoverRating(0)}
      onClick={() =>
        setNewReview((n) => ({ ...n, rating: star }))
      }
    >
      {star <= (hoverRating || newReview.rating) ? (
        <GoStarFill />
      ) : (
        <GoStar />
      )}
    </span>
  ))}
</div>

          <textarea
            placeholder="Your Review"
            value={newReview.text}
            onChange={(e) =>
              setNewReview((n) => ({ ...n, text: e.target.value }))
            }
          />

          <button onClick={submitReview}>Submit Review</button>
        </div>
      ) : (
        <p className="login-msg">
          Please{" "}
          <span
            onClick={() => setShowLoginModal(true)}
            style={{ 
              cursor: "pointer", 
              textDecoration: "underline", 
              fontWeight: "600" 
            }}
          >
            login
          </span>
          {" "}to write a review
        </p>
      )}
    </div>
  );
};

export default RatingsReviews;
