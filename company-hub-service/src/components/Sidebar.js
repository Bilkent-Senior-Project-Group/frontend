import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { FaHome, FaUser, FaCog, FaSignOutAlt, FaFileAlt, FaGreaterThan, FaLessThan } from 'react-icons/fa'; // Example icons
// import {useQuery} from '@tanstack/react-query';


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
      {isCollapsed ? <FaGreaterThan/> : <FaLessThan/>}
        {/* {isCollapsed ? '>' : '<'} */}
      </button>
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <h2>{isCollapsed ? 'C.A.' : 'COMPEDIA'}</h2> {/* Change title to "CH" when collapsed */}
        <ul>
          {/* <li><Link to="/homepage"><FaHome /> {!isCollapsed && 'Home'}</Link></li> */}
          <li><Link to="/homepage"><FaHome /><span className={isCollapsed ? 'collapsed-text' : ''}>Home</span></Link></li>
          <li><Link to="/profile"><FaUser /><span className={isCollapsed ? 'collapsed-text' : ''}>Profile</span></Link></li>
          <li><Link to="/settings"><FaCog /><span className={isCollapsed ? 'collapsed-text' : ''}>Settings</span></Link></li>
          <li><Link to="/logout"><FaSignOutAlt /><span className={isCollapsed ? 'collapsed-text' : ''}>Logout</span></Link></li>
          <li><Link to="/another"><FaFileAlt /><span className={isCollapsed ? 'collapsed-text' : ''}>Another Page</span></Link></li>
        </ul>
      </div>
      <main className={isCollapsed ? 'expanded' : ''}>
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
