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
    // Check if token is an object with userId or just a string
    const userId = token.userId;
    
    const response = await axios.get(
      `${API_URL}/api/Company/GetCompany/${companyName}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${typeof token === 'string' ? token : token.token}`
        }
      }
    );
    console.log('Company data:', response.data);
    console.log('User ID:', userId);
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

const getProjectsOfCompany = async (companyId, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/Company/GetProjectsOfCompany/${companyId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('Company projects data:', response.data);
    return response.data;
  }
  catch (error) {
    console.error('Error in getProjectsOfCompany:', error.response || error);

    // Get a meaningful error message
    const message = error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      "Failed to fetch company projects. Please check your connection and try again.";

    console.error('Error details:', message);
    throw new Error(message);
  }
}

const uploadLogo = async (companyId, logoFile, token) => {
  try {
    if (!companyId) {
      throw new Error('Company ID is required');
    }
    
    if (!logoFile || !(logoFile instanceof File)) {
      throw new Error('A valid image file is required');
    }
    
    // Check if the file is a PNG
    if (!logoFile.type.includes('png')) {
      throw new Error('Only PNG images are supported');
    }

    const formData = new FormData();
    formData.append('file', logoFile);

    const response = await axios.post(
      `${API_URL}/api/Company/UploadLogo/${companyId}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      }
    );

    console.log('Logo uploaded successfully:', response.data);
    return response.data; // Usually contains the URL of the uploaded logo
  } catch (error) {
    console.error('Error uploading logo:', error.response || error);

    // Get a meaningful error message
    const message = error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      "Failed to upload company logo. Please check your file and try again.";

    console.error('Error details:', message);
    throw new Error(message);
  }
}

const getCompaniesOfUser = async (userId, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/Company/GetCompaniesOfUser/${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('User companies data:', response.data);
    return response.data; // Returns array of {companyId, companyName}
  }
  catch (error) {
    console.error('Error in getCompaniesOfUser:', error.response || error);

    // Get a meaningful error message
    const message = error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      "Failed to fetch user companies. Please check your connection and try again.";

    console.error('Error details:', message);
    throw new Error(message);
  }
}

const deleteLogo = async (companyId, token) => {    
  try {
    if (!companyId) {
      throw new Error('Company ID is required');
    }

    const response = await axios.delete(
      `${API_URL}/api/Company/DeleteLogo/${companyId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );

    console.log('Logo deleted successfully:', response.data);
    return response.data; // Usually contains a success message
  } catch (error) {
    console.error('Error deleting logo:', error.response || error);

    // Get a meaningful error message
    const message = error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      "Failed to delete company logo. Please check your connection and try again.";

    console.error('Error details:', message);
    throw new Error(message);
  }
}

const CompanyService = {
  createCompany,
  getFeaturedCompanies,
  getCompany,
  getCompanyPeople,
  searchCompaniesByName,
  getProjectsOfCompany,
  uploadLogo,
  deleteLogo,
  getCompaniesOfUser
};

export default CompanyService;