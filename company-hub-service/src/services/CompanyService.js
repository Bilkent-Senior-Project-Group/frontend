import axios from 'axios';
import { CreateCompanyRequestDTO } from '../DTO/company/CreateCompanyRequestDTO.js';
import { CompanyProfileDTO } from '../DTO/company/CompanyProfileDTO.js';
import { API_URL } from '../config/apiConfig';

const createCompany = async (companyData, token) => {
  try {
    console.log(token);
    if (!token) {
      throw new Error('You must be logged in to add a company');
    }

    // Convert form data to DTO
    const companyDTO = new CreateCompanyRequestDTO(companyData);

    // Validate before sending
    const validationErrors = companyDTO.validate();
    if (Object.keys(validationErrors).length > 0) {
      throw {
        response: {
          data: {
            errors: validationErrors,
            title: "Validation failed"
          }
        }
      };
    }

    const response = await axios.post(
      `${API_URL}/api/Company/CreateCompany`,
      companyDTO,
      {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the auth token
        },
      }
    );

    console.log('Company created successfully:', response.data);
    return response;
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

const getFeaturedCompanies = async () => {
  try {
    // This endpoint doesn't require authentication based on your backend code
    const response = await axios.get(
      `${API_URL}/api/Company/GetFeaturedCompanies`
    );

    // Log the response to help with debugging
    console.log('Raw featured companies data:', response.data);

    // Convert each company data to a CompanyProfileDTO instance
    // The updated DTO constructor will handle property name differences
    const companies = response.data.map(company => new CompanyProfileDTO(company));

    console.log('Processed company data:', companies);
    return companies;
  } catch (error) {
    console.error('Error fetching featured companies:', error.response || error);

    // Get a meaningful error message
    const message = error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      "Failed to fetch featured companies. Please check your connection and try again.";

    console.error('Error details:', message);
    throw new Error(message);
  }
};

const getCompany = async (companyName, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/Company/GetCompany/${companyName}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('Company data:', response.data);
    return response.data;
  }
  catch (error) {
    console.error('Error fetching company:', error.response || error);

    // Get a meaningful error message
    const message = error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      "Failed to fetch company. Please check your connection and try again.";

    console.error('Error details:', message);
    throw new Error(message);
  }
}
const getCompanyPeople = async (companyId, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/Company/GetUsersOfCompany/${companyId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('Company people data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getCompanyPeople:', error);
    
    // Get a meaningful error message like the other functions
    const message = error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      "Failed to fetch company people. Please check your connection and try again.";
      
    console.error('Error details:', message);
    throw new Error(message);
  }
}

const searchCompaniesByName = async (query, token) => {
  try {
    if (!query || query.trim() === '') {
      return []; // Return empty array for empty queries
    }

    const response = await axios.get(
      `${API_URL}/api/Company/SearchCompaniesByName`,
      {
        params: { query },
        headers: {

          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      }
    );
    console.log('Company search results:', response.data);
    return response.data; // Returns array of {companyId, companyName}
  }
  catch (error) {
    console.error('Error searching companies:', error.response || error);

    // Get a meaningful error message
    const message = error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      "Failed to search companies. Please check your connection and try again.";

    console.error('Error details:', message);
    throw new Error(message);
  }
};

const CompanyService = {
  createCompany,
  getFeaturedCompanies,
  getCompany,
  getCompanyPeople,
  searchCompaniesByName
};

export default CompanyService;