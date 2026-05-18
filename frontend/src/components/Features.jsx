import React from "react";
import {  FaRegSmileWink, FaBoxOpen, FaShippingFast } from "react-icons/fa";
import { RiExchangeDollarLine } from "react-icons/ri";

import "./Features.css";

const features = [
  {
    icon: <RiExchangeDollarLine />,
    title: "Original Products",
    description: "We provide money back guarantee if the product are not original",
  },
  {
    icon: <FaRegSmileWink />,
    title: "Satisfaction Guarantee",
    description: "Exchange the product you’ve purchased if it doesn’t fit on you",
  },
  {
    icon: <FaBoxOpen />,
    title: "New Arrival Everyday",
    description: "We update our collections almost everyday",
  },
  {
    icon: <FaShippingFast />,
    title: "Fast & Free Shipping",
    description: "We offer fast and free shipping for our loyal customers",
  },
];

const Features = () => {
  return (
    <section className="features">
      <div className="features-header">
  <div className="features-title">
    <h2>
      We provide best <br />
      <span>customer experiences</span>
    </h2>
  </div>
  <div className="features-divider"></div>
  <div className="features-desc">
    <p>We ensure our customers have the best shopping experience</p>
  </div>
</div>
      <div className="features-list">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
