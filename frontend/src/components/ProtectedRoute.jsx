import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import LoginModal from "./LoginModal";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(StoreContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!token) {
      // Show login modal first
      setShowLoginModal(true);
      
      // Set timer to redirect if user doesn't login within 1 second
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [token]);

  // If user logged in, render the protected content
  if (token) {
    return children;
  }

  // If should redirect and still no token, redirect to home
  if (shouldRedirect && !token) {
    return <Navigate to="/" replace />;
  }

  // Show login modal
  return (
    <>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setShouldRedirect(true);
        }}
      />
      {children}
    </>
  );
};

export default ProtectedRoute;
