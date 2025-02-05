import React from 'react';
import '../assets/Topbar.css'; // Add custom styles for the topbar
import { FaBell, FaUser, FaSearch } from 'react-icons/fa'; // Example icons
import { Link } from 'react-router-dom';

const Topbar = () => {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <h2>COMPEDIA</h2> {/* Add your app title */}
      </div>
      <div className="topbar-center">
        <input type="text" placeholder="Enter some description" />
        <button><FaSearch /></button>
      </div>
      <div className="topbar-right">
        <FaBell className="topbar-icon" title="Notifications" />
        <Link to="/profile">
          <FaUser className="topbar-icon" title="Profile" />
        </Link>
      </div>
    </div>
  );
};

export default Topbar;