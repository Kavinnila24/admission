import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiConfig from "../config/apiConfig";
import { getCookie } from "../apis/enum";
import "./Register.css"; // Reusing the same styles

export default function Register() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    admin_registration_password: '', // Only for admin registration
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addURL = apiConfig.getResourceUrl("auth/add_user");
  const roleURL = apiConfig.getResourceUrl("auth/user_role_mapping");

  useEffect(() => {
    const accessToken = getCookie("access_token");
    if (accessToken != null) {
      const userRole = sessionStorage.getItem('userRole');
      if (userRole === 'ADMIN') {
        navigate("/page13");
      } else {
        navigate("/page1");
      }
    }
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      // Validate passwords match
      if (credentials.password !== credentials.confirmPassword) {
        setError("Passwords do not match!");
        setLoading(false);
        return;
      }

      // Check if user wants to register as admin
      let isAdmin = false;
      if (credentials.admin_registration_password.trim() !== "") {
        console.log("Checking admin password:", credentials.admin_registration_password);
        // Simple client-side validation - this matches the backend logic
        isAdmin = credentials.admin_registration_password === "admin@123";
        console.log("Admin validation result:", isAdmin);
      }

      console.log("Final isAdmin value:", isAdmin);

      // Prepare registration data - send as query parameters
      const registrationData = {
        email: credentials.email,
        password: credentials.password,
      };

      // Create URL with query parameters
      const params = new URLSearchParams({
        newEmail: credentials.email,
        newPassword: credentials.password,
        resource: isAdmin ? 'Admin' : 'User',
      });

      // Register user
      const response = await fetch(addURL + "?" + params.toString(), {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
        credentials: "include",
      });

      if (response.ok) {
        // Assign role - use lowercase for role names
        const roleParams = new URLSearchParams({
          userName: credentials.email,
          role: isAdmin ? "admin" : "user"  // Changed to lowercase
        });
        
        const roleResponse = await fetch(roleURL + "?" + roleParams.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        });

        if (roleResponse.ok) {
          alert("Registration successful! You can now login.");
          navigate("/login");
        } else {
          setError("Registration successful but role assignment failed. Please contact support.");
        }
      } else {
        const errorData = await response.text();
        setError("Registration failed: " + errorData);
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-wrapper">
        <div className="login-form-container">
          <h2 className="login-form-title">
            Create your account
          </h2>

          <form className="login-form-grid" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
            <div className="login-form-field">
              <label htmlFor="email" className="login-form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                className="login-form-input"
                required
              />
            </div>

            <div className="login-form-field">
              <label htmlFor="password" className="login-form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                className="login-form-input"
                required
              />
            </div>

            <div className="login-form-field">
              <label htmlFor="confirmPassword" className="login-form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={credentials.confirmPassword}
                onChange={handleInputChange}
                className="login-form-input"
                required
              />
            </div>

            <div className="login-form-field">
              <label htmlFor="admin_registration_password" className="login-form-label">
                Admin Registration Password (Optional)
              </label>
              <input
                type="password"
                id="admin_registration_password"
                name="admin_registration_password"
                value={credentials.admin_registration_password}
                onChange={handleInputChange}
                className="login-form-input"
                placeholder="Leave blank for user registration"
              />
              <small className="login-form-help">
                Enter the admin password only if you want to register as an admin
              </small>
            </div>

            {error && <p className="login-form-error">{error}</p>}

            <button 
              type="submit" 
              className="login-form-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>

            <p className="login-form-link">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
