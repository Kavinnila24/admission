import React, { useEffect, useState } from 'react';
import './Dashboard.css';
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
  const [applicationNumber, setApplicationNumber] = useState<string | null>(null);

  const components = [
    { key: 'applicant', label: 'Personal', component: ReadApplicant },
    { key: 'currentaddress', label: 'Current Address', component: ReadCurrentaddress },
    { key: 'permaddress', label: 'Permanent Address', component: ReadPermaddress },
    { key: 'guardian', label: 'Guardian', component: ReadGuardian },
    { key: 'programpreference', label: 'Program Preferences', component: ReadProgrampreference },
    { key: 'examdetails', label: 'JEE MAIN', component: ReadExamdetails },
    { key: 'examdetails2', label: 'JEE ADVANCED', component: ReadExamdetails2 },
    { key: 'olympiad', label: 'Olympiad', component: ReadOlympiad },
    { key: 'educationdetails', label: '12th Board', component: ReadEducationdetails },
    { key: 'educationdetails2', label: '10th Board', component: ReadEducationdetails2 },
  ];

  useEffect(() => {
    const storedAppNumber = sessionStorage.getItem('applicationNumber');
    setApplicationNumber(storedAppNumber);
  }, []);

  const renderActiveComponent = () => {
    const selectedComponent = components.find(comp => comp.key === activeComponent);
    if (selectedComponent) {
      const ComponentToRender = selectedComponent.component;
      return <ComponentToRender />;
    }
    return <div>Component not found</div>;
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="dashboard-title">Application Dashboard</h1>
            </div>
            <div className="col-md-6 text-md-end">
              {applicationNumber && (
                <div className="app-number">
                  <span>Application No: </span>
                  <strong>{applicationNumber}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-container">
        <div className="container-fluid">
          <div className="tabs-wrapper">
            {components.map((comp) => (
              <button
                key={comp.key}
                className={`tab ${activeComponent === comp.key ? 'tab-active' : ''}`}
                onClick={() => setActiveComponent(comp.key)}
              >
                {comp.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content">
        <div className="container-fluid">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;