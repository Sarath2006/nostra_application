import React, { useState, useContext } from 'react'
import { StoreContext } from '../../context/StoreContext.jsx'
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";
import "./RewearUpload.css"
import axios from 'axios';

const MAX_ITEMS = 5;
const MIN_IMAGES = 3;
const MAX_IMAGES = 5;

const RewearUpload = () => {

  const [items, setItems] = useState([
    { clothType: "", materialType: "", images: [] },
  ]);

  const [pickup, setPickup] = useState({
    address: { line1: "", city: "", state: "", pincode: "" },
    preferredDate: "",
    preferredSlot: "",
  });

  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("");


  const navigate  = useNavigate();

  const { backendUrl, token } = useContext(StoreContext);


  // Cloudinary Upload
  const uploadImage = async (file) => {
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", "rewear_upload");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/djwdqu0jp/image/upload",
        form
      );

      return res.data.secure_url;
    } catch (err) {
      toast.error("Image upload failed");
      throw err;
    }
  };

  const handleImageUpload = async (e, index) => {
    const files = Array.from(e.target.files);
    if (files.length + items[index].images.length > MAX_IMAGES) return;

    const uploaded = await Promise.all(files.map(uploadImage));
    const updated = [...items];
    updated[index].images.push(...uploaded);
    setItems(updated);
  };

  const addItem = () => {
    if (items.length < MAX_ITEMS) {
      setItems([...items, { clothType: "", materialType: "", images: [] }]);
    }
  };

  const handleSubmit = async () => {

    setFormError("");
    setFormSuccess("");

    if (!token) {
      setFormError("Please login to continue");
      return;
    }

    if (items.length < 3 || items.length > 5) {
      setFormError("Upload minimum 3 and maximum 5 items");
      return;
    }

    for (let i = 0; i < items.length; i++) {
      if (!items[i].clothType) {
        setFormError(`Select cloth type for item ${i + 1}`);
        return;
      }
      if (items[i].images.length < 3) {
        setFormError(`Upload at least 3 images for item ${i + 1}`);
        return;
      }
    }

    if (
      !pickup.address.line1 ||
      !pickup.address.city ||
      !pickup.address.pincode
    ) {
      setFormError("Complete pickup address");
      return;
    }

    try {
      const userId = localStorage.getItem("userId"); // REQUIRED (backend expects it)

      const response = await axios.post(
        backendUrl + "/api/recycle/submit",
        {
          userId,
          pickup,
          items
        },
        {
          headers: { token }
        }
      );

      if (response.data.success) {
        setFormError("");
        setFormSuccess(`♻️ Order submitted! You earned ${response.data.coins} coins`);

        // 🔄 RESET ITEMS
        setItems([
          { clothType: "", materialType: "", images: [] }
        ]);

        // 🔄 RESET PICKUP
        setPickup({
          address: { line1: "", city: "", state: "", pincode: "" },
          preferredDate: "",
          preferredSlot: "",
        });
      } else {
        setFormError(response.data.message);
      }

    } catch (error) {
      console.error(error);
      setFormError("Recycle submission failed");
    }
  };
  return (
    <div className="rewear-page rewear-container">
      <h2>Upload Items</h2>
      <p className="subtitle">
        Submit your old clothes for recycling and earn coins
      </p>

      <div className="info-box">
        <ul>
          <li>One order must include 3 to 5 items</li>
          <li>Each item requires 3–5 images</li>
          <li>Clear photos help accurate evaluation</li>
        </ul>
      </div>

      {formError && (
  <div className="form-error-box">
    {formError}
  </div>
)}

{formSuccess && (
  <div className="form-success-box">
    {formSuccess}
  </div>
)}

      {items.map((item, index) => (
        <div className="item-card" key={index}>
          <h4>Item {index + 1}</h4>

          <div className="upload-wrapper">
            <div className="image-count">
              IMAGES ({item.images.length}/{MAX_IMAGES})
            </div>

            <label className="upload-box">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e, index)}
                hidden
              />
              <span>Upload</span>
            </label>

            <div className="min-images-text">
              Minimum 3 images required
            </div>
          </div>

          {/* Image Preview */}
          {item.images.length > 0 && (
            <div className="image-preview-row">
              {item.images.map((img, imgIndex) => (
                <div className="preview-thumb" key={imgIndex}>
                  <img src={img} alt="uploaded" />
                </div>
              ))}
            </div>
          )}

          <div className="form-row">
            <select
              value={item.clothType}
              onChange={(e) => {
                const updated = [...items];
                updated[index].clothType = e.target.value;
                setItems(updated);
              }}
            >
              <option value="">Select Cloth Type</option>
              <option>Shirt</option>
              <option>Pant</option>
              <option>Jacket</option>
            </select>

            <select
              value={item.materialType}
              onChange={(e) => {
                const updated = [...items];
                updated[index].materialType = e.target.value;
                setItems(updated);
              }}
            >
              <option value="">Select Material</option>
              <option>Cotton</option>
              <option>Denim</option>
              <option>Leather</option>
            </select>
          </div>

          {/* Pickup Details ONLY for first item */}
          {index === 0 && (
            <div className="pickup-section">
              <h5>Pickup Address</h5>
              <input
                placeholder="Address Line"
                onChange={(e) =>
                  setPickup({
                    ...pickup,
                    address: { ...pickup.address, line1: e.target.value },
                  })
                }
              />
              <div className="row">
                <input
                  placeholder="City"
                  onChange={(e) =>
                    setPickup({
                      ...pickup,
                      address: { ...pickup.address, city: e.target.value },
                    })
                  }
                />
                <input
                  placeholder="State"
                  onChange={(e) =>
                    setPickup({
                      ...pickup,
                      address: { ...pickup.address, state: e.target.value },
                    })
                  }
                />
                <input
                  placeholder="Pincode"
                  onChange={(e) =>
                    setPickup({
                      ...pickup,
                      address: { ...pickup.address, pincode: e.target.value },
                    })
                  }
                />
              </div>

              <div className="row">
                <input
                  type="date"
                  onChange={(e) =>
                    setPickup({ ...pickup, preferredDate: e.target.value })
                  }
                />
                <select
                  onChange={(e) =>
                    setPickup({ ...pickup, preferredSlot: e.target.value })
                  }
                >
                  <option value="">Select Slot</option>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </select>
              </div>
            </div>
          )}
        </div>
      ))}

      <button className="add-item" onClick={addItem}>
        + Add Another Item ({items.length}/{MAX_ITEMS})
      </button>

      <div className="actions">
        <button
          type = "button"
          className="cancel"
          onClick={() => navigate("/rewear")}
        >
          Cancel
        </button>        
        <button className="submit" onClick={handleSubmit}>
          Submit Rewear Order
        </button>
      </div>
    </div>
  );
}

export default RewearUpload
