import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiConfig from "../config/apiConfig";
import { getCookie } from "../apis/enum";
import "./Login.css";
import { fetchUserByEmail } from '../utils/userUtils';
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
      // Check user role from sessionStorage or redirect to default page
      const userRole = sessionStorage.getItem('userRole');
      if (userRole === 'ADMIN') {
        navigate("/page13");
      } else {
        navigate("/page1");
      }
    }
  }, [])

  // // Function to fetch user by email using GET_USER_BY_EMAIL decorator
  // const fetchUserByEmail = async (email: string) => {
  //   try {
  //     const accessToken = getCookie("access_token");
  //     if (!accessToken) {
  //       throw new Error("Access token not found");
  //     }

  //     const params = new URLSearchParams();
  //     params.append('queryId', 'GET_USER_BY_EMAIL');
  //     params.append('args', `email:${email}`);

  //     const response = await fetch(
  //       apiConfig.getResourceUrl("user") + "?" + params.toString(),
  //       {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/vnd.api+json',
  //           'Authorization': `Bearer ${accessToken}`,
  //         },
  //         credentials: 'include',
  //       }
  //     );
      
  //     if (!response.ok) {
  //       throw new Error('Error fetching user: ' + response.status);
  //     }

  //     const data = await response.json();
  //     const user = data.resource && data.resource.length > 0 ? data.resource[0] : null;
      
  //     return user;
  //   } catch (error) {
  //     console.error('Error fetching user by email:', error);
  //     return null;
  //   }
  // };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };
  
  const handleLogin = async () => {
    setError("");
    try {
      // Single login endpoint - backend will determine user role
      const response = await fetch(
        apiConfig.getResourceUrl("auth/login"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: credentials.email,
            password: credentials.password,
          }),
          credentials: "include", // to receive cookies
        }
      );

      if (!response.ok) {
        setError(`Login failed! Status: ${response.status}`);
        return;
      }

      const loginData = await response.json();
      
      // Backend should return user role and other details
      const userRole = loginData.role || 'USER'; // Default to USER if no role specified
      const userId = loginData.userId; // This is currently the email
      
      // Store basic user information in sessionStorage
      sessionStorage.setItem('userRole', userRole);
      sessionStorage.setItem('userId', userId); // Store email for reference
      
      // Now fetch the actual user object to get the database ID
      console.log('Fetching user object for email:', credentials.email);
      const user = await fetchUserByEmail(credentials.email);
      
      if (user && user.id) {
        // Store the actual database ID as applicant_id
        sessionStorage.setItem('applicant_id', user.id);
        console.log('User object fetched successfully:', user);
        console.log('Database ID stored as applicant_id:', user.id);
        
        // Backward compatibility - store appropriate IDs
        if (userRole === 'ADMIN') {
          sessionStorage.setItem('isAdmin', 'true');
          sessionStorage.setItem('admin_id', user.id);
        } else {
          sessionStorage.setItem('isAdmin', 'false');
          sessionStorage.setItem('user_id', user.id);
        }
      } else {
        console.error('Could not fetch user object or extract ID');
        // Fallback to using email if user object fetch fails
        sessionStorage.setItem('applicant_id', credentials.email);
        console.warn('Fallback: Using email as applicant_id');
      }

      console.log('Login successful - stored userId:', userId, 'userRole:', userRole);

      // Navigate based on role
      if (userRole === 'ADMIN') {
        navigate("/page13");
      } else {
        navigate("/page1");
      }

    } catch (err: any) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-wrapper">
        <div className="login-form-container">
          <h2 className="login-form-title">
            Login to your account
          </h2>

          <form className="login-form-grid" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className="login-form-field">
              <label htmlFor="email" className="login-form-label">
                <span style={{ color: 'red' }}>*</span>Registered Email ID
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="login-form-input"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="login-form-field">
              <label htmlFor="password" className="login-form-label">
                <span style={{ color: 'red' }}>*</span>Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="login-form-input"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleInputChange}
                required
              />
            </div>

          </form>

          {error && (
            <div className="login-error-message">
              {error}
            </div>
          )}

          <div className="login-button-group">
            <button
              type="button"
              className="login-submit-button"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
          
          <div className="login-register-link-container">
            Don't have an account? <Link to="/register" className="login-register-link">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}