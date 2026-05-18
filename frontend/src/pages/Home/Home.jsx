import React, { useState, useContext, useRef, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import './Home.css';
import IMAGES from '../../assets/assests.js';
import Brands from '../../components/Brands.jsx';
import Features from '../../components/Features.jsx';
import CuratedPicks from '../../components/CuratedPicks.jsx';
import { StoreContext } from '../../context/StoreContext.jsx';
import FeaturedProducts from '../../components/FeaturedProducts.jsx';
import PromoNewsletter from '../../components/PromoNewsletter.jsx';
import Footer from '../../components/Footer.jsx';
import { GoArrowRight } from "react-icons/go";

const slides = [
  {
    image: IMAGES.firstslider,
    title: "Level up your style with our summer collections",
    button: "Shop now",
  },
  {
    image: IMAGES.secslider,
    title: "Discover the latest fashion trends",
    button: "Explore",
  },
  {
    image: IMAGES.thirdslider,
    title: "Upgrade your wardrobe today",
    button: "Get Started",
  },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const { curatedPicks } = useContext(StoreContext);

  // Refs for sections
  const brandsRef = useRef(null);
  const featuresRef = useRef(null);
  const curatedRef = useRef(null);
  const featuredRef = useRef(null);
  const promoRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const revealSections = [brandsRef, featuresRef, curatedRef, featuredRef, promoRef, footerRef];
    const onScroll = () => {
      revealSections.forEach(ref => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top < window.innerHeight - 100) {
            ref.current.classList.add('reveal');
          }
        }
      });
    };
    window.addEventListener('scroll', onScroll);
    onScroll(); // Initial check
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  return (
    <>
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === current ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {index === current && (
              <div className="slide-content">
                <h2>{slide.title}</h2>
                <button>{slide.button} <GoArrowRight className='right-arrow'/></button>
                <div className="dots">
                  {slides.map((_, i) => (
                    <span
                      key={i}
                      className={`dot ${i === current ? "active" : ""}`}
                      onClick={() => setCurrent(i)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        <FiChevronLeft className="arrow left" onClick={prevSlide} />
        <FiChevronRight className="arrow right" onClick={nextSlide} />
      </div>
      <div ref={brandsRef} className="scroll-section">
        <Brands />
      </div>
      <div ref={featuresRef} className="scroll-section">
        <Features />
      </div>
      <div ref={curatedRef} className="scroll-section">
        <CuratedPicks items={curatedPicks} />
      </div>
      <div ref={featuredRef} className="scroll-section">
        <FeaturedProducts />
      </div>
      <div ref={promoRef} className="scroll-section">
        <PromoNewsletter />
      </div>
      {/* Footer removed: now rendered globally in App.jsx */}
    </>
  );
}
