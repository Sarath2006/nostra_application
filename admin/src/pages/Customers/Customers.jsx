import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { toast } from "react-toastify";
import "./Customers.css";
import { FiUser, FiMail, FiPhone, FiCalendar, FiX } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";

const Customers = ({ token }) => {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const perPage = 8;

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(
        backendUrl + "/api/user/all-customers",
        { headers: { token } }
      );

      if (res.data.success) {
        setCustomers(res.data.customers || []);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to load customers");
      setCustomers([]);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomerDetails = async (customerId) => {
    setLoading(true);
    try {
      const res = await axios.post(
        backendUrl + "/api/user/customer-detailed-info",
        { customerId },
        { headers: { token } }
      );

      if (res.data.success) {
        setCustomerDetails(res.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to load customer details");
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (customer) => {
    setSelectedCustomer(customer);
    fetchCustomerDetails(customer._id);
  };

  const closeDetails = () => {
    setSelectedCustomer(null);
    setCustomerDetails(null);
  };

  // Filter customers based on search
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

  const total = filteredCustomers.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const end = Math.min(start + perPage, total);
  const visible = filteredCustomers.slice(start, end);

  return (
    <div className="customers-page">
      <div className="customers-header">
        <h2 className="customers-title">Customers</h2>
        <p className="customers-subtitle">Manage and view all customer details</p>
      </div>

      {/* Search Bar */}
      <div className="customers-search">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="search-input"
        />
        <span className="search-count">
          {total > 0 ? `${start + 1}–${end} of ${total}` : "No customers"}
        </span>
      </div>

      {/* Customers Grid */}
      {visible.length === 0 ? (
        <div className="customers-empty">
          {searchTerm ? "No customers found matching your search" : "No customers yet"}
        </div>
      ) : (
        <div className="customers-grid">
          {visible.map((customer) => (
            <div key={customer._id} className="customer-card">
              <div className="customer-avatar">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              
              <div className="customer-info">
                <h3 className="customer-name">
                  <FiUser className="info-icon" />
                  {customer.name}
                </h3>
                
                <p className="customer-detail">
                  <FiMail className="info-icon" />
                  {customer.email}
                </p>

                {customer.phone && (
                  <p className="customer-detail">
                    <FiPhone className="info-icon" />
                    {customer.phone}
                  </p>
                )}

                <p className="customer-detail">
                  <FiCalendar className="info-icon" />
                  Joined {new Date(customer.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="customer-actions">
                <button 
                  className="btn-view"
                  onClick={() => openDetails(customer)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && customerDetails && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-header-content">
                <div className="modal-avatar-large">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2>{selectedCustomer.name}</h2>
                  <p>{selectedCustomer.email}</p>
                </div>
              </div>
              <button className="modal-close" onClick={closeDetails}>
                <AiOutlineClose size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {loading ? (
                <div className="loading">Loading details...</div>
              ) : (
                <>
                  {/* Customer Info */}
                  <div className="detail-section">
                    <h3>Personal Information</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Name</label>
                        <p>{customerDetails.user.name}</p>
                      </div>
                      <div className="info-item">
                        <label>Email</label>
                        <p>{customerDetails.user.email}</p>
                      </div>
                      <div className="info-item">
                        <label>Phone</label>
                        <p>{customerDetails.user.phone || "Not provided"}</p>
                      </div>
                      <div className="info-item">
                        <label>Joined Date</label>
                        <p>{new Date(customerDetails.user.joinedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="detail-section">
                    <h3>Statistics</h3>
                    <div className="stats-grid">
                      <div className="stat-box">
                        <div className="stat-number">{customerDetails.stats.totalOrders}</div>
                        <div className="stat-label">Total Orders</div>
                      </div>
                      <div className="stat-box">
                        <div className="stat-number">₹{customerDetails.stats.totalSpent.toFixed(2)}</div>
                        <div className="stat-label">Total Spent</div>
                      </div>
                      <div className="stat-box">
                        <div className="stat-number">{customerDetails.stats.totalRecycled}</div>
                        <div className="stat-label">Items Recycled</div>
                      </div>
                      <div className="stat-box">
                        <div className="stat-number">{customerDetails.stats.totalReviews}</div>
                        <div className="stat-label">Reviews</div>
                      </div>
                      <div className="stat-box">
                        <div className="stat-number">{customerDetails.stats.walletBalance}</div>
                        <div className="stat-label">Wallet Balance</div>
                      </div>
                      <div className="stat-box">
                        <div className="stat-number">{customerDetails.stats.coinsEarned}</div>
                        <div className="stat-label">Coins Earned</div>
                      </div>
                    </div>
                  </div>

                  {/* Orders */}
                  {customerDetails.orders.length > 0 && (
                    <div className="detail-section">
                      <h3>Orders ({customerDetails.orders.length})</h3>
                      <div className="table-container">
                        <table className="detail-table">
                          <thead>
                            <tr>
                              <th>Order ID</th>
                              <th>Items</th>
                              <th>Amount</th>
                              <th>Status</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customerDetails.orders.map((order) => (
                              <tr key={order._id}>
                                <td>#{order._id.slice(-6)}</td>
                                <td>{order.items.length}</td>
                                <td>₹{order.totalAmount}</td>
                                <td><span className={`status ${order.status}`}>{order.status}</span></td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Wallet Transactions */}
                  {customerDetails.walletTransactions.length > 0 && (
                    <div className="detail-section">
                      <h3>Wallet Transactions ({customerDetails.walletTransactions.length})</h3>
                      <div className="table-container">
                        <table className="detail-table">
                          <thead>
                            <tr>
                              <th>Type</th>
                              <th>Coins</th>
                              <th>Reason</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customerDetails.walletTransactions.map((txn, idx) => (
                              <tr key={idx}>
                                <td><span className={`txn-type ${txn.type}`}>{txn.type}</span></td>
                                <td>{txn.coins}</td>
                                <td>{txn.reason}</td>
                                <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Recycle Orders */}
                  {customerDetails.recycleOrders.length > 0 && (
                    <div className="detail-section">
                      <h3>Recycle Orders ({customerDetails.recycleOrders.length})</h3>
                      <div className="table-container">
                        <table className="detail-table">
                          <thead>
                            <tr>
                              <th>Order ID</th>
                              <th>Items</th>
                              <th>Coins Earned</th>
                              <th>Status</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customerDetails.recycleOrders.map((order) => (
                              <tr key={order._id}>
                                <td>#{order._id.slice(-6)}</td>
                                <td>{order.itemCount}</td>
                                <td>+{order.coinsEarned}</td>
                                <td><span className={`status ${order.status}`}>{order.status}</span></td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Reviews */}
                  {customerDetails.reviews.length > 0 && (
                    <div className="detail-section">
                      <h3>Reviews ({customerDetails.reviews.length})</h3>
                      <div className="reviews-list">
                        {customerDetails.reviews.map((review) => (
                          <div key={review._id} className="review-item">
                            <div className="review-header">
                              <strong>{review.productName}</strong>
                              <span className="rating">⭐ {review.rating}</span>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                            <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="customers-footer">
          <div className="pagination">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="pagination-btn"
            >
              Previous
            </button>

            <span className="page-indicator">{page} of {totalPages}</span>

            <button 
              disabled={page === totalPages} 
              onClick={() => setPage(p => p + 1)}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
