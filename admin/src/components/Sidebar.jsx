import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

// Icons
import { LuLayoutDashboard } from "react-icons/lu";
import { TbCube } from "react-icons/tb";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import { TfiLayoutListThumb } from "react-icons/tfi";
import { CgShoppingBag } from "react-icons/cg";
import { FiUsers, FiHelpCircle, FiMail } from "react-icons/fi";
import { MdOutlineAnalytics } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";

const Sidebar = ({setToken}) => {
  const [openProducts, setOpenProducts] = useState(true);

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <h2>NostraCart</h2>
      </div>

      {/* Main Menu */}
      <div className="sidebar-section">
        <p className="sidebar-section-title">Main Menu</p>
        <NavLink to="/" className="sidebar-item">
          <LuLayoutDashboard className="sidebar-icon" />
          <span>Dashboard</span>
        </NavLink>

        {/* My Shop */}
        <div className="sidebar-dropdown">
          <div
            className="sidebar-item"
            onClick={() => setOpenProducts(!openProducts)}
          >
            <TbCube className="sidebar-icon" />
            <span>My Shop</span>
          </div>
          {openProducts && (
            <div className="sidebar-submenu">
              <NavLink to="/add" className="sidebar-subitem">
                <HiOutlineViewGridAdd className="sidebar-icon small" />
                <span>Add Product</span>
              </NavLink>
              <NavLink to="/list" className="sidebar-subitem">
                <TfiLayoutListThumb className="sidebar-icon small" />
                <span>Products</span>
              </NavLink>
              <NavLink to="/orders" className="sidebar-subitem">
                <CgShoppingBag className="sidebar-icon small" />
                <span>Orders</span>
              </NavLink>
              <NavLink to="/customers" className="sidebar-subitem">
                <FiUsers className="sidebar-icon small" />
                <span>Customers</span>
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/recycle-orders" className="sidebar-item">
          <TbCube className="sidebar-icon" />
          <span>Recycle Orders</span>
        </NavLink>

        <NavLink to="/analytics" className="sidebar-item">
          <MdOutlineAnalytics className="sidebar-icon" />
          <span>Analytics Report</span>
        </NavLink>

        
      </div>

      {/* Others */}
      <div className="sidebar-section">
        <p className="sidebar-section-title">Others</p>
        

        <button onClick={()=>setToken('')} className="sidebar-item" >
          <BiLogOut className="sidebar-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
