import React, { useState, useEffect } from 'react';
import "./Page1.css";
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import ProfileImageUploader from './ProfileImageUploader';

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case "/dashboard":
      return "Dashboard";
    case "/personal":
      return "Personal Details";
    case "/guardian":
      return "Parent & Guardians Details";
    case "/preference":
      return "Programme Preferences";
    case "/exam":
      return "Competitive Exam Details";
    case "/education":
      return "Education Details";
    case "/payment":
      return "Declarations & Payment";
    default:
      return "";
  }
};

export default function Page1() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState<string>(location.pathname);
  
  const pageTitle = getPageTitle(location.pathname);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <>
      <div id="id-1" className="border border-2" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex' }}>
          {/* Logo Section - Collapsible */}
          <div 
            id="id-3" 
            className="border border-2 "
            style={{
              width: isSidebarCollapsed ? '0px' : '18rem',
              minWidth: isSidebarCollapsed ? '0px' : '18rem',
              overflow: 'hidden',
              transition: '0.3s ease-in-out',
              transform: isSidebarCollapsed ? 'translateX(-100%)' : 'translateX(0)'
            }}
          >
            <div id="id-5" className="border border-0 p-1">
              <div id="id-7" className="border border-0 p-2">
                <link rel="preload" as="image" href="https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/IIIT_Bangalore_Logo.svg/1200px-IIIT_Bangalore_Logo.svg.png"/>
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/IIIT_Bangalore_Logo.svg/1200px-IIIT_Bangalore_Logo.svg.png" alt="" className="d-flex flex-column border border-2 border-dark" id="id-9"/>
              </div>
              <div id="id-B" className="border border-0">
                <div className="border-0" id="id-D">International Institute of Information Technology Bangalore</div>
              </div>
            </div>
          </div>
          {/* Header Section - Expands to full width */}
          <div 
            id="id-F" 
            className="border border-0 p-5 flex-1 transition-all duration-300 ease-in-out" 
            style={{ position: 'relative' }}
          >
            {/* Hamburger Menu Button */}
            <button 
  className="btn btn-link p-0 position-absolute"
  onClick={toggleSidebar}
  style={{ 
    left: '15px', 
    top: '15px', 
    height: '35px',
    width: '35px',
    color: '#ffffff',           // text color
    backgroundColor: '#e1eaf0', // Bootstrap primary blue
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '20px',
    zIndex: 1000,
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    border: '2px solidrgb(44, 44, 44)', // border color
  }}
  title={isSidebarCollapsed ? "Show Menu" : "Hide Menu"}
>
              <span style={{ display: 'block', width: '31px', height: '5px', backgroundColor: '#2196f3', margin: '3px 0' }}></span>
              <span style={{ display: 'block', width: '31px', height: '5px', backgroundColor: '#2196f3', margin: '3px 0' }}></span>
              <span style={{ display: 'block', width: '31px', height: '5px', backgroundColor: '#2196f3', margin: '3px 0' }}></span>
            </button>
            
            <div id="id-H" className="border border-0 h-50">
              <div className="border-0 w-50" id="id-J" style={{ marginLeft: '50px' }}>
                IMTECH/BTECH Admission Portal
              </div>
              <h4 className="text-xl font-semibold text-white mt-5 mb-2 tracking-wide" style={{ marginLeft: '50px' }}>{pageTitle}</h4>
            </div>
            <div id="id-profile" style={{marginLeft: 'auto', marginRight: '20px'}}>
              <ProfileImageUploader/>                  
            </div>
          </div>
        </div>

        <div id="id-L" className="border border-0 mt-2" style={{ display: 'flex', position: 'relative' }}>
          {/* Sidebar */}
          <div 
            id="id-N" 
            className="border border-0 "
            style={{
              width: isSidebarCollapsed ? '0px' : '18rem',
              minWidth: isSidebarCollapsed ? '0px' : '18rem',
              overflow: 'hidden',
              transform: isSidebarCollapsed ? 'translateX(-100%)' : 'translateX(0)',
              position: isSidebarCollapsed ? 'absolute' : 'relative',
              zIndex: 999,
              backgroundColor: 'white',
              transition: '0.3s ease-in-out',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div id="id-P" className="border border-0 h-50 mt-4">
              <div id="id-R" className="border border-0 h-75">
                <button 
                  className="btn btn-success w-100" 
                  id="id-T" 
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </button>
                <button 
                  className="btn btn-success w-100 mt-2" 
                  id="id-V" 
                  onClick={() => navigate("/personal")}
                >
                  Personal Details
                </button>
                <button 
                  className="btn btn-success w-100 mt-2" 
                  id="id-X" 
                  onClick={() => navigate("/guardian")}
                >
                  Parent & Guardians Detail
                </button>
                <button 
                  className="btn btn-success w-100 mt-2" 
                  id="id-Z" 
                  onClick={() => navigate("/preference")}
                >
                  Programme Preferences
                </button>
                <button 
                  className="btn btn-success w-100 mt-2" 
                  id="id-11" 
                  onClick={() => navigate("/exam")}
                >
                  Competitive Exam Details
                </button>
                <button 
                  className="btn btn-success w-100 mt-2" 
                  id="id-13" 
                  onClick={() => navigate("/education")}
                >
                  Education Details
                </button>
                <button 
                  className="btn btn-success w-100 mt-2" 
                  id="id-15" 
                  onClick={() => navigate("/payment")}
                >
                  Declarations & Payment
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div 
            className="form-wrapper relative z-[1] flex-1"
            style={{ 
              marginTop: '-100px',
              marginLeft: isSidebarCollapsed ? '250px' : '150px',
            
              transition: '0.7s ease-in-out'
            }}
            id="forms"
          >
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}