import React, { useCallback, useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./PlaceOrder.css";
import { HiMiniXMark } from "react-icons/hi2";
import axios from "axios";
import { toast } from "react-toastify";
import PaymentSuccessModal from "../../components/PaymentSuccessModal";
import jsPDF from "jspdf";

const initialDiscountState = {
  checking: false,
  offer: null,
  walletBalance: 0,
  eligible: false,
  cooldownDays: null,
  message: "",
};

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { products, cartItems, currency, delivery_fee, shippingFee } = useContext(StoreContext);
  const { navigate, backendUrl, token, setCartItems, getCartAmount } = useContext(StoreContext);
  const location = window.location;
  let directOrder = null;
  try {
    // Use react-router location state if available
    if (window.history.state && window.history.state.usr && window.history.state.usr.directOrder) {
      directOrder = window.history.state.usr.directOrder;
    }
  } catch {}
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    country: "",
    paymentMethod: "",
  });


  const [cartData, setCartData] = useState([]);
  const [discountState, setDiscountState] = useState(initialDiscountState);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [applyingCoins, setApplyingCoins] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [receipt, setReceipt] = useState(null); // {orderId, amount, date}

  useEffect(() => {
    if (directOrder) {
      setCartData([{ _id: directOrder._id, size: directOrder.size, quantity: directOrder.quantity }]);
    } else {
      const tempData = [];
      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            tempData.push({
              _id: itemId,
              size: size,
              quantity: cartItems[itemId][size],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, directOrder]);


  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const updateLocalQuantity = (id, size, newQty) => {
    setCartData(
      (prev) =>
        prev
          .map((item) =>
            item._id === id && item.size === size
              ? { ...item, quantity: Math.max(newQty, 0) }
              : item
          )
          .filter((item) => item.quantity > 0)
    );
  };


  const subtotal = cartData.reduce((acc, item) => {
    const product = products.find((p) => String(p._id) === String(item._id));
    return product ? acc + product.price * item.quantity : acc;
  }, 0);

  const shipping = cartData.length > 0
    ? typeof shippingFee === "number"
      ? shippingFee
      : delivery_fee
    : 0;
  const discountValue = appliedDiscount?.amount || 0;
  const total = Math.max(subtotal + shipping - discountValue, 0);

  const fetchDiscountOffer = useCallback(async () => {
    if (!token) {
      setDiscountState(initialDiscountState);
      return;
    }

    if (subtotal <= 0) {
      setDiscountState(initialDiscountState);
      return;
    }

    setDiscountState((prev) => ({ ...prev, checking: true, message: "" }));

    try {
      const { data } = await axios.post(
        backendUrl + "/api/wallet/discount",
        { cartValue: subtotal },
        { headers: { token } }
      );

      if (!data.success) {
        setDiscountState({
          ...initialDiscountState,
          message: data.message || "Could not check discount eligibility",
        });
        return;
      }

      if (data.cooldown) {
        setDiscountState({
          checking: false,
          offer: null,
          walletBalance: data.walletBalance ?? 0,
          eligible: false,
          cooldownDays: data.nextAvailableInDays ?? 0,
          message: "Discount cooldown active",
        });
        return;
      }

      if (data.eligible && data.discount) {
        setDiscountState({
          checking: false,
          offer: {
            discount: data.discount,
            coinsUsed: data.coinsRequired,
            minCart: data.minCartValue,
          },
          walletBalance: data.walletBalance ?? 0,
          eligible: true,
          cooldownDays: null,
          message: "",
        });
      } else {
        setDiscountState({
          checking: false,
          offer: null,
          walletBalance: data.walletBalance ?? 0,
          eligible: false,
          cooldownDays: null,
          message: data.message || "Add more items to unlock a coin discount",
        });
      }
    } catch (error) {
      setDiscountState({
        ...initialDiscountState,
        message: error.response?.data?.message || error.message,
      });
    }
  }, [backendUrl, subtotal, token]);

  useEffect(() => {
    if (!token) {
      setDiscountState(initialDiscountState);
      setAppliedDiscount(null);
      return;
    }

    if (appliedDiscount) return;
    fetchDiscountOffer();
  }, [token, subtotal, appliedDiscount, fetchDiscountOffer]);

  const handleApplyCoins = async () => {
    if (!discountState.offer || !discountState.eligible) {
      toast.info("No coin discount available yet");
      return;
    }

    setApplyingCoins(true);

    try {
      const { data } = await axios.post(
        backendUrl + "/api/wallet/use",
        { cartValue: subtotal },
        { headers: { token } }
      );

      if (data.success) {
        const formattedDiscount = Number(data.discountApplied || 0).toFixed(2);

        setAppliedDiscount({
          amount: Number(formattedDiscount),
          coins: data.coinsDeducted,
        });

        setDiscountState((prev) => ({
          ...prev,
          walletBalance: data.remainingCoins ?? prev.walletBalance,
          eligible: false,
          offer: null,
          message: "Discount applied",
        }));

        toast.success(`Discount applied: ${currency}${formattedDiscount}`);
      } else {
        toast.error(data.message || "Could not apply coins right now");
        fetchDiscountOffer();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setApplyingCoins(false);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {

      let orderItems = []

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      let orderData = {
        address: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: `${formData.countryCode}${formData.phone}`,
          street: formData.address,
          postalCode: formData.postalCode,
          city: formData.city,
          country: formData.country,
        },
        items: orderItems,
        amount: total,
        paymentMethod: formData.paymentMethod,
        shippingFee: cartData.length > 0 ? shipping : 0,
        discountApplied: discountValue,
        coinsUsed: appliedDiscount?.coins || 0,
      }

      switch (method) {

        case 'cod': {
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
          if (response.data.success) {
            setCartItems({})
            const { orderId, amount, date } = response.data;
            setReceipt({ orderId, amount, date });
            setSuccessOpen(true);
          } else {
            toast.error(response.data.message)
          }
          break;

        }
        case 'stripe': {

          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } })
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data
            window.location.replace(session_url)
          } else {
            toast.error(responseStripe.data.message)
          }

          break;
        }
        default:
          break;

      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)

    }
  }

  const handleCloseSuccess = () => {
    setSuccessOpen(false);
    navigate('/orders');
  }

  const downloadReceipt = () => {
    try {
      const doc = new jsPDF();
      const orderId = receipt?.orderId || "-";
      const amount = (receipt?.amount ?? total).toFixed ? (receipt?.amount ?? total).toFixed(2) : String(receipt?.amount ?? total);
      const date = receipt?.date ? new Date(receipt.date).toLocaleString() : new Date().toLocaleString();

      doc.setFontSize(18);
      doc.text("Payment Successful", 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Order ID: ${orderId}`, 20, 40);
      doc.text(`Date: ${date}`, 20, 50);
      doc.setFontSize(16);
      doc.text(`Amount: ${currency}${amount}`, 20, 70);
      doc.text("Thank you for your purchase!", 20, 90);

      doc.save(`receipt_${orderId}.pdf`);
    } catch (e) {
      toast.error('Could not generate receipt');
    }
  }

  const printReceipt = () => {
    const orderId = receipt?.orderId || "-";
    const amount = (receipt?.amount ?? total).toFixed ? (receipt?.amount ?? total).toFixed(2) : String(receipt?.amount ?? total);
    const date = receipt?.date ? new Date(receipt.date).toLocaleString() : new Date().toLocaleString();
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<!doctype html><html><head><title>Receipt</title><style>body{font-family:Arial,sans-serif;padding:24px}h1{font-size:22px;margin:0 0 12px}p{margin:6px 0}</style></head><body><h1>Payment Successful</h1><p><strong>Order ID:</strong> ${orderId}</p><p><strong>Date:</strong> ${date}</p><p><strong>Amount:</strong> ${currency}${amount}</p><p>Thank you for your purchase!</p></body></html>`);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  }

  return (
    <>
    <form onSubmit={onSubmitHandler} className="checkout-container">
      {/* LEFT SIDE - FORM */}
      <div className="checkout-left">
        <h3>Customer Details</h3>
        <div className="form-row">
          <div className="form-field">
            <label>First Name *</label>
            <input
              required
              placeholder="Sarah"
              type="text"
              name="firstName"
              onChange={onChangeHandler}
              value={formData.firstName}
            />
          </div>
          <div className="form-field">
            <label>Last Name *</label>
            <input
              required
              placeholder="Davis"
              type="text"
              name="lastName"
              onChange={onChangeHandler}
              value={formData.lastName}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Email *</label>
            <input
              required
              placeholder="mail@example.com"
              type="email"
              name="email"
              onChange={onChangeHandler}
              value={formData.email}
            />
          </div>

          <div className="form-field">
            <label>Phone Number *</label>
            <div className="phone-input-group">
              <select
                name="countryCode"
                className="country-code"
                value={formData.countryCode}
                onChange={onChangeHandler}
              >
                <option value="+91">+91 IN</option>
                <option value="+1">+1 USA</option>
                <option value="+44">+44 UK</option>
                <option value="+61">+61 AU</option>
                <option value="+971">+971 UAE</option>
              </select>
              <input
                required
                type="text"
                name="phone"
                onChange={onChangeHandler}
                value={formData.phone}
                placeholder="00000 00000"
              />
            </div>
          </div>
        </div>

        <h3>Shipping Details</h3>
        <div className="form-field">
          <label>Street Address *</label>
          <input
            required
            type="text"
            name="address"
            onChange={onChangeHandler}
            value={formData.address}
            placeholder="Alpha Plus A-1002, Raiya Telephone Exchange"
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Postal Code *</label>
            <input
              required
              type="text"
              name="postalCode"
              onChange={onChangeHandler}
              value={formData.postalCode}
              placeholder="360005"
            />
          </div>
          <div className="form-field">
            <label>City *</label>
            <input
              required
              type="text"
              name="city"
              onChange={onChangeHandler}
              value={formData.city}
              placeholder="Rajkot"
            />
          </div>
          <div className="form-field">
            <label>Country *</label>
            <select
              name="country"
              onChange={onChangeHandler}
              value={formData.country}
            >
              <option>India</option>
              <option>USA</option>
              <option>UK</option>
              <option>Australia</option>
              <option>UAE</option>
            </select>
          </div>
        </div>

        <h3>Payment Method</h3>
        <div className="payment-options">
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Stripe"
              checked={formData.paymentMethod === "Stripe"}
              onChange={onChangeHandler}
              onClick={() => setMethod('stripe')}
            />
            Stripe
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Razorpay"
              checked={formData.paymentMethod === "Razorpay"}
              onChange={onChangeHandler}
              onClick={() => setMethod('razorpay')}
            />
            Razorpay
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={formData.paymentMethod === "COD"}
              onChange={onChangeHandler}
              onClick={() => setMethod('cod')}
            />
            Cash on Delivery
          </label>
        </div>
      </div>

      {/* RIGHT SIDE - ORDER SUMMARY */}
      <div className="checkout-right">
        <h3>Order Summary</h3>
        {cartData.map((item, index) => {
          const product = products.find(
            (p) => String(p._id) === String(item._id)
          );
          if (!product) return null;

          return (
            <div className="order-item" key={index}>
              <img
                src={
                  Array.isArray(product.image)
                    ? product.image[0]
                    : product.image
                }
                alt={product.name}
              />
              <div className="order-info">
                <p className="order-name">{product.name}</p>
                <p className="order-price">
                  {currency}
                  {product.price}
                </p>
                <div className="order-qty">
                  <button
                    onClick={() =>
                      item.quantity > 1 &&
                      updateLocalQuantity(
                        item._id,
                        item.size,
                        item.quantity - 1
                      )
                    }
                  >
                    –
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateLocalQuantity(
                        item._id,
                        item.size,
                        item.quantity + 1
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="remove-item"
                onClick={() => updateLocalQuantity(item._id, item.size, 0)}
              >
                <HiMiniXMark />
              </button>
            </div>
          );
        })}

        {/* Use Coins */}
        <div className="coins-card">
          <div className="coins-header">
            <div>
              <p className="coins-title">Use Coins</p>
              <p className="coins-subtitle">Redeem your wallet coins for instant savings.</p>
            </div>
            <div className="coins-pill">{discountState.walletBalance || 0} coins</div>
          </div>

          {!token && (
            <div className="coins-note">Login to check and redeem your coin discount.</div>
          )}

          {token && appliedDiscount && (
            <div className="coins-applied">
              <div>
                <span className="coins-success-label">Discount applied</span>
                <p className="coins-applied-amount">Saved {currency}{appliedDiscount.amount}</p>
                <p className="coins-applied-coins">{appliedDiscount.coins} coins spent</p>
              </div>
            </div>
          )}

          {token && !appliedDiscount && (
            <>
              {discountState.checking && (
                <div className="coins-note">Checking eligibility...</div>
              )}

              {discountState.cooldownDays && (
                <div className="coins-note warning">
                  Cooldown active. Try again in {discountState.cooldownDays} day(s).
                </div>
              )}

              {!discountState.checking && !discountState.cooldownDays && discountState.offer && (
                <div className="coins-offer">
                  <div className="coins-offer-left">
                    <p className="coins-offer-save">Save {currency}{discountState.offer.discount}</p>
                    <p className="coins-offer-text">Use {discountState.offer.coinsUsed} coins</p>
                  </div>
                  <div className="coins-offer-meta">Min cart {currency}{discountState.offer.minCart}</div>
                </div>
              )}

              {!discountState.checking && !discountState.cooldownDays && !discountState.offer && (
                <div className="coins-note">{discountState.message || "Add a bit more to unlock coin savings."}</div>
              )}

              <div className="coins-actions">
                <button
                  type="button"
                  className="coins-btn primary"
                  onClick={handleApplyCoins}
                  disabled={
                    !discountState.offer ||
                    !discountState.eligible ||
                    discountState.checking ||
                    applyingCoins
                  }
                >
                  {applyingCoins ? "Applying…" : "Use coins now"}
                </button>
                <button
                  type="button"
                  className="coins-btn ghost"
                  onClick={fetchDiscountOffer}
                  disabled={discountState.checking}
                >
                  Refresh
                </button>
              </div>
            </>
          )}
        </div>

        {/* Totals */}
        <div className="summary-totals">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>
              {currency}
              {subtotal.toFixed(2)}
            </span>
          </div>
          <div className="summary-row">
            <span>Shipping Charge</span>
            <span>
              {currency}
              {shipping.toFixed(2)}
            </span>
          </div>
          {discountValue > 0 && (
            <div className="summary-row discount-row">
              <span>Coins Discount</span>
              <span>
                -{currency}
                {discountValue.toFixed(2)}
              </span>
            </div>
          )}
          <div className="summary-total">
            <span>Total</span>
            <span>
              {currency}
              {total.toFixed(2)}
            </span>
          </div>
        </div>

        <button type='submit' className="checkout-btn">
          Place Order
        </button>
      </div>
    </form>
    <PaymentSuccessModal 
      open={successOpen}
      onClose={handleCloseSuccess}
      amount={`${currency}${(receipt?.amount ?? total).toFixed ? (receipt?.amount ?? total).toFixed(2) : (receipt?.amount ?? total)}`}
      orderId={receipt?.orderId}
      date={receipt?.date}
      onDownload={downloadReceipt}
      onPrint={printReceipt}
    />
    </>
  );
};

export default PlaceOrder;
