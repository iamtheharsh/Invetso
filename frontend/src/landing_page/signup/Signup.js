import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [signupForm, setSignupForm] = useState({ username: "", email: "", password: "" });
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  const navigate = useNavigate();

  const handleSignupChange = (e) => setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  const handleLoginChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3002/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupForm),
    });
    const data = await res.json();
    if (data.success) {
      alert("Signup successful! Please login.");
      setSignupForm({ username: "", email: "", password: "" });
    } else {
      alert(data.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3002/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm),
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem("token", data.token);
      window.location.href = "http://localhost:3001";
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="signup-login-container">
      <div className="left-panel">
        <h2>Welcome to <span className="zerodha-brand">Zerodha</span></h2>
        <p>Create your account</p>
        <form onSubmit={handleSignup}>
          <input type="text" name="username" placeholder="Username" onChange={handleSignupChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleSignupChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleSignupChange} required />
          <button type="submit">Create My Account</button>
        </form>
      </div>
      <div className="divider">or</div>
      <div className="right-panel">
        <h3>Login your account</h3>
        <form onSubmit={handleLogin}>
          <input type="text" name="username" placeholder="Username" onChange={handleLoginChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleLoginChange} required />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
