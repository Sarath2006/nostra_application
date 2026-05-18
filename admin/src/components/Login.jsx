import { useState, useEffect } from "react";
import "./Login.css";
import axios from 'axios'
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Login = ({setToken}) => {

  const [email, setEmail] = useState(() => localStorage.getItem("email") || '');
  const [password, setPassword] = useState(() => localStorage.getItem("password") || '');

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("email", email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem("password", password);
  }, [password]);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
        
        const response = await axios.post(backendUrl + '/api/user/admin',{email,password})
        if(response.data.success){
            setToken(response.data.token)
        }else{
            toast.error(response.data.message)
        }
        
    } catch (error) {
        console.log(error);
        toast.error(error.message)
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={onSubmitHandler} className="login-box">
  <h2>Admin Panel</h2>

  <label>Email Address</label>
  <input 
    onChange={(e) => setEmail(e.target.value)} 
    value={email} 
    type="email" 
    name="email" 
    placeholder="your@email.com" 
  />

  <label>Password</label>
  <input 
    onChange={(e) => setPassword(e.target.value)} 
    value={password} 
    type="password" 
    name="password" 
    placeholder="Enter your password" 
  />

  <button type="submit">Login</button>
</form>
    </div>
  );
};

export default Login;
