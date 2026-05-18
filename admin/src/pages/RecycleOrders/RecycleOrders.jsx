import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { toast } from "react-toastify";
import "./RecycleOrders.css";

const RecycleOrders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 6;
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [impactMessage, setImpactMessage] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        backendUrl + "/admin/recycle/orders",
        { headers: { token } }
      );

      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to load recycle orders");
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSendImpact = async () => {
    if (!impactMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (!selectedOrder) {
      toast.error("No order selected");
      return;
    }

    try {
      const res = await axios.post(
        backendUrl + "/admin/recycle/impact",
        {
          recycleOrderId: selectedOrder._id,
          impactMessage: impactMessage
        },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Impact message sent successfully!");
        setShowModal(false);
        setImpactMessage("");
        setSelectedOrder(null);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to send impact message");
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setImpactMessage("");
    setSelectedOrder(null);
  };

  const total = orders.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const end = Math.min(start + perPage, total);
  const visible = orders.slice(start, end);

  return (
    <div className="recycle-page">
      <h2 className="recycle-title">Recycle Orders</h2>

      {/* Header */}
      <div className="recycle-header">
        <span>Items</span>
        <span>Coins</span>
        <span>Status</span>
        <span>Date</span>
        <span>Action</span>
      </div>

      {/* Rows */}
      {visible.length === 0 ? (
        <div className="recycle-empty">No recycle orders</div>
      ) : (
        visible.map(order => (
          <div key={order._id} className="recycle-row">
            {/* Items */}
            <div className="recycle-items">
              {order.items.map((item, i) => (
                <div key={i}>
                  {item.clothType} ({item.images.length} imgs)
                </div>
              ))}
            </div>

            {/* Coins */}
            <div className="recycle-coins">
              +{order.coinsEarned}
            </div>

            {/* Status */}
            <div className={`recycle-status ${order.status}`}>
              {order.status}
            </div>

            {/* Date */}
            <div className="recycle-date">
              {new Date(order.createdAt).toLocaleDateString()}
            </div>

            {/* Action */}
            <div className="recycle-action">
              <button 
                className="impact-btn"
                onClick={() => openModal(order)}
              >
                Send Impact
              </button>
            </div>
          </div>
        ))
      )}

      {/* Impact Message Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Send Impact Message</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="modal-info">
                <p><strong>Order ID:</strong> #{selectedOrder?._id.slice(-8)}</p>
                <p><strong>User:</strong> {selectedOrder?.userId?.name || "N/A"}</p>
                <p><strong>Items:</strong> {selectedOrder?.itemCount} items</p>
                <p><strong>Coins Earned:</strong> {selectedOrder?.coinsEarned}</p>
              </div>

              <div className="modal-input">
                <label>Impact Message:</label>
                <textarea
                  value={impactMessage}
                  onChange={(e) => setImpactMessage(e.target.value)}
                  placeholder="Write a personalized impact message for this user..."
                  rows="5"
                />
              </div>

              <div className="modal-actions">
                <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button className="btn-send" onClick={handleSendImpact}>Send Message</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="recycle-footer">
        <span>
          Showing {total === 0 ? 0 : start + 1}–{end} of {total}
        </span>

        <div className="recycle-pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            Previous
          </button>

          <span className="page-active">{page}</span>

          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecycleOrders;
