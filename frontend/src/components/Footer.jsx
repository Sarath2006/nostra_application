import React from "react";
import "./Footer.css";
import { FaPaypal } from "react-icons/fa";
import StripeLogo from "../assets/stripe_logo.png";
import RazorpayLogo from "../assets/razor.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo + Description */}
        <div className="footer-col">
          <h2 className="footer-logo">NOSTRA</h2>
          <p className="footer-text">
            Specializes in providing high-quality, stylish products for your
            wardrobe
          </p>
        </div>
    
        {/* Shop Section */}
        <div className="footer-col">
          <h4 className="footer-title">SHOP</h4>
          <ul>
            <li><a href="/collection">All Collections</a></li>
            <li><a href="#">Winter Edition</a></li>
            <li><a href="#">Discount</a></li>
          </ul>
        </div>

        {/* Company Section */}
        <div className="footer-col">
          <h4 className="footer-title">COMPANY</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><a href="#">Affiliates</a></li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="footer-col">
          <h4 className="footer-title">SUPPORT</h4>
          <ul>
            <li><Link to="/faq">FAQs</Link></li>
            <li><a href="#">Cookie Policy</a></li>
            <li><a href="#">Terms of Use</a></li>
          </ul>
        </div>

        {/* Payment Methods */}
        <div className="footer-col">
          <h4 className="footer-title">PAYMENT METHODS</h4>
          <div className="payment-icons">
            <img src={StripeLogo} alt="Stripe" style={{ height: 25 }} />
            <img src={RazorpayLogo} alt="Razorpay" style={{ height: 40, marginTop: -12, marginLeft: 10 }} />
            <FaPaypal size={28} color="#00457C" />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright ©2025 Nostra. All right reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
