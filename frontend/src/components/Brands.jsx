import React from "react";
import "./Brands.css";
import IMAGES from "../assets/assests";

const brands = [
  IMAGES.chanel,
  IMAGES.ck,
  IMAGES.guess,
  IMAGES.gucci,
  IMAGES.dg,
  IMAGES.addidas,
  IMAGES.levis,
  IMAGES.versace,
];

export default function Brands() {
  return (
    <div className="brands-section">
  <h2 className="brands-title">Brands</h2>
  <div className="brands-slider">
    {brands.map((logo, index) => (
      <div
        className={`brand-logo ${logo === IMAGES.addidas ? "brand-large" : ""}`}
        key={index}
      >
        <img src={logo} alt={`brand-${index}`} />
      </div>
    ))}
  </div>
</div>
  );
}
