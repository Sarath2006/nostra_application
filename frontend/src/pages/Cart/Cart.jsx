import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Cart.css";
import { AiOutlineDelete } from "react-icons/ai";
import CartTotal from "../../components/CartTotal";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    navigate,
    shippingFee,
    setShippingFee,
    backendUrl,
    token,
  } = useContext(StoreContext);

  const [cartData, setCartData] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const homeDeliveryFee = 9.99;

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  // Fetch delivery address from backend
  useEffect(() => {
    const fetchAddress = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${backendUrl}/api/user/profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json", token },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        // Debug log
        console.log("Profile response:", data);
        if (data.success && data.user && data.user.addresses && Array.isArray(data.user.addresses) && data.user.addresses.length > 0) {
          setDeliveryAddress(data.user.addresses);
        } else {
          setDeliveryAddress(null);
        }
      } catch (err) {
        setDeliveryAddress(null);
      }
    };
    fetchAddress();
  }, [backendUrl, token]);

  return (
    <div className="cart-page">
      <div className="cart-shell">
        <div className="cart-topbar">
          <h1 className="cart-title">My Cart</h1>
          <button className="cart-continue" onClick={() => navigate("/")}>
            <span className="cart-continue-icon">{"<"}</span>
            Continue shopping
          </button>
        </div>

        {cartData.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-header">
              <span>PRODUCT</span>
              <span>PRICE</span>
              <span>QTY</span>
              <span>TOTAL</span>
            </div>

            {cartData.map((item, index) => {
              const productData = products.find(
                (product) => String(product._id) === String(item._id)
              );

              if (!productData) return null;

              const lineTotal = (Number(productData.price) || 0) * item.quantity;

              return (
                <div key={index} className="cart-row">
                  <div className="cart-product">
                    <img
                      src={
                        Array.isArray(productData.image)
                          ? productData.image[0]
                          : productData.image
                      }
                      alt={productData.name}
                      className="cart-img"
                    />
                    <div>
                      <p className="cart-name">{productData.name}</p>
                      <p className="cart-meta">Size: {item.size}</p>
                      <p className="cart-meta">ID: #{item._id.slice(-6)}</p>
                    </div>
                  </div>

                  <p className="cart-price">
                    {currency}
                    {productData.price}
                  </p>

                  <div className="cart-quantity">
                    <button
                      onClick={() =>
                        item.quantity > 1 &&
                        updateQuantity(item._id, item.size, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        e.target.value === "" || e.target.value === "0"
                          ? null
                          : updateQuantity(
                              item._id,
                              item.size,
                              Number(e.target.value)
                            )
                      }
                    />
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.size, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <p className="cart-line-total">
                    {currency}
                    {lineTotal.toFixed(2)}
                  </p>

                  <button
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    className="cart-delete"
                    aria-label="Remove item"
                  >
                    <AiOutlineDelete size={20} />
                  </button>
                </div>
              );
            })}

            <div className="cart-bottom-panel">
              <div className="shipping-box">
                <h3>Choose shipping mode:</h3>
                <label className="ship-option">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingFee === 0}
                    onChange={() => setShippingFee(0)}
                  />
                  <div>
                    <div className="ship-row">
                      <span>Store pickup (in 20 min)</span>
                      <span className="ship-price">FREE</span>
                    </div>
                    <p className="ship-note">Pick up from your nearest store</p>
                  </div>
                </label>

                <label className="ship-option">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingFee === homeDeliveryFee}
                    onChange={() => setShippingFee(homeDeliveryFee)}
                  />
                  <div>
                    <div className="ship-row">
                      <span>Delivery at home (under 2 - 4 days)</span>
                      <span className="ship-price">{currency}{homeDeliveryFee.toFixed(2)}</span>
                    </div>
                    <p className="ship-note">
                      {deliveryAddress && Array.isArray(deliveryAddress) && deliveryAddress.length > 0 ? (
                        <>
                          {deliveryAddress.map((addr, idx) => (
                            <div key={idx} style={{ marginBottom: '8px' }}>
                              <strong>{addr.name}</strong><br />
                              {addr.street}, {addr.city}, {addr.state}, {addr.zipcode}, {addr.country}<br />
                              <span style={{ fontWeight: 'bold' }}>{addr.phone}</span>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          No delivery address found. Add in profile.
                        </>
                      )}
                    </p>
                  </div>
                </label>
              </div>

              <CartTotal shippingFee={shippingFee} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
