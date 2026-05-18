import React, { useContext, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import { FaCartArrowDown } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "./FeaturedProducts.css";

const FeaturedProducts = () => {
    const { products, currency, addToCart, wishlist, addToWishlist, removeFromWishlist } = useContext(StoreContext);
    const scrollRef = useRef(null);
    const [progress, setProgress] = useState(0);

   const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleAddToCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = Array.isArray(item.sizes) && item.sizes.length > 0 ? item.sizes[0] : null;
    addToCart(item._id, defaultSize);
  };

  const handleWishlist = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlist?.some(w => String(w._id) === String(item._id))) {
      removeFromWishlist(item._id);
    } else {
      addToWishlist(item._id);
    }
  };

  const handleBuyNow = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = Array.isArray(item.sizes) && item.sizes.length > 0 ? item.sizes[0] : null;
    addToCart(item._id, defaultSize);
    // Optionally, redirect to cart/checkout page
  };

   // Track scroll progress
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = slider;
      const scrolled = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setProgress(scrolled);
    };

    slider.addEventListener("scroll", handleScroll);
    return () => slider.removeEventListener("scroll", handleScroll);
  }, []);

  return (
      <div className="featured-container">
      <div className="featured-header">
        <h2 className="featured-title">Featured products</h2>
        <div className="arrow-controls">
          <button className="arrow-btn" onClick={() => scroll("left")}>
            <IoIosArrowBack size={20} />
          </button>
          <button className="arrow-btn" onClick={() => scroll("right")}>
            <IoIosArrowForward size={20} />
          </button>
        </div>
      </div>

      <div className="slider" ref={scrollRef}>
        {products.slice(0, 6).map((item) => {
          const isWishlisted = wishlist?.some(w => String(w._id) === String(item._id));
          return (
            <Link
              to={`/product/${item._id}`}
              state={{ product: item }}
              className="product-item"
              key={item._id}
            >
              <div className="product-image-wrapper">
                {item.sale && <span className="badge-sale">SALE</span>}
                <img src={Array.isArray(item.image) ? item.image[0] : item.image} alt={item.name} />
              </div>
              <div className="product-details">
                <h3 className="product-title">{item.name}</h3>
                <div className="pricing-section">
                  {item.oldPrice && (
                    <span className="original-price">{currency}{item.oldPrice}</span>
                  )}
                  <span className="current-price">{currency}{item.price}</span>
                </div>
                <button className="add-btn" onClick={(e) => handleAddToCart(e, item)}>
                  <FaCartArrowDown />
                </button>
                
              </div>
            </Link>
          );
        })}
      </div>
      {/* Progress bar */}
      <div className="scroll-progress">
        <div
          className="scroll-progress-bar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
