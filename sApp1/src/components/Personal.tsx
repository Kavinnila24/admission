
import React from 'react';
import CreateApplicant from './resources/CreateApplicant';
import CreateCurrentaddress from './resources/CreateCurrentaddress';
import CreatePermaddress from './resources/CreatePermaddress';

const Personal = () => {
  return (
    <div className="w-100 h-100">
      {/* Instructions Section */}
      <div 
        className="p-4 mb-3"
        style={{
          background: '#f2f5fb',
          minHeight: '105px',
          width: '100%',
          borderTopLeftRadius: '20px', 
          borderTopRightRadius: '20px',
          border: '1px solid #e0e6ed'
        }}
      >
        <div style={{ fontSize: '16px', lineHeight: '1.5' }}>
          <p style={{ 
            textDecoration: 'underline', 
            marginBottom: '10px', 
            fontWeight: '600',
            color: '#2c3e50'
          }}>
            Instruction/Guidelines
          </p>
          <p style={{ 
            margin: '0', 
            color: '#34495e',
            fontSize: '14px'
          }}>
            &bull; Please fill up the personal details. Uploading of profile photo is must, should be less than 2 MB
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="form-sections">
        <div className="mb-4">
          <CreateApplicant/>
        </div>
        <div className="mb-4">
          <CreateCurrentaddress/>
        </div>
        <div className="mb-4">
          <CreatePermaddress/>
        </div>
      </div>
    </div>
  );
};

export default Personal;