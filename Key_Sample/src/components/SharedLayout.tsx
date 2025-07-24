import React, { useState, useEffect, ReactNode } from 'react';
import styles from './SharedLayout.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileImageUploader from './ProfileImageUploader';

interface SharedLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case "/dashboard":
      return "Dashboard";
    case "/personal":
      return "Personal Details";
    case "/guardian":
      return "Parent & Guardians Details";
    case "/preference":
      return "Program Preferences";
    case "/exam":
      return "Competitive Exam Details";
    case "/education":
      return "Education Details";
    case "/payment":
      return "Declarations & Payment";
    default:
      return "IMTECH/BTECH Admission Portal";
  }
};

const SharedLayout: React.FC<SharedLayoutProps> = ({ children, pageTitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Get page title from props or derive from location
  const currentPageTitle = pageTitle || getPageTitle(location.pathname);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-collapse sidebar on mobile
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navigateToPage = (path: string) => {
    navigate(path);
    // Auto-close sidebar on mobile after navigation
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  return (
    <div className={styles.layoutContainer}>
      {/* Menu Toggle Button */}
      <button 
        className={`${styles.menuToggleBtn} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <div className={styles.hamburgerIcon}>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </div>
      </button>

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <div className={styles.logoCircle}>
            {/* IIIT Bangalore logo will be shown via CSS background-image */}
          </div>
          <div className={styles.instituteName}>
            International Institute of<br />
            Information Technology<br />
            Bangalore
          </div>
        </div>

        {/* Navigation Menu */}
        <div className={styles.navMenu}>
          <button 
            className={`${styles.navItem} ${isActiveRoute('/dashboard') ? styles.active : ''}`}
            onClick={() => navigateToPage('/dashboard')}
          >
            <span className={styles.navIcon}>⊞</span>
            <span className={styles.navText}>Dashboard</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${isActiveRoute('/personal') ? styles.active : ''}`}
            onClick={() => navigateToPage('/personal')}
          >
            <span className={styles.navIcon}>👤</span>
            <span className={styles.navText}>Personal Details</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${isActiveRoute('/guardian') ? styles.active : ''}`}
            onClick={() => navigateToPage('/guardian')}
          >
            <span className={styles.navIcon}>👥</span>
            <span className={styles.navText}>Parent & Guardians Detail</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${isActiveRoute('/preference') ? styles.active : ''}`}
            onClick={() => navigateToPage('/preference')}
          >
            <span className={styles.navIcon}>⚙️</span>
            <span className={styles.navText}>Programme Preferences</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${isActiveRoute('/exam') ? styles.active : ''}`}
            onClick={() => navigateToPage('/exam')}
          >
            <span className={styles.navIcon}>📝</span>
            <span className={styles.navText}>Competitive Exam Details</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${isActiveRoute('/education') ? styles.active : ''}`}
            onClick={() => navigateToPage('/education')}
          >
            <span className={styles.navIcon}>🎓</span>
            <span className={styles.navText}>Education Details</span>
          </button>
          
          <button 
            className={`${styles.navItem} ${isActiveRoute('/payment') ? styles.active : ''}`}
            onClick={() => navigateToPage('/payment')}
          >
            <span className={styles.navIcon}>💳</span>
            <span className={styles.navText}>Declarations & Payment</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        <div className={styles.contentHeader}>
          <div className={styles.pageTitle}>{currentPageTitle}</div>
          {/* <div className={styles.userProfile}>
            <ProfileImageUploader />
          </div> */}
        </div>
        <div className={styles.contentBody}>
          <div className={styles.formContent}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedLayout;
