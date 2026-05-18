import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { Link, useNavigate } from "react-router-dom";
import "./WishlistPage.css";

const WishlistPage = () => {
  const { wishlist, fetchWishlist, removeFromWishlist, addToCart } = useContext(StoreContext);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  useEffect(() => {
    // Initialize quantities for wishlist items
    if (wishlist && wishlist.length > 0) {
      const initial = {};
      wishlist.forEach(item => {
        initial[item._id] = 1;
      });
      setQuantities(initial);
    }
  }, [wishlist]);

  const handleOrder = (item) => {
    const size = item.sizes?.[0];
    const qty = quantities[item._id] || 1;
    if (!size) return;
    navigate('/place-order', { state: { directOrder: { _id: item._id, size, quantity: qty } } });
  };

  if (!wishlist || wishlist.length === 0) {
    return <div className="wishlist-empty">Your wishlist is empty.</div>;
  }

  return (
    <div className="wishlist-minimal-container">
      {wishlist.map((item) => (
        <div key={item._id} className="wishlist-minimal-row">
          <div className="wishlist-minimal-img-wrap">
            <Link to={`/product/${item._id}`}><img src={item.image?.[0]} alt={item.name} className="wishlist-minimal-img" /></Link>
          </div>
          <div className="wishlist-minimal-details">
            <Link to={`/product/${item._id}`} className="wishlist-minimal-name-link">
              <div className="wishlist-minimal-name">{item.name}</div>
            </Link>
            <div className="wishlist-minimal-brand">{item.brand || 'Brand'}</div>
            <div className="wishlist-minimal-desc">{item.description || 'Short description of product written here'}</div>
          </div>
          <div className="wishlist-minimal-price">
            ₹{item.price}
          </div>
          <div className="wishlist-minimal-actions">
            <button className="wishlist-add-cart-btn" onClick={() => addToCart(item._id, item.sizes?.[0])}>Add to Cart</button>
            <span className="wishlist-minimal-remove" onClick={() => removeFromWishlist(item._id)}>
              <span style={{fontSize:'1.7rem',cursor:'pointer',color:'#222'}}>×</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WishlistPage;
