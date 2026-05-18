import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import Home from "./components/Home";
import "./App.css";
// import Layout from "./components/Layout";
import Login from "./components/Login";
 import { ToastContainer } from 'react-toastify';
import Sidebar from "./components/Sidebar";
import RecycleOrders from "./pages/RecycleOrders/RecycleOrders.jsx";
import Customers from "./pages/Customers/Customers.jsx";

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '₹'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');

  useEffect(()=>{
    localStorage.setItem('token',token)
  },[token])

  return (
    <div className="app-container">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Sidebar setToken={setToken}  />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Home token={token} />} />
              <Route path="/add" element={<Add token={token} />} />
              <Route path="/list" element={<List token={token} />} />
              <Route path="/orders" element={<Orders token={token} />} />
              <Route path="/recycle-orders" element={<RecycleOrders token={token} />} />
              <Route path="/customers" element={<Customers token={token} />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
