// SuccessScreen.tsx
import React, { useEffect } from 'react';
import './SuccessScreen.css';

const SuccessScreen = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/'; // redirect to home or dashboard
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="success-screen">
      <div className="success-box">
        <div className="checkmark-circle">
          <div className="background"></div>
          <div className="checkmark draw"></div>
        </div>
        <h1>Payment Successful!</h1>
        <p>Your application has been submitted successfully.</p>
      </div>
    </div>
  );
};

export default SuccessScreen;

