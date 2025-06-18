
import React from 'react'
import CreateEducationdetails from './resources/CreateEducationdetails'
import CreateEducationdetails2 from './resources/CreateEducationdetails2'

const Education = () => {
  return (
    <div className='p-4'>
      <div className="shadow-lg rounded p-4 mb-4 border border-2"
    style={{ position: 'relative', zIndex: 1 }}>
        <CreateEducationdetails/>
        </div>
        <div className="shadow-lg rounded p-4 mb-4 border border-2"
    style={{ position: 'relative', zIndex: 1 }}>
        <CreateEducationdetails2/>
      </div>
    </div>
  )
}


export default Education