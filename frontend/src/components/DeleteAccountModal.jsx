import React, { useState } from "react";
import "./DeleteAccountModal.css";
import { FiX, FiAlertTriangle } from "react-icons/fi";

const DeleteAccountModal = ({ isOpen, onClose, onConfirm, loading }) => {
  const [confirmText, setConfirmText] = useState("");

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (confirmText.toLowerCase() === "delete") {
      onConfirm();
    }
  };

  if (!isOpen) return null;

  const isDeleteEnabled = confirmText.toLowerCase() === "delete";

  return (
    <div className="delete-account-modal-overlay" onClick={handleOverlayClick}>
      <div className="delete-account-modal-content">
        <button
          className="delete-account-modal-close"
          onClick={onClose}
          disabled={loading}
        >
          <FiX />
        </button>

        <div className="delete-account-modal-icon">
          <FiAlertTriangle />
        </div>

        <div className="delete-account-modal-header">
          <h2>Delete Account?</h2>
          <p>
            This action is permanent and cannot be undone. All your data will be
            permanently deleted.
          </p>
        </div>

        <div className="delete-account-warning-box">
          <div className="delete-account-warning-title">
            The following data will be permanently deleted:
          </div>
          <ul className="delete-account-warning-list">
            <li>Your personal information and profile</li>
            <li>All your orders and order history</li>
            <li>Shopping cart and saved items</li>
            <li>Wallet balance and transactions</li>
            <li>All product reviews</li>
            <li>Recycle/ReWear submissions</li>
          </ul>
        </div>

        <div>
          <label
            htmlFor="confirm-delete"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.9rem",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Type <strong>DELETE</strong> to confirm
          </label>
          <input
            id="confirm-delete"
            type="text"
            className="delete-account-confirmation-input"
            placeholder="Type DELETE here"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={loading}
            autoComplete="off"
          />
        </div>

        <div className="delete-account-modal-actions">
          <button
            className="delete-account-btn delete-account-btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="delete-account-btn delete-account-btn-delete"
            onClick={handleConfirm}
            disabled={!isDeleteEnabled || loading}
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
