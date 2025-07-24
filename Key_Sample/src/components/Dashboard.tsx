import React, { useState } from 'react';
import ReadApplicant from './resources/ReadApplicant';
import ReadCurrentaddress from './resources/ReadCurrentaddress';
import ReadEducationdetails from './resources/ReadEducationdetails';
import ReadEducationdetails2 from './resources/ReadEducationdetails2';
import ReadExamdetails from './resources/ReadExamdetails';
import ReadExamdetails2 from './resources/ReadExamdetails2';
import ReadGuardian from './resources/ReadGuardian';
import ReadOlympiad from './resources/ReadOlympiad';
import ReadPermaddress from './resources/ReadPermaddress';
import ReadProgrampreference from './resources/ReadProgrampreference';

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState<string>('applicant');

  const components = [
    { key: 'applicant', label: 'Personal Details', component: ReadApplicant },
    { key: 'currentaddress', label: 'Current Address', component: ReadCurrentaddress },
    { key: 'permaddress', label: 'Permanent Address', component: ReadPermaddress },
    { key: 'guardian', label: 'Guardian', component: ReadGuardian },
    { key: 'programpreference', label: 'Program Preference', component: ReadProgrampreference },
    { key: 'examdetails', label: 'Exam Details', component: ReadExamdetails },
    { key: 'examdetails2', label: 'Exam Details 2', component: ReadExamdetails2 },
    { key: 'olympiad', label: 'Olympiad', component: ReadOlympiad },
    { key: 'educationdetails', label: 'Education Details', component: ReadEducationdetails },
    { key: 'educationdetails2', label: 'Education Details 2', component: ReadEducationdetails2 },
  ];

  const renderActiveComponent = () => {
    // if (activeComponent === 'dashboard') {
    //   return (
    //     <div className='d-flex flex-column align-items-center justify-content-center p-4'>
    //       <h1 className='mb-4'>Dashboard</h1>
    //       <div className='mt-4'>
    //         <img
    //           src="aura.jpg"
    //           alt="Dashboard Image"
    //           width={500}
    //           height={500}
    //           className="rounded-lg shadow-lg"
    //           style={{ borderRadius: '8px' }}
    //         />
    //       </div>
    //       <div className='mt-4 text-center'>
    //         <p className='lead'>Welcome to the Admission Management System</p>
    //         <p className='text-muted'>Select a component from the navigation to view data</p>
    //       </div>
    //     </div>
    //   );
    // }

    const selectedComponent = components.find(comp => comp.key === activeComponent);
    if (selectedComponent) {
      const ComponentToRender = selectedComponent.component;
      return <ComponentToRender />;
    }

    return <div>Component not found</div>;
  };

  return (
    <div className='container-fluid'>
      {/* Navigation */}
      <div className='row'>
        <div className='col-12'>
          <nav className='navbar navbar-expand-lg navbar-light bg-light border-bottom mb-4'>
            <div className='container-fluid'>
              {/* <span className='navbar-brand mb-0 h1'>Admission Dashboard</span> */}
              
              <button 
                className='navbar-toggler' 
                type='button' 
                data-bs-toggle='collapse' 
                data-bs-target='#navbarNav'
              >
                <span className='navbar-toggler-icon'></span>
              </button>

              <div className='collapse navbar-collapse' id='navbarNav'>
                <ul className='navbar-nav me-auto'>
                  {components.map((comp) => (
                    <li key={comp.key} className='nav-item'>
                      <button
                        className={`nav-link btn btn-link ${activeComponent === comp.key ? 'active fw-bold' : ''}`}
                        onClick={() => setActiveComponent(comp.key)}
                      >
                        {comp.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className='row'>
        <div className='col-12'>
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;