import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./Product.css";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import { IoChatbubbleOutline, IoShareSocialOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { toast } from "react-toastify";
import Discussion from "../../components/Discussion";
import RatingsReviews from "../../components/RatingsReviews";
import axios from "axios";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, updateQuantity, cartItems, backendUrl, wishlist, addToWishlist, removeFromWishlist } = useContext(StoreContext);
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState("");
  const [productData, setProductData] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const relatedScrollRef = useRef(null);



  // Helper to consistently scroll the page (and potential scroll containers) to top
  const scrollPageToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Fallbacks for environments where window isn't the scroller
      document.documentElement?.scrollTo?.({ top: 0, behavior: "smooth" });
      document.querySelector(".product-page")?.scrollTo?.({ top: 0, behavior: "smooth" });
    } catch {}
  };

  useEffect(() => {
    const found = products.find((item) => String(item._id) === String(productId));
    if (found) setProductData(found);
  }, [productId, products]);

  // Ensure the viewport resets to top when navigating to a different product
  useEffect(() => {
    if (productId) {
      scrollPageToTop();
    }
  }, [productId]);

  // Get related products based on category or subCategory
  useEffect(() => {
    if (productData && products.length > 0) {
      const related = products.filter(
        (item) =>
          item._id !== productData._id &&
          (item.category === productData.category || 
           item.subCategory === productData.subCategory)
      );
      setRelatedProducts(related);
    }
  }, [productData, products]);

  // set default size from backend when productData arrives
  useEffect(() => {
    if (productData?.sizes?.length && !size) {
      setSize(productData.sizes[0]);
    }
  }, [productData, size]);

  useEffect(() => {
  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/review/${productId}`
      );

      const data = res.data?.reviews || [];

      setReviews(data);

      if (data.length > 0) {
        const avg =
          data.reduce((sum, r) => sum + Number(r.rating), 0) / data.length;
        setAvgRating(avg);
      } else {
        setAvgRating(0);
      }
    } catch (error) {
      console.error("Review fetch failed:", error);
      setReviews([]);
      setAvgRating(0);
    }
  };

  if (productId) fetchReviews();
}, [productId, backendUrl]);


  if (!productData) return <div className="loading">Loading product...</div>;

  const images = productData.image || [];

  const handlePrev = () => {
    setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    // Smooth scroll to top when navigating images
    scrollPageToTop();
  };

  const handleNext = () => {
    setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    // Smooth scroll to top when navigating images
    scrollPageToTop();
  };


  const renderStars = (rating) => {
  const rounded = Math.round(rating);

  return (
    <>
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          style={{
            color: i < rounded ? "#fbbf24" : "#e5e7eb",
            fontSize: "14px",
          }}
        />
      ))}
    </>
  );
};


  // sizes come from backend via productData.sizes

  const scrollRelated = (direction) => {
    if (relatedScrollRef.current) {
      const scrollAmount = 300;
      relatedScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Check if product is in wishlist
  const isWishlisted = wishlist?.some(item => String(item._id) === String(productData._id));

  return (
    <>
      <div className="product-page">
        {/* ---------- Left Gallery Section ---------- */}
        <div className="gallery">
          {/* Main image container */}
          <div className="main-image-container">
            <button
              className="arrow left"
              aria-label="Previous image"
              onClick={handlePrev}
            >
              <FaChevronLeft />
            </button>
            <img
              className="main-img"
              src={images[imageIndex]}
              alt={productData.name}
              onClick={handleNext}
            />
            <button
              className="arrow right"
              aria-label="Next image"
              onClick={handleNext}
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Thumbnails below main image */}
          <div className="sub-images">
            {images.length > 0 &&
              images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${productData.name} ${idx + 1}`}
                  className={`sub-img ${imageIndex === idx ? "active" : ""}`}
                  onClick={() => setImageIndex(idx)}
                />
              ))}
          </div>
        </div>

        {/* ---------- Right Info Section ---------- */}
        <div className="info">
          <h1 className="title">{productData.name}</h1>

          {/* Description */}
          <p className="desc">{productData.description}</p>

          {/* Rating */}
          {reviews.length > 0 && (
            <div className="product-rating">
  <div className="stars">
    {renderStars(avgRating)}
  </div>

  <span className="rating-value">
    {avgRating.toFixed(1)}
  </span>

  <span className="rating-dot">•</span>

  <span className="rating-value">
    ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
  </span>
</div>

          )}

          {/* Price */}
          <div className="price-container">
            <span className="price">{currency}{productData.price}</span>
            {productData.oldPrice && (
              <span className="old-price">{currency}{productData.oldPrice}</span>
            )}
          </div>

          {/* Size Selection */}
          <div className="size-section">
            <div className="section-header">
              <span className="section-label">Size: {size}</span>
            </div>
            <div className="size-buttons">
              {productData.sizes?.map((s) => (
                <button
                  key={s}
                  className={`size-btn ${size === s ? "active" : ""}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="quantity-section">
            <div className="section-header">
              <span className="section-label">Quantity</span>
            </div>
            <div className="qty-minimal">
              <button
                className="qty-icon"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-icon"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={async () => {
              if (!size) {
                toast.error("Please select a size");
                return;
              }
              try {
                await addToCart(productData._id, size);
                if (quantity > 1) {
                  await updateQuantity(productData._id, size, quantity);
                }
                setQuantity(1);
              } catch (error) {
                console.error("Add to cart error:", error);
                toast.error("Failed to add to cart");
              }
            }}
            className="add-to-cart-btn"
          >
            <span>+</span> Add to Cart
          </button>

          {/* Wishlist Actions */}
          {/* Wishlist Actions removed as requested */}
        </div>




      </div>

      {/* ---------- Tabs Section ---------- */}
      <div className="product-tabs">
        <div className="tabs">
          <button
            className={activeTab === "details" ? "active" : ""}
            onClick={() => setActiveTab("details")}
          >
            The Details
          </button>
          <button
            className={activeTab === "ratings" ? "active" : ""}
            onClick={() => setActiveTab("ratings")}
          >
            Ratings & Reviews
          </button>
          <button
            className={activeTab === "discussion" ? "active" : ""}
            onClick={() => setActiveTab("discussion")}
          >
            Discussion
          </button>
        </div>

        <div className="tab-body">
          {activeTab === "details" && (
            <div className="details-accordion">

              {/* DETAILS */}
              <div className="details-accordion-item">
                <div
                  className="details-accordion-header"
                  onClick={() =>
                    setOpenSection(openSection === "details" ? null : "details")
                  }
                >
                  <span>Details</span>
                  <span>{openSection === "details" ? "−" : "+"}</span>
                </div>

                {openSection === "details" && (
                  <ul className="details-accordion-body">
                    <li>Material: 100% Cotton</li>
                    <li>Fabric: Soft & breathable</li>
                    <li>Fit: Regular fit</li>
                    <li>Occasion: Casual wear</li>
                    <li>Country of Origin: India</li>
                  </ul>
                )}
              </div>

              {/* DIMENSIONS */}
              <div className="details-accordion-item">
                <div
                  className="details-accordion-header"
                  onClick={() =>
                    setOpenSection(openSection === "dimensions" ? null : "dimensions")
                  }
                >
                  <span>Dimensions</span>
                  <span>{openSection === "dimensions" ? "−" : "+"}</span>
                </div>

                {openSection === "dimensions" && (
                  <ul className="details-accordion-body">
                    <li>Model Height: 5’11”</li>
                    <li>Model Wearing: Size M</li>
                    <li>Length: 72 cm</li>
                    <li>Chest: 102 cm</li>
                  </ul>
                )}
              </div>

              {/* CARE */}
              <div className="details-accordion-item">
                <div
                  className="details-accordion-header"
                  onClick={() =>
                    setOpenSection(openSection === "care" ? null : "care")
                  }
                >
                  <span>Care</span>
                  <span>{openSection === "care" ? "−" : "+"}</span>
                </div>

                {openSection === "care" && (
                  <ul className="details-accordion-body">
                    <li>Machine wash cold</li>
                    <li>Wash with similar colors</li>
                    <li>Do not bleach</li>
                    <li>Tumble dry low</li>
                  </ul>
                )}
              </div>

              {/* SUSTAINABILITY */}
              <div className="details-accordion-item">
                <div
                  className="details-accordion-header"
                  onClick={() =>
                    setOpenSection(openSection === "sustainability" ? null : "sustainability")
                  }
                >
                  <span>Sustainability</span>
                  <span>{openSection === "sustainability" ? "−" : "+"}</span>
                </div>

                {openSection === "sustainability" && (
                  <ul className="details-accordion-body">
                    <li>Eco-friendly dyes</li>
                    <li>Reduced water usage</li>
                    <li>Ethically sourced materials</li>
                    <li>Recyclable packaging</li>
                  </ul>
                )}
              </div>

            </div>
          )}
          {activeTab === "ratings" && <RatingsReviews productId={productData._id} />}
          {activeTab === "discussion" && <Discussion />}
        </div>
      </div>

      {/* ---------- Related Products Section ---------- */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <div className="related-header">
            <h2>Related Products</h2>
            <div className="related-arrows">
              <button className="related-arrow" onClick={() => scrollRelated('left')}>
                <FaChevronLeft />
              </button>
              <button className="related-arrow" onClick={() => scrollRelated('right')}>
                <FaChevronRight />
              </button>
            </div>
          </div>

          <div className="related-products-container" ref={relatedScrollRef}>
            {relatedProducts.map((item) => (
              <Link 
                key={item._id} 
                to={`/product/${item._id}`} 
                className="related-product-card"
                onClick={() => window.scrollTo(0, 0)}
              >
                {item.bestseller && (
                  <span className="sale-badge">SALE</span>
                )}
                <div className="related-product-image">
                  <img src={item.image[0]} alt={item.name} />
                </div>
                <div className="related-product-info">
                  <h3>{item.name}</h3>
                  <div className="related-product-price">
                    <span className="current-price">{currency}{item.price}</span>
                    {item.oldPrice && (
                      <span className="old-price-strike">{currency}{item.oldPrice}</span>
                    )}
                  </div>
                </div>
                <button 
                  className="related-add-cart"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (item.sizes && item.sizes.length > 0) {
                      addToCart(item._id, item.sizes[0]);
                    } else {
                      toast.error("Please select a size");
                    }
                  }}
                >
                  <span>+</span>
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Product;
