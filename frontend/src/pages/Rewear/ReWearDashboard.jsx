import React, { useContext, useState, useEffect } from 'react'
import { LuCoins, LuPackage, LuClipboardList } from "react-icons/lu";
import { Link } from "react-router-dom";
import { TbRecycle } from "react-icons/tb";
import "./ReWearDashboard.css"
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext.jsx';

const ReWearDashboard = () => {

  const { backendUrl, token } = useContext(StoreContext);

  const [stats, setStats] = useState({
    totalCoins: 0,
    totalCoinsEarned: 0,
    totalItems: 0,
    totalOrders: 0
  });

  const [orders, setOrders] = useState([]);
  const [impactMessages, setImpactMessages] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          backendUrl + "/api/recycle/dashboard",
          { headers: { token } }
        );

        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (token) fetchStats();
  }, [token, backendUrl]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          backendUrl + "/api/recycle/my",
          { headers: { token } }
        );

        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (token) fetchOrders();
  }, [token, backendUrl]);

  useEffect(() => {
    const fetchImpactMessages = async () => {
      try {
        const res = await axios.get(
          backendUrl + "/api/recycle/impact-messages",
          { headers: { token } }
        );

        if (res.data.success) {
          setImpactMessages(res.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (token) fetchImpactMessages();
  }, [token, backendUrl]);

  return (
    <div className="rewear-container">
      {/* Header */}
      <div className="rewear-header">
        <h1>Recycle Dashboard</h1>
        <p>Recycle your clothes. Earn rewards. Reduce waste.</p>
      </div>

      {/* Stats Cards */}
      <div className="rewear-stats">
        <div className="stat-card">
          <LuCoins className='stat-icon' />
          <span className="stat-value">{stats.totalCoins}</span>
          <p>Available Coins</p>
        </div>

        <div className="stat-card">
          <LuCoins className='stat-icon' />
          <span className="stat-value">{stats.totalCoinsEarned}</span>
          <p>Lifetime Coins Earned</p>
        </div>

        <div className="stat-card">
          <LuPackage className='stat-icon' />
          <span className="stat-value">{stats.totalItems}</span>
          <p>Total Items Recycled</p>
        </div>

        <div className="stat-card">
          <LuClipboardList className='stat-icon' />
          <span className="stat-value">{stats.totalOrders}</span>
          <p>Recycle Orders</p>
        </div>
      </div>

      {/* Wallet Section */}
      <div className="wallet-card">
        <div className="wallet-header">
          <div>
            <h3>Wallet Balance</h3>
            <p>Available coins to redeem</p>
          </div>
          <div className="wallet-coins">
            <h2>{stats.totalCoins}</h2>
            <span>COINS</span>
          </div>
        </div>

        <div className="wallet-note">
          <p>Use these coins for discounts on new products. Recycle your old clothes to keep earning and cut waste.</p>
        </div>

        <Link to="/rewear/upload">
          <button className="rewear-btn">+ RECYCLE OLD CLOTHES</button>
        </Link>      </div>

      {/* Impact Messages Section */}
      {impactMessages.length > 0 && (
        <div className="impact-messages-section">
          <h3>Your Impact Messages</h3>
          <div className="impact-messages-list">
            {impactMessages
              .filter((msg) => {
                const messageDate = new Date(msg.createdAt);
                const currentDate = new Date();
                const daysDifference = (currentDate - messageDate) / (1000 * 60 * 60 * 24);
                return daysDifference < 2;
              })
              .map((msg) => (
                <div key={msg._id} className="impact-message-card">
                  <div className="impact-icon">
                    <TbRecycle size={24} />
                  </div>
                  <div className="impact-content" key={msg._id}>
                    <p>{msg.message}</p>
                    <span className="impact-date">
                      {new Date(msg.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="msg-id">
                      #{msg._id.slice(-6)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="orders-section">
        <h3>Recent Recycle Orders</h3>

        <div className="orders-table">
          <div className="table-head">
            <span>ORDER ID</span>
            <span>ITEMS</span>
            <span>STATUS</span>
            <span>COINS EARNED</span>
            <span>DATE</span>
          </div>

          {orders.length === 0 ? (
            <div className="table-empty">
              No orders yet. Start recycling today!
            </div>
          ) : (
            orders.slice(0, 5).map((order) => (
              <div className="table-row" key={order._id}>
                <span className="order-id">
                  #{order._id.slice(-6)}
                </span>

                <span>
                  {order.itemCount} item{order.itemCount > 1 ? "s" : ""}
                </span>

                <span className={`status ${order.status}`}>
                  {order.status}
                </span>

                <span>{order.coinsEarned}</span>

                <span>
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReWearDashboard;
