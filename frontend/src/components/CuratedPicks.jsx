// src/components/CuratedPicks.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import "./CuratedPicks.css";

const CuratedPicks = () => {
  const { curatedPicks } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleClick = (item) => {
    if (item.title === "Shop Women") {
      navigate("/women");
    }
  };

  return (
    <section className="curated-section">
      <h2 className="curated-title">Curated Picks</h2>
      <div className="curated-grid">
        {curatedPicks.map((item) => (
          <div key={item.id} className="curated-card" onClick={() => handleClick(item)}>
            <img src={item.img} alt={item.title} />
            <button className="curated-btn">
              {item.title} <span>→</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CuratedPicks;
