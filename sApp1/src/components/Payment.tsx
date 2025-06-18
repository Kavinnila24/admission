
import React, { useState } from 'react';

const Payment = () => {
  const [agree, setAgree] = useState(false);

  const handleSubmit = () => {
    if (!agree) {
      alert("Please accept the declaration before proceeding.");
      return;
    }

    // Trigger payment or submission logic here
    alert("Form submitted successfully!");
  };

  return (
    <div>
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
          Application Fee: Rs 1500 need to be collected for each Application
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
          <h5 className="mb-3" style={{ fontWeight: '600' }}>
            Declaration and Final Submission
          </h5>

          <div
            style={{
              border: '1px solid #ccc',
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
    </div>
  );
};

export default Payment;