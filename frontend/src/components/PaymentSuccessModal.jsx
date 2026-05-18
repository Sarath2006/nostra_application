import React, { useEffect, useState, useRef } from "react";
import anime from "animejs";
import "./PaymentSuccessModal.css";

const PaymentSuccessModal = ({ open, onClose, amount, orderId, date, onDownload, onPrint }) => {
  if (!open) return null;
  
  const checkPathRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    if (open) {
      
      // Animate only the checkmark with anime.js
      if (checkPathRef.current) {
        // Circle appears immediately
        if (circleRef.current) {
          anime.set(circleRef.current, { scale: 1, opacity: 1 });
        }
        
        // Checkmark stroke draw animation only
        const pathLength = checkPathRef.current.getTotalLength ? checkPathRef.current.getTotalLength() : 60;
        
        anime.set(checkPathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
          opacity: 1
        });
        
        anime({
          targets: checkPathRef.current,
          strokeDashoffset: [pathLength, 0],
          duration: 600,
          delay: 200,
          easing: 'easeInOutQuad'
        });
      }
    }
  }, [open]);

  const d = date ? new Date(date) : new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const formattedDate = `${dd}-${mm}-${yyyy}`;

  return (
    <div className="psm-overlay" role="dialog" aria-modal="true">
      <div className="psm-modal">
        <button className="psm-close" aria-label="Close" onClick={onClose}>
          ×
        </button>

        {/* Success checkmark circle */}
        <div className="psm-success-circle-wrapper" aria-hidden>
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle ref={circleRef} cx="50" cy="50" r="45" fill="#10B981" opacity="0.1"/>
            <circle ref={circleRef} cx="50" cy="50" r="45" stroke="#10B981" strokeWidth="2"/>
            <path ref={checkPathRef} d="M30 50L45 65L70 35" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>

        <h2 className="psm-title">Payment Successful!</h2>
        <p className="psm-subtitle">Payment successful! Your transaction has been processed smoothly.</p>

        <div className="psm-amount-label">Amount</div>
        <div className="psm-amount">{amount}</div>
        <div className="psm-meta">
          <span>{formattedDate}</span>
          <span className="psm-dot">•</span>
          <span>Order ID: {orderId}</span>
        </div>

        <div className="psm-actions">
          <button className="psm-btn" onClick={onDownload}>
            <span className="psm-btn-icon pdf" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="2" width="14" height="20" rx="2" fill="#EF4444"/>
                <path d="M7 8h6M7 12h6M7 16h4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </span>
            Download
          </button>
          <button className="psm-btn outline" onClick={onPrint}>
            <span className="psm-btn-icon printer" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7V3h10v4" stroke="#111827" strokeWidth="1.6"/>
                <rect x="4" y="9" width="16" height="8" rx="2" stroke="#111827" strokeWidth="1.6"/>
                <rect x="7" y="15" width="10" height="6" fill="#E5E7EB" stroke="#111827" strokeWidth="1.4"/>
              </svg>
            </span>
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
