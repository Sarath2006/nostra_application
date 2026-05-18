import React, { useContext, useEffect } from "react";
import { StoreContext } from "../context/StoreContext";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, products, fetchWishlist, removeFromWishlist, addToCart } = useContext(StoreContext);

  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line
  }, []);

  if (!wishlist || wishlist.length === 0) {
    return <div className="wishlist-empty">Your wishlist is empty.</div>;
  }

  return (
    <div className="wishlist-container">
      <h2>My Wishlist</h2>
      <div className="wishlist-list">
        {wishlist.map((item) => (
          <div key={item._id} className="wishlist-item">
            <Link to={`/product/${item._id}`}> <img src={item.image?.[0]} alt={item.name} /> </Link>
            <div className="wishlist-details">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: ₹{item.price}</p>
              <button onClick={() => addToCart(item._id, item.sizes?.[0])}>Add to Cart</button>
              <button onClick={() => removeFromWishlist(item._id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
