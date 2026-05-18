import React, { useContext, useMemo, useState, useEffect } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiUser, FiX, FiMenu } from "react-icons/fi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import IMAGES from "../assets/assests";
import { Link } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import axios from "axios";

const Navbar = () => {
  const [showBanner, setShowBanner] = useState(() => {
    const saved = localStorage.getItem('bannerClosed');
    return saved ? false : true;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("");

  const { cartItems, products, getCartAmount, navigate, token, setToken, setCartItems, backendUrl } = useContext(StoreContext);

  const cartCount = useMemo(() => {
    let total = 0;
    Object.entries(cartItems || {}).forEach(([itemId, sizes]) => {
      const productMatch = products?.find(
        (p) => String(p._id) === String(itemId) || String(p.id) === String(itemId)
      );
      if (!productMatch) return;

      Object.values(sizes || {}).forEach((qty) => {
        const num = Number(qty) || 0;
        if (num > 0) total += num;
      });
    });
    return total;
  }, [cartItems, products]);

  const cartBadge = getCartAmount() > 0 ? cartCount : 0;

  const logout = () => {
    navigate('/login-or-signup')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
    setUserName("")
  }

  // Fetch user data when token changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await axios.post(
            backendUrl + '/api/user/profile',
            {},
            { headers: { token } }
          );
          
          if (response.data.success) {
            const user = response.data.user;
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
            setUserName(fullName);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserName("");
      }
    };

    fetchUserData();
  }, [token, backendUrl]);

  const getInitial = () => {
    if (userName) {
      return userName.charAt(0).toUpperCase();
    }
    return "";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setMenuOpen(false);
    }
  };

  return (
    <header className="navbar">
      {/* Top Banner */}
      {showBanner && !token && (
        <div className="navbar-banner">
          <p>
            Sign up and <strong>GET 20% OFF</strong> for your first order.{" "}
            <Link to="/login-or-signup">Sign up now</Link>
          </p>
          <FiX className="close-icon" onClick={() => {
            setShowBanner(false);
            localStorage.setItem('bannerClosed', 'true');
          }} />
        </div>
      )}

      {/* Main Navbar */}
      <div className="navbar-main">
        <div className="navbar-logo">
          <Link to="/">
            <img src={IMAGES.LogoNostra} alt="NOSTRA Logo" />
          </Link>
        </div>

        {/* Hamburger */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </div>

        {/* Menu */}
        <div className="menu">
          <nav className={`navbar-links ${menuOpen ? "active" : ""}`}>
            <NavLink to="/" onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/collection" onClick={() => setMenuOpen(false)}>
              Collections{" "}
            </NavLink>
            <NavLink to="/women" onClick={() => setMenuOpen(false)}>
              Women
            </NavLink>
            <NavLink to="/men" onClick={() => setMenuOpen(false)}>
              Men
            </NavLink>
            <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </NavLink>
            <NavLink to="/rewear" onClick={() => setMenuOpen(false)}>
              Recycle
            </NavLink>
          </nav>
        </div>

        {/* Search + Icons */}
        <div className="navbar-actions">
          <form onSubmit={handleSearch} className="search-box">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <Link to="/cart" className="cart-link">
            <HiOutlineShoppingBag className="cart-icon" />
            <p className="cart-badge">{cartBadge}</p>
          </Link>
          <div className="user-dropdown">
            {token && userName ? (
              <div className="user-avatar" onClick={() => null}>
                {getInitial()}
              </div>
            ) : (
              <FiUser onClick={() => navigate('/login-or-signup')} className="icon" />
            )}

            {token && <div className="dropdown-menu">
              <p onClick={()=>navigate('/profile')}>My Profile</p>
              <p onClick={()=>navigate('/orders')} >Orders</p>
              <p onClick={logout}>Logout</p>
            </div>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
