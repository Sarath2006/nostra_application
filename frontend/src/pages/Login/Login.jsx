import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import { FcGoogle } from "react-icons/fc";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState('Sign Up');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { token, setToken, navigate, backendUrl } = useContext(StoreContext)

  useEffect(() => {
    if(token) {
      navigate('/', { replace: true });
    }
  }, [token, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (currentState === 'Sign Up') {

        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        console.log(response.data);
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
          if (response.data.user?._id) {
            localStorage.setItem("userId", response.data.user._id);
          }
        } else {
          toast.error(response.data.message);
        }

      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
          if (response.data.user?._id) {
            localStorage.setItem("userId", response.data.user._id);
          }

        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);

    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="title">
          {currentState === "Login" ? "Welcome back, Dude!" : "Create an account"}
        </h2>
        <p className="subtitle">
          {currentState === "Login"
            ? "Login to explore nostra."
            : "Sign up to get started"}
        </p>

        <button className="google-btn">
          <FcGoogle className="google-icon" /> Log in with Google
        </button>

        <div className="divider">or</div>

        <form onSubmit={handleSubmit} className="form">
          {currentState === "Sign Up" && (
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Full Name"
              value={name}
              required
            />
          )}

          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            value={email}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {currentState === "Login" && (
            <div className="form-extra">
              <label>
                <input type="checkbox" /> Remember for 30 days
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>Forgot password?</a>            </div>
          )}

          <button type="submit" className="primary-btn">
            {currentState === "Login" ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="switch">
          {currentState === "Login" ? (
            <>
              Don’t have an account?{" "}
              <span onClick={() => setCurrentState("Sign Up")}>
                Sign up for free
              </span>
            </>
          ) : (
            <>
              Have an account?{" "}
              <span onClick={() => setCurrentState("Login")}>Log in</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
