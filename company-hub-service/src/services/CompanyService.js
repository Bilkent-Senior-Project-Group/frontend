import axios from 'axios';

const API_URL = "http://localhost:5133";  // Base URL for the API

const addCompany = async (companyData) => {
    try {
        const requestPayload = {
            companyDto: companyData
          };
        const response = await axios.post(`${API_URL}/api/company/CreateCompany`, requestPayload, {
        headers: {
            'Content-Type': 'application/json'
        }
        });
        console.log('Company created successfully:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error details:', error.response || error);
        
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
