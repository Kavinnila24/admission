
import React from 'react'
import CreateExamdetails from './resources/CreateExamdetails'
import CreateExamdetails2 from './resources/CreateExamdetails2'
import CreateOlympiad from './resources/CreateOlympiad'

const Exam = () => {
  return (
    <div className='p-4'>
     <div className="shadow-lg rounded p-4 mb-4 border border-2"
    style={{ position: 'relative', zIndex: 1 }}>
       <CreateExamdetails/>
     </div>
     <div className="shadow-lg rounded p-4 mb-4 border border-2"
    style={{ position: 'relative', zIndex: 1 }}>
       <CreateExamdetails2/>
     </div>
     <div className="shadow-lg rounded p-4 mb-4 border border-2"
    style={{ position: 'relative', zIndex: 1 }}>
       <CreateOlympiad/>
     </div>
    </div>
  )
}

export default Exam