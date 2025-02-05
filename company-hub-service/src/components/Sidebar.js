import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { FaHome, FaCompass, FaCog, FaSignOutAlt, FaGreaterThan, FaLessThan, FaBuilding, FaAngleDown, FaAngleRight, FaBars } from 'react-icons/fa'; // Example icons
// import {useQuery} from '@tanstack/react-query';
import Topbar from './Topbar';

const Sidebar = ({ children }) => {
  // State to manage sidebar's width
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCompaniesExpanded, setIsCompaniesExpanded] = useState(false);

  // Function to toggle sidebar width
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Function to toggle companies submenu
  const toggleCompanies = () => {
    setIsCompaniesExpanded(!isCompaniesExpanded);
  };

  return (
    <div className='app-layout'>
      <Topbar/>
      <div className='sidebar-layout'>
        <button className={`sidebar-button ${isCollapsed ? 'collapsed' : ''}`} onClick={toggleSidebar}>
        {/* {isCollapsed ? <FaGreaterThan/> : <FaLessThan/>} */}
        <FaBars/>
          {/* {isCollapsed ? '>' : '<'} */}
        </button>
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
          <ul>
            {/* <li><Link to="/homepage"><FaHome /> {!isCollapsed && 'Home'}</Link></li> */}
            <li><Link to="/homepage"><FaHome /><span className={isCollapsed ? 'collapsed-text' : ''}>Homepage</span></Link></li>
            <li><Link to="/another"><FaCompass /><span className={isCollapsed ? 'collapsed-text' : ''}>Discover</span></Link></li>
            <li><Link to="/settings"><FaCog /><span className={isCollapsed ? 'collapsed-text' : ''}>Settings</span></Link></li>
            {/* <li><Link to="/another"><FaBuilding /><span className={isCollapsed ? 'collapsed-text' : ''}>My Companies</span></Link></li> */}
            <li onClick={toggleCompanies}><a style={{ cursor: 'pointer' }}><FaBuilding /><span className={isCollapsed ? 'collapsed-text' : ''}>My Companies</span>
                {isCollapsed ? null : isCompaniesExpanded ? <FaAngleDown /> : <FaAngleRight />}</a>
            </li>
            {isCompaniesExpanded && (
                <ul className="submenu">
                  <li>
                    <Link to="/companies/company1">Company 1</Link>
                  </li>
                  <li>
                    <Link to="/companies/company2">Company 2</Link>
                  </li>
                  <li>
                    <Link to="/companies/company3">Company 3</Link>
                  </li>
                </ul>
              )}
            <li><Link to="/"><FaSignOutAlt /><span className={isCollapsed ? 'collapsed-text' : ''}>Logout</span></Link></li>
          </ul>
        </div>
        <main className={isCollapsed ? 'expanded' : ''}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
