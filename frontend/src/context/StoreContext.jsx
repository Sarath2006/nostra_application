import React, { createContext, useEffect, useState } from "react";
import { curatedPicks } from "../assets/assests";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    // Fetch wishlist from backend
    const fetchWishlist = async () => {
      if (!token) return;
      try {
        const response = await axios.post(
          backendUrl + '/api/wishlist/get',
          {},
          { headers: { token } }
        );
        if (response.data.success) {
          setWishlist(response.data.wishlist || []);
        } else {
          toast.error(response.data.message || 'Failed to fetch wishlist');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || 'Error fetching wishlist');
      }
    };

    // Add product to wishlist
    const addToWishlist = async (productId) => {
      if (!token) {
        setShowLoginModal(true);
        toast.info('Please login to add to wishlist');
        return;
      }
      try {
        const response = await axios.post(
          backendUrl + '/api/wishlist/add',
          { productId },
          { headers: { token } }
        );
        if (response.data.success) {
          fetchWishlist();
        } else {
          // Only show error if not 'already in wishlist'
          if (response.data.message !== 'Product already in wishlist') {
            toast.error(response.data.message || 'Failed to add to wishlist');
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || 'Error adding to wishlist');
      }
    };

    // Remove product from wishlist
    const removeFromWishlist = async (productId) => {
      if (!token) return;
      try {
        const response = await axios.post(
          backendUrl + '/api/wishlist/remove',
          { productId },
          { headers: { token } }
        );
        if (response.data.success) {
          fetchWishlist();
        } else {
          toast.error(response.data.message || 'Failed to remove from wishlist');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || 'Error removing from wishlist');
      }
    };
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('')
  const [shippingFee, setShippingFee] = useState(0);
  const [userData, setUserData] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

    const [wishlist, setWishlist] = useState([]);
  // ...existing code...
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    if (!token) {
      setShowLoginModal(true);
      toast.info("Please login to add items to cart");
      return;
    }
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems({ ...cartData });
    if(token){
      try {
        const response = await axios.post(
          backendUrl + '/api/cart/add',
          { itemId, size },
          { headers: { token } }
        );
        if (response.data.success) {
          console.log("Item added to cart:", response.data);
        } else {
          toast.error(response.data.message || "Failed to add to cart");
          setCartItems(cartItems);
        }
      } catch (error) {
        console.error("Add to cart error:", error);
        toast.error(error.response?.data?.message || error.message || "Error adding to cart");
        setCartItems(cartItems);
      }
    }
  };

  // updateQuantity function
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = quantity;
    if (quantity <= 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    }
    setCartItems({ ...cartData });
    if(token){
      try {
        const response = await axios.post(
          backendUrl + '/api/cart/update',
          { itemId, size, quantity },
          { headers: { token } }
        );
        if (response.data.success) {
          console.log("Cart updated:", response.data);
        } else {
          toast.error(response.data.message || "Failed to update cart");
        }
      } catch (error) {
        console.error("Update quantity error:", error);
        toast.error(error.response?.data?.message || error.message || "Error updating cart");
      }
    }
  };

  // ...existing code...

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          // console.log(error);
        }
      }
    }
    return totalCount;
  }


   const getCartAmount = () => {
    let totalAmount = 0;

    for (const itemId in cartItems) {
      const itemInfo = products.find(
        (product) =>
          String(product.id) === String(itemId) ||
          String(product._id) === String(itemId)
      );

      if (!itemInfo) {
        console.warn(`[getCartAmount] product not found for id: ${itemId}`);
        continue;
      }

      const price = Number(itemInfo.price) || 0;
      const sizeObj = cartItems[itemId] || {};

      for (const size in sizeObj) {
        const qty = Number(sizeObj[size]) || 0;
        if (qty > 0) totalAmount += price * qty;
      }
    }

    return totalAmount;
  };

  const getProductsData = async () => {
      try {
        
          const response = await axios.get(backendUrl + '/api/product/list')
          if(response.data.success){
            setProducts(response.data.products);
          }else{
            toast.error(response.data.message);
          }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
  }

  const getUserCart = async ( token ) => {
      try {
        
        const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers:{token}})
        if(response.data.success){
          setCartItems(response.data.cartData);
        }

      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
  }

  useEffect(()=>{
    getProductsData();
  },[])

  // Load token from storage on first render
  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (!token && stored) {
      setToken(stored);
    }
  }, [token]);

  // When token is set/changed, fetch user cart; clear cart when logged out
  useEffect(() => {
    if (token) {
      getUserCart(token);
    } else {
      setCartItems({});
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [token]);

  const featuredProducts = products.filter((p) => p.oldPrice);
  const bestSellers = products.filter((p) => p.bestseller);

  const value = {
    products,
    curatedPicks,
    featuredProducts,
    bestSellers,
    currency,
    delivery_fee,
    cartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    setCartItems,
    shippingFee,
    setShippingFee,
    userData,
    setUserData,
    showLoginModal,
    setShowLoginModal,
    wishlist,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    setWishlist,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
