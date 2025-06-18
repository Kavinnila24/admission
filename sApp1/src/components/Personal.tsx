
import React from 'react';
import CreateApplicant from './resources/CreateApplicant';
import CreateCurrentaddress from './resources/CreateCurrentaddress';
import CreatePermaddress from './resources/CreatePermaddress';

const Personal = () => {
  return (
    
      
    
      
      <div className="p-4"
            style={{background:'#f2f5fb',
              height:'105px',
              width:'1300px',
              borderTopLeftRadius: '20px', borderTopRightRadius: '20px' ,
            }}>
              <div style={{ fontSize: '18px' }}>
        <p style={{ textDecoration: 'underline' }}>Instruction/Guidelines</p>
        <p>&bull; Please fill up the personal details. Uploading of profile photo is must, should be less than 2 MB</p></div>
        <div>
          <CreateApplicant/>
        </div>
        <div>
          <CreateCurrentaddress/>
        </div>
        <div>
          <CreatePermaddress/>
        </div>
      </div>
  );
};

export default Personal;