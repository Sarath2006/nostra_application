import React, { useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import { FaArrowRight } from "react-icons/fa";
import "./CartTotal.css";
import {toast} from 'react-toastify';

const CartTotal = ({ shippingFee }) => {
  const {
    currency,
    delivery_fee,
    getCartAmount,
    navigate,
    shippingFee: ctxShippingFee,
  } = useContext(StoreContext);

  // Live subtotal
  const subtotal = getCartAmount();

  // Shipping fee (only if there’s something in cart)
  const selectedShipping = typeof shippingFee === "number"
    ? shippingFee
    : typeof ctxShippingFee === "number"
    ? ctxShippingFee
    : delivery_fee;

  const shipping = subtotal > 0 ? selectedShipping : 0;

  // Total amount
  const total = subtotal + shipping;


  const handleCheckout = () => {
    if (total < 50) {
      toast.error("Minimum order value is ₹50");
      return;
    }
    navigate("/place-order");
  };

  return (
    <div className="cart-total-container">
      <div className="cart-total-box">
        <div className="cart-summary">
          <div className="summary-item">
            <span>Subtotal</span>
            <span>
              {currency}
              {subtotal.toFixed(2)}
            </span>
          </div>

          <div className="summary-item">
            <span>Shipping Fee</span>
            <span>
              {subtotal > 0 ? `${currency}${shipping.toFixed(2)}` : `${currency}0`}
            </span>
          </div>

          <div className="summary-item total">
            <span>Total</span>
            <span>
              {currency}
              {total.toFixed(2)}
            </span>
          </div>
        </div>

        <button onClick={handleCheckout} className="checkout-btn" disabled={total <= 0}>
          Proceed to Checkout
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default CartTotal;
