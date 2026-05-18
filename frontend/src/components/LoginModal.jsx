import React, { useContext, useState } from "react";
import "./LoginModal.css";
import { FcGoogle } from "react-icons/fc";
import { FiX } from "react-icons/fi";
import { StoreContext } from "../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginModal = ({ isOpen, onClose }) => {
  const [currentState, setCurrentState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setToken, backendUrl } = useContext(StoreContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          if (response.data.user?._id) {
            localStorage.setItem("userId", response.data.user._id);
          }
          toast.success("Account created successfully!");
          onClose();
          // Reset form
          setName("");
          setEmail("");
          setPassword("");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          if (response.data.user?._id) {
            localStorage.setItem("userId", response.data.user._id);
          }
          toast.success("Login successful!");
          onClose();
          // Reset form
          setEmail("");
          setPassword("");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={handleOverlayClick}>
      <div className="login-modal-content">
        <button className="login-modal-close" onClick={onClose}>
          <FiX />
        </button>

        <div className="login-modal-header">
          <h2>
            {currentState === "Login" ? "Welcome Back!" : "Create Account"}
          </h2>
          <p>
            {currentState === "Login"
              ? "Please login to continue"
              : "Sign up to get started"}
          </p>
        </div>

        <button className="login-modal-google-btn">
          <FcGoogle className="login-modal-google-icon" />
          Continue with Google
        </button>

        <div className="login-modal-divider">or</div>

        <form onSubmit={handleSubmit} className="login-modal-form">
          {currentState === "Sign Up" && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button
            type="submit"
            className="login-modal-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : currentState === "Login"
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        <div className="login-modal-toggle">
          {currentState === "Login" ? (
            <>
              Don't have an account?
              <button
                onClick={() => {
                  setCurrentState("Sign Up");
                  setName("");
                  setEmail("");
                  setPassword("");
                }}
                disabled={loading}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?
              <button
                onClick={() => {
                  setCurrentState("Login");
                  setEmail("");
                  setPassword("");
                }}
                disabled={loading}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
