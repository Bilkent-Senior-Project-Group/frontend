import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { FaHome, FaUser, FaCog, FaSignOutAlt, FaFileAlt } from 'react-icons/fa'; // Example icons

const Sidebar = ({ children }) => {
  // State to manage sidebar's width
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Function to toggle sidebar width
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div>
      <button className={`sidebar-button ${isCollapsed ? 'collapsed' : ''}`} onClick={toggleSidebar}>
        {isCollapsed ? '>' : '<'}
      </button>
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <h2>{isCollapsed ? 'CH' : 'Company_Hub'}</h2> {/* Change title to "CH" when collapsed */}
        <ul>
          <li><Link to="/homepage"><FaHome /> {!isCollapsed && 'Home'}</Link></li>
          <li><Link to="/profile"><FaUser /> {!isCollapsed && 'Profile'}</Link></li>
          <li><Link to="/settings"><FaCog /> {!isCollapsed && 'Settings'}</Link></li>
          <li><Link to="/logout"><FaSignOutAlt /> {!isCollapsed && 'Logout'}</Link></li>
          <li><Link to="/another"><FaFileAlt /> {!isCollapsed && 'Another Page'}</Link></li>
        </ul>
      </div>
      <main className={isCollapsed ? 'expanded' : ''}>
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
