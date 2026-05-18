import React from "react";
import "./PromoNewsletter.css";
import IMAGES from "../assets/assests";
import { IoMailOutline } from "react-icons/io5";


const PromoNewsletter = () => {
  return (
    <div className="promo-newsletter">
      {/* Promo Banner */}
      <div className="promo-banner">
        <div className="promo-image">
          <img src={IMAGES.newbanner} alt="Promo" />

        </div>
        <div className="promo-content">
          <p className="promo-subtitle">LIMITED OFFER</p>
          <h2 className="promo-title">
            35% off only this friday <br /> and get special gift
          </h2>
          <button className="promo-btn">Grab it now →</button>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="newsletter">
        <h2 className="newsletter-title">
          Subscribe to our newsletter to get updates <br /> to our latest
          collections
        </h2>
        <p className="newsletter-subtext">
          Get 20% off on your first order just by subscribing to our newsletter
        </p>
        <form className="newsletter-form">
  <IoMailOutline className="newsletter-icon" />
  <input
    type="email"
    placeholder="Enter your email"
    className="newsletter-input"
  />
  <button type="submit" className="newsletter-btn">
    Subscribe
  </button>
</form>
        <p className="newsletter-note">
          You will be able to unsubscribe at any time. <br />
          Read our <a href="#">Privacy Policy</a> here
        </p>
      </div>
    </div>
  );
};

export default PromoNewsletter;
