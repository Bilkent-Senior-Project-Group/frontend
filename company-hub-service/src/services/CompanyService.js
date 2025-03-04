import axios from 'axios';

const API_URL = "http://localhost:5133"; // Base URL for the API

// Helper function to get the authentication token
const getAuthToken = () => {
  // Retrieve the token from localStorage or wherever you store it after login
  return localStorage.getItem('token'); // Or however you store your auth token
};

const addCompany = async (companyData) => {
  try {
    // Get the authentication token
    const token = getAuthToken();
    console.log(token);
    if (!token) {
      throw new Error('You must be logged in to add a company');
    }
    
    // const requestPayload = {
    //   companyDto: companyData
    // };
    
    const response = await axios.post(
      `${API_URL}/api/Company/CreateCompany`, 
      companyData, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the auth token
        },
        withCredentials: true
      }
    );
    
    console.log('Company created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error details:', error.response || error);
    
    // Handle 401 Unauthorized errors specifically
    if (error.response?.status === 401) {
      console.error('Authentication error: Your session may have expired. Please log in again.');
      // Optionally redirect to login page or trigger a re-authentication
      // window.location.href = '/login';
      throw new Error('Your session has expired. Please log in again.');
    }
    
    // Get a meaningful error message
    const message = error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      "Failed to create company. Please check your connection and try again.";
      
    console.error('Error creating company:', message);
    throw new Error(message);
  }
};

const CompanyService = {
  addCompany
};

export default CompanyService;