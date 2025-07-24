import React, { useState, useEffect } from 'react';
import './SuccessScreen.css';

const SuccessScreen = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/dashboard'; 
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="success-screen">
      <div className="success-box">
        {/* <div className="checkmark-circle"> */}
          {/* <div className="checkmark draw"></div> */}
        {/* </div> */}
        <h1>Payment Successful!</h1>
        <p>Your application has been submitted successfully.</p>
      </div>
    </div>
  );
};

const Payment = () => {
  const [agree, setAgree] = useState(false);
  const [showGateway, setShowGateway] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' });

  const handleSubmit = () => {
    if (!agree) {
      alert("Please accept the declaration before proceeding.");
      return;
    }
    setShowGateway(true);
  };

  const handlePayment = () => {
    if (!card.number || !card.expiry || !card.cvv) {
      alert('Please fill all payment details.');
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);
      setShowGateway(false);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  if (paymentSuccess) {
    return <SuccessScreen />;
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Top Info Bar */}
      <div
        className="p-4"
        style={{
          background: '#f2f5fb',
          height: '105px',
          width: '100%',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
        }}
      >
        <p style={{ fontSize: '22px', fontWeight: '500', margin: 0 }}>
          Application Fee: Rs 1500 needs to be collected for each Application
        </p>
      </div>

      {/* Form Box */}
      <div
        className="p-4 d-flex justify-content-center"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
          margin: '30px auto',
          width: '80%',
        }}
      >
        <div style={{ width: '100%' }}>
          <h5 className="mb-3" style={{ fontWeight: '400' }}>
            Declaration and Final Submission
          </h5>

          <div
            style={{
              border: '1px solid #2196F3',
              borderRadius: '6px',
              padding: '20px',
            }}
          >
            <p style={{ fontWeight: '400', fontSize: '16px', color: 'black' }}>
              <u>Instruction/Guidelines</u>
            </p>

            <ul style={{ paddingLeft: '20px', fontSize: '15px' }}>
              <li>
                I declare that the information provided is true to the best of my knowledge and I understand
                that providing any false information may lead to the rejection of the application and make me
                liable for legal proceedings.
              </li>
            </ul>

            <div className="form-check mt-3 mb-4">
              <input
                type="checkbox"
                className="form-check-input"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="agree" style={{ fontSize: '16px' }}>
                I Agree
              </label>
            </div>

            <div className="text-center">
              <button
                id="pay_button"
                className="btn btn-primary"
                style={{ minWidth: '150px' }}
                onClick={handleSubmit}
              >
                Pay and Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showGateway && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div style={{
            background: '#fff',
            padding: '30px',
            borderRadius: '10px',
            width: '400px',
            boxShadow: '0px 0px 15px rgba(0,0,0,0.2)'
          }}>
            <h5 className="mb-3 text-center">Mock Payment Gateway</h5>
            <input
              type="text"
              name="number"
              className="form-control mb-3"
              placeholder="Card Number"
              onChange={handleChange}
            />
            <input
              type="text"
              name="expiry"
              className="form-control mb-3"
              placeholder="Expiry Date (MM/YY)"
              onChange={handleChange}
            />
            <input
              type="text"
              name="cvv"
              className="form-control mb-3"
              placeholder="CVV"
              onChange={handleChange}
            />
            <div className="text-center">
              <button className="btn btn-success" onClick={handlePayment}>
                {processing ? 'Processing...' : 'Pay ₹1500'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
