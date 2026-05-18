import React, { useState } from "react";
import "./Add.css";
import { RiImageAiLine } from "react-icons/ri";
import { LuSave } from "react-icons/lu";
import { CiCalendarDate } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { BsInfoLg } from "react-icons/bs";
import { assets } from "../../assets/assets";
import axios from "axios";
import { backendUrl } from "../../App";
import { toast } from "react-toastify";

const Add = ({token}) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);


  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState("");

  // const handleImageUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   setImages([...images, ...files.map((file) => URL.createObjectURL(file))]);
  // };

  // const handleRemoveImage = (index) => {
  //   setImages(images.filter((_, i) => i !== index));
  // };

  const onSubmitHandler = async (e) => {
    
    e.preventDefault();

    try {
      
      const formData = new FormData()

      formData.append("name",name)
      formData.append("description",description)
      formData.append("price",price)
      formData.append("oldPrice",oldPrice)
      formData.append("category",category)
      formData.append("subCategory",subCategory)
      formData.append("bestseller",bestseller)
      formData.append("sizes",JSON.stringify(sizes))


      image1 && formData.append("image1",image1)
      image2 && formData.append("image2",image2)
      image3 && formData.append("image3",image3)
      image4 && formData.append("image4",image4)

      const response = await axios.post(backendUrl + "/api/product/add",formData,{headers:{token}})

      if(response.data.success){
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
        setOldPrice('')
      }else{
        toast.error(response.data.message)
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }
  }

  return (
    <div className="add-wrapper">
      <h2 className="page-title">Add New Product</h2>
      <p className="page-subtitle">Add a new product to your store</p>

      <form onSubmit={onSubmitHandler} className="add-content">
        {/* LEFT SIDE */}
        <div className="left-column">
          {/* Name & Description */}
          <div className="form-block">
            <h3>Name and Description</h3>
            <label>Product Name</label>
            <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder="Product Name" />
            
            <label>Product Description</label>
            <textarea onChange={(e)=>setDescription(e.target.value)} value={description} rows="4" placeholder="Product Description" />
          </div>

          {/* Category */}
          <div className="form-block">
            <h3>Category</h3>
            <label>Product Category</label>
            <select onChange={(e) => setCategory(e.target.value)} >
              <option value="Men">Men</option>
              <option value="WoMen">Women</option>
              <option value="Kids">Kids</option>
            </select>

            <label>Product Sub-Category</label>
            <select onChange={(e) => setSubCategory(e.target.value)}>
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          {/* Manage Stock */}
          <div className="form-block">
  <div className="form-header">
    <h3>Best Seller</h3>
    <div className="info-icon">
      <BsInfoLg />
      <span className="tooltip">
        Mark this product as a Best Seller.  
        It will be highlighted in your store.
      </span>
    </div>
  </div>

  <label className="checkbox-container">
    <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" />
    <span className="checkmark"></span>
    Mark as Best Seller
  </label>
</div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-column">
          {/* Product Details */}
          <div className="form-block">
            <h3>Product Details</h3>
            {/* <label>Brand Name</label>
            <select>
              <option>Adidas</option>
              <option>Nike</option>
              <option>Puma</option>
            </select> */}

             <div className="size-options">
    <div 
      className={`size-option ${sizes.includes("S") ? "active" : ""}`}
      onClick={() => setSizes(prev => prev.includes("S") ? prev.filter( item => item !== "S") : [...prev, "S"])}
    >
      S
    </div>
    <div
      className={`size-option ${sizes.includes("M") ? "active" : ""}`}
      onClick={() => setSizes(prev => prev.includes("M") ? prev.filter( item => item !== "M") : [...prev, "M"])}
    >
      M
    </div>
    <div
      className={`size-option ${sizes.includes("L") ? "active" : ""}`}
      onClick={() => setSizes(prev => prev.includes("L") ? prev.filter( item => item !== "L") : [...prev, "L"])}
    >
      L
    </div>
    <div
      className={`size-option ${sizes.includes("XL") ? "active" : ""}`}
      onClick={() => setSizes(prev => prev.includes("XL") ? prev.filter( item => item !== "XL") : [...prev, "XL"])}
    >
      XL
    </div>
    <div
      className={`size-option ${sizes.includes("XXL") ? "active" : ""}`}
      onClick={() => setSizes(prev => prev.includes("XXL") ? prev.filter( item => item !== "XXL") : [...prev, "XXL"])}
    >
      XXL
    </div>
  </div>
          </div>

          {/* Product Pricing */}
          <div className="form-block">
            <h3>Product Pricing</h3>
            <div className="form-row">
              <div>
                <label>Original Price</label>
                <input onChange={(e) => setPrice(e.target.value)} value={price} type="text" placeholder="₹0" />
              </div>
              <div>
                <label>Old Price (Optional)</label>
                <input onChange={(e) => setOldPrice(e.target.value)} value={oldPrice} type="text" placeholder="₹0" />
              </div>
            </div>

            <div className="form-row">
              {/* <div>
                <label>Discount (%)</label>
                <input type="number" placeholder="15" />
              </div> */}
              {/* <div>
                <label>Minimum Order</label>
                <input type="number" placeholder="100" />
              </div> */}
            </div>
          </div>

          {/* Product Images */}
          <div className="form-block">
  <h3>Product Image</h3>

  <div className="image-preview-list">
    {/* Slot 1 */}
    <label htmlFor="image1" className="upload-slot">
      <img
        src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
        alt="upload"
        className="preview-img"
      />
      {image1 && (
        <button
          className="remove-btn"
          type="button"
          onClick={() => setImage1(false)}
        >
          Remove
        </button>
      )}
      <input
        id="image1"
        type="file"
        hidden
        onChange={(e) => setImage1(e.target.files[0])}
      />
    </label>

    {/* Slot 2 */}
    <label htmlFor="image2" className="upload-slot">
      <img
        src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
        alt="upload"
        className="preview-img"
      />
      {image2 && (
        <button
          className="remove-btn"
          type="button"
          onClick={() => setImage2(false)}
        >
          Remove
        </button>
      )}
      <input
        id="image2"
        type="file"
        hidden
        onChange={(e) => setImage2(e.target.files[0])}
      />
    </label>

    {/* Slot 3 */}
    <label htmlFor="image3" className="upload-slot">
      <img
        src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
        alt="upload"
        className="preview-img"
      />
      {image3 && (
        <button
          className="remove-btn"
          type="button"
          onClick={() => setImage3(false)}
        >
          Remove
        </button>
      )}
      <input
        id="image3"
        type="file"
        hidden
        onChange={(e) => setImage3(e.target.files[0])}
      />
    </label>

    {/* Slot 4 */}
    <label htmlFor="image4" className="upload-slot">
      <img
        src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
        alt="upload"
        className="preview-img"
      />
      {image4 && (
        <button
          className="remove-btn"
          type="button"
          onClick={() => setImage4(false)}
        >
          Remove
        </button>
      )}
      <input
        id="image4"
        type="file"
        hidden
        onChange={(e) => setImage4(e.target.files[0])}
      />
    </label>
  </div>
</div>

          {/* Buttons */}
          <div className="action-buttons">
  {/* <button className="save-btn">
    <span className="btn-icon"><LuSave /></span> Save Product
  </button> */}
  {/* <button className="schedule-btn">
    <span className="btn-icon"><CiCalendarDate /></span> Schedule
  </button> */}
  <button type="submit" className="add-btn">
    <span className="btn-icon"><IoMdAdd /></span> Add Product
  </button>
</div>
        </div>
      </form>
    </div>
  );
};

export default Add;
