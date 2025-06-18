
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./Layout.css"; // optional for your styling

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case "/":
      return "Dashboard";
    case "/personal":
      return "Personal Details";
    case "/guardians":
      return "Parent & Guardians Detail";
    case "/preferences":
      return "Programme Preferences";
    case "/exams":
      return "Competitive Exam Details";
    case "/education":
      return "Education Details";
    case "/payment":
      return "Declarations & Payment";
    default:
      return "";
  }
};

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Topbar */}
      <div className="border-bottom border-2 p-3 bg-light d-flex flex-column align-items-center">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/IIIT_Bangalore_Logo.svg/1200px-IIIT_Bangalore_Logo.svg.png" // ✅ Use `public/iiitb_logo.png` or import from assets
          alt="IIITB Logo"
          style={{ height: "60px" }}
          className="border border-dark mb-2"
        />
        <h4>International Institute of Information Technology Bangalore</h4>
        <h5>IMTECH Admission Portal</h5>
        <h6 className="text-primary mt-2">{pageTitle}</h6>
      </div>

      {/* Main Layout: Sidebar + Page */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div className="p-3 border-end border-2" style={{ minWidth: "250px" }}>
          <button className="btn btn-success w-100 mb-2" onClick={() => navigate("/")}>Dashboard</button>
          <button className="btn btn-success w-100 mb-2" onClick={() => navigate("/personal")}>Personal Details</button>
          <button className="btn btn-success w-100 mb-2" onClick={() => navigate("/guardians")}>Parent & Guardians Detail</button>
          <button className="btn btn-success w-100 mb-2" onClick={() => navigate("/preferences")}>Programme Preferences</button>
          <button className="btn btn-success w-100 mb-2" onClick={() => navigate("/exams")}>Competitive Exam Details</button>
          <button className="btn btn-success w-100 mb-2" onClick={() => navigate("/education")}>Education Details</button>
          <button className="btn btn-success w-100" onClick={() => navigate("/payment")}>Declarations & Payment</button>
        </div>

        {/* Page Content */}
        <div className="p-4 w-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;