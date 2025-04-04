// src/services/AdminService.js

import axios from 'axios';
import { API_URL } from '../config/apiConfig';

const fetchUsers = async (token) => {
  // Example: calling an admin-only endpoint that returns non-sensitive user data
  const response = await axios.get(`${API_URL}/Admin/Users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; // e.g., an array of { id, username, role }
};

// AdminService.js
const updateUserRole = async (token, userId, newRole) => {
    const response = await axios.put(`${API_URL}/Admin/${userId}/Role`, 
      { role: newRole },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  };


    const getCompaniesToBeVerified = async (token) => {
        const response = await axios.get(`${API_URL}/Admin/CompaniesToBeVerified`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    };
  
  
//   // AdminDashboard.js
// const changeRole = async (userId, newRole) => {
//     try {
//       await AdminService.updateUserRole(currentUser.token, userId, newRole);
//       // refresh user list or show success message
//     } catch (err) {
//       console.error('Error updating user role:', err);
//     }
//   };
  
// Add more admin-related functions here, e.g. fetchProjects, deleteUser, etc.

const verifyCompany = async (token, companyId) => {
    // The request body must be just a JSON string with the GUID, not an object
    const response = await axios.put(
      `${API_URL}/Admin/VerifyCompany`,
      `"${companyId}"`, // a raw string with the GUID
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    return response.data;
  };
  
const AdminService = {
    fetchUsers,
    updateUserRole,
    getCompaniesToBeVerified,
    verifyCompany,
//   changeRole,
};

export default AdminService;
