// orders.jsx
import React, { useContext, useEffect, useState } from "react";
import "./orders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Orders = () => {
  const { backendUrl, token, currency, delivery_fee } = useContext(StoreContext);
  const [orderData, setOrderData] = useState([]);

  const [currentOrder, setCurrentOrder] = useState(null);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const orders = response.data.orders.reverse();

        if (!orders.length) return;

        // Set current order to the latest
        setCurrentOrder(orders[0]);

        // Set all orders with their details
        setOrderData(orders);
      }
    } catch (error) {
      console.error("Order fetch error:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="order-page">
      <div className="order-container">
        <h2 className="order-header-title">Your Orders</h2>

        {orderData.length === 0 && (
          <div className="order-card" style={{ textAlign: "center", padding: "32px" }}>
            <p style={{ color: "#6b7280", margin: 0 }}>You have no orders yet.</p>
          </div>
        )}

        {orderData.map((order, index) => {
          const total = Number(order.amount || 0);
          return (
            <div className="order-card" key={index}>
              <div className="order-header-row">
                <div className="order-meta">
                  <div className="meta-block">
                    <span className="meta-label">Order Number</span>
                    <span className="meta-value">#{order._id?.substring(0, 8) || "—"}</span>
                  </div>
                  <div className="meta-block">
                    <span className="meta-label">Order Date</span>
                    <span className="meta-value">
                      {order.date
                        ? new Date(order.date).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>
                  <div className="meta-block">
                    <span className="meta-label">Total Amount</span>
                    <span className="meta-value">{currency}{total.toFixed(2)}</span>
                  </div>
                  <div className="meta-block">
                    <span className="meta-label">Status</span>
                    <span className="meta-status">{order.status || "Order Placed"}</span>
                  </div>
                </div>

                <div className="order-actions">
                  <button className="ghost-btn" type="button">View Invoice</button>
                  <button className="primary-btn" type="button">View Order</button>
                </div>
              </div>

              <div className="order-items">
                {order.items?.map((item, itemIdx) => (
                  <div className="order-item" key={`${index}-${itemIdx}`}>
                    <img
                      className="item-thumb"
                      src={
                        Array.isArray(item.image)
                          ? item.image[0]
                          : item.image || "https://via.placeholder.com/120"
                      }
                      alt={item.name}
                    />

                    <div className="item-info">
                      <div className="item-title">{item.name}</div>
                      <div className="item-desc">
                        {item.description || item.desc || item.category || ""}
                      </div>
                      <div className="item-meta">
                        Size: {item.size || "-"} &nbsp; | &nbsp; Qty: {item.quantity || 1}
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                      <div className="item-price">{currency}{item.price}</div>
                      <div className="item-links">
                        <Link
                          className="item-link"
                          to={`/product/${item.productId || item._id || ""}`}
                          onClick={() => window.scrollTo(0, 0)}
                        >
                          View Product
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <span className="summary-label">Subtotal:</span>
                <span className="summary-value">{currency}{total.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
