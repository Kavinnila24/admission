import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiConfig from "../config/apiConfig";
import { getCookie } from "../apis/enum";
import "./Login.css";
import { fetchUserByEmail } from '../utils/userUtils';
// 1. Import your hash function
import { hashToAppId } from '../utils/hashUtils';

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const accessToken = getCookie("access_token");
    if (accessToken != null) {
      const userRole = sessionStorage.getItem('userRole');
      if (userRole === 'ADMIN') {
        navigate("/page13");
      } else {
        navigate("/personal");
      }
    }
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };
  
  const handleLogin = async () => {
    setError("");
    try {
      const response = await fetch(
        apiConfig.getResourceUrl("auth/login"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials.email,
            password: credentials.password,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        setError(`Login failed! Status: ${response.status}`);
        return;
      }

      const loginData = await response.json();
      const userRole = loginData.role || 'USER';
      const userId = loginData.userId;
      
      sessionStorage.setItem('userRole', userRole);
      sessionStorage.setItem('userId', userId);
      
      const user = await fetchUserByEmail(credentials.email);
      
      if (user && user.id) {
        sessionStorage.setItem('applicant_id', user.id);
        
        // 2. Generate and store the application number
        const numericId = hashToAppId(user.id);
        const appNumber = `APP-${numericId}`;
        sessionStorage.setItem('applicationNumber', appNumber);
        console.log('Application number generated and stored:', appNumber);
        
        if (userRole === 'ADMIN') {
          sessionStorage.setItem('isAdmin', 'true');
          sessionStorage.setItem('admin_id', user.id);
        } else {
          sessionStorage.setItem('isAdmin', 'false');
          sessionStorage.setItem('user_id', user.id);
        }
      } else {
        console.error('Could not fetch user object or extract ID');
        sessionStorage.setItem('applicant_id', credentials.email);
      }

      if (userRole === 'ADMIN') {
        navigate("/page13");
      } else {
        navigate("/personal");
      }

    } catch (err: any) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div id="login-container">
      <div id="right-panel">
        <div className="login-form-container" id="login-form-container">
          <div className="form-title-header">
            <h2 className="form-main-title">Login Form</h2>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-body">
              <div className="input-group">
                <div className="input-with-icon">
                  <span className="input-icon">✉</span>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Registered Email ID"
                    value={credentials.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="input-group">
                <div className="input-with-icon">
                  <span className="input-icon">🔓</span>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="button-group">
                <button type="submit" className="btn login-btn">
                  Login
                </button>
              </div>
               
              {error && (
                <div className="error-message">{error}</div>
              )}
               
              <div className="forgot-password">
                <a href="#" className="text-decoration-none">
                  Forgot Password?
                </a>
              </div>
              
              <div className="change-password">
                <span>Don't have an account? </span>
                <Link to="/register" className="text-decoration-none">
                  Create an account
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}