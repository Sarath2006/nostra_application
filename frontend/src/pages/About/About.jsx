import React from 'react'
import { TbTargetArrow } from "react-icons/tb";
import { BsStars } from "react-icons/bs";
import './About.css'

const About = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About NOSTRA</h1>
          <p>Redefining Fashion Through Quality, Style, and Sustainability</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="about-section">
        <div className="about-content">
          <div className="section-text">
            <h2>Our Story</h2>
            <p>
              NOSTRA was born from a passion for quality fashion and a commitment to sustainable living. 
              We believe that everyone deserves to look and feel their best without compromising on values 
              or breaking the bank.
            </p>
            <p>
              Founded with a vision to revolutionize the way people shop for fashion, we've dedicated ourselves 
              to curating collections that speak to the modern, conscious consumer who values both style and substance.
            </p>
          </div>
          <div className="section-image about-image-1">
            <div className="image-placeholder">Quality Fashion</div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="about-section mission-section">
        <h2>Our Mission & Vision</h2>
        <div className="mission-grid">
          <div className="mission-card">
            <div className="mission-icon"><TbTargetArrow /></div>
            <h3>Our Mission</h3>
            <p>
              To provide high-quality, stylish, and sustainable fashion that empowers individuals 
              to express their unique identity while contributing to a better future.
            </p>
          </div>
          <div className="mission-card">
            <div className="mission-icon"><BsStars /></div>
            <h3>Our Vision</h3>
            <p>
              To become the go-to destination for conscious fashion lovers who refuse to compromise 
              on style, quality, or environmental responsibility.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="about-section values-section">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-number">01</div>
            <h3>Quality First</h3>
            <p>We never compromise on quality. Every piece is carefully selected and crafted to last.</p>
          </div>
          <div className="value-card">
            <div className="value-number">02</div>
            <h3>Sustainability</h3>
            <p>We're committed to reducing our environmental footprint through sustainable practices.</p>
          </div>
          <div className="value-card">
            <div className="value-number">03</div>
            <h3>Inclusivity</h3>
            <p>Fashion is for everyone. We celebrate diversity and cater to all styles and sizes.</p>
          </div>
          <div className="value-card">
            <div className="value-number">04</div>
            <h3>Innovation</h3>
            <p>We constantly evolve to bring you the latest trends while maintaining timeless classics.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="about-section why-section">
        <h2>Why Choose NOSTRA?</h2>
        <div className="why-features">
          <div className="why-feature">
            <h3>✓ Curated Collections</h3>
            <p>Handpicked pieces from trusted brands and designers</p>
          </div>
          <div className="why-feature">
            <h3>✓ Affordable Luxury</h3>
            <p>Premium quality at prices that make sense</p>
          </div>
          <div className="why-feature">
            <h3>✓ Fast Shipping</h3>
            <p>Get your favorites delivered quickly and safely</p>
          </div>
          <div className="why-feature">
            <h3>✓ Easy Returns</h3>
            <p>Hassle-free returns within 30 days</p>
          </div>
          <div className="why-feature">
            <h3>✓ Sustainability</h3>
            <p>Shop our Rewear collection for pre-loved fashion</p>
          </div>
          <div className="why-feature">
            <h3>✓ Expert Support</h3>
            <p>Dedicated customer service ready to help</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <h2>Ready to Discover Your Style?</h2>
        <p>Explore our collections and find pieces that truly represent you</p>
        <a href="/collection" className="cta-button">Shop Now</a>
      </section>
    </div>
  )
}

export default About
