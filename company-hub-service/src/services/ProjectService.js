import axios from 'axios';
import {ProjectRequestDTO} from '../DTO/project/ProjectRequestDTO.js';
import { API_URL } from '../config/apiConfig';

const createProject = async (projectData, token) => {
  try {
    console.log(token);
    if (!token) {
      throw new Error('You must be logged in to create a project');
    }
    
    // Convert form data to DTO
    const projectDTO = new ProjectRequestDTO(projectData);

    const response = await axios.post(
      `${API_URL}/api/Project/CreateProjectRequestByName`, 
      projectDTO,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      }
    );
    
    console.log('Project created successfully:', response.data);
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
      "Failed to create project.";
      
    console.error('Error creating project:', message);
    throw new Error(message);
  }
};

// const getCompanyProjects = async (token) => {
//   try {
//     if (!token) {
//       throw new Error('You must be logged in to view projects');
//     }
    
//     const response = await axios.get(
//       `${API_URL}/api/Project/GetCompanyProjects`,
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       }
//     );
    
//     console.log('Projects fetched successfully:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error details:', error.response || error);
    
//     if (error.response?.status === 401) {
//       console.error('Authentication error: Your session may have expired. Please log in again.');
//       throw new Error('Your session has expired. Please log in again.');
//     }
    
//     const message = error.response?.data?.message ||
//       error.response?.data?.title ||
//       error.response?.data ||
//       "Failed to fetch projects.";
      
//     console.error('Error fetching projects:', message);
//     throw new Error(message);
//   }
// };

const getProjectById = async (projectId, token) => {
  try {
    if (!token) {
      throw new Error('You must be logged in to view project details');
    }
    
    const response = await axios.get(
      `${API_URL}/api/Project/GetProject/${projectId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    console.log('Project details fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error details:', error.response || error);
    
    if (error.response?.status === 401) {
      console.error('Authentication error: Your session may have expired. Please log in again.');
      throw new Error('Your session has expired. Please log in again.');
    }
    
    const message = error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      "Failed to fetch project details.";
      
    console.error('Error fetching project details:', message);
    throw new Error(message);
  }
};

const updateProject = async (projectData, token) => {
  try {
    if (!token) {
      throw new Error('You must be logged in to update a project');
    }

    const response = await axios.post(
      `${API_URL}/api/Project/EditProject`, 
      projectData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    console.log('Project updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error details:', error.response || error);
    
    if (error.response?.status === 401) {
      console.error('Authentication error: Your session may have expired. Please log in again.');
      throw new Error('Your session has expired. Please log in again.');
    }
    
    const message = error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      "Failed to update project.";
      
    console.error('Error updating project:', message);
    throw new Error(message);
  }
};

const getProjectRequests = async (companyId, token) => {
  try {
    if (!token) {
      throw new Error('You must be logged in to view project requests');
    }
    
    const response = await axios.get(
      `${API_URL}/api/Project/GetProjectRequestsOfCompany/${companyId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    console.log('Project requests fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error details:', error.response || error);
    
    if (error.response?.status === 401) {
      console.error('Authentication error: Your session may have expired. Please log in again.');
      throw new Error('Your session has expired. Please log in again.');
    }
    
    // Pass the original error response through so we can check it in the component
    if (error.response) {
      throw error;
    }
    
    const message = error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      "Failed to fetch project requests.";
      
    console.error('Error fetching project requests:', message);
    throw new Error(message);
  }
};

const getSentProjectRequests = async (companyId, token) => {
  try {
    if (!token) {
      throw new Error('You must be logged in to view project requests');
    }
    
    const response = await axios.get(
      `${API_URL}/api/Project/GetSentProjectRequests/${companyId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    console.log('Project requests fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error details:', error.response || error);
    
    if (error.response?.status === 401) {
      console.error('Authentication error: Your session may have expired. Please log in again.');
      throw new Error('Your session has expired. Please log in again.');
    }
    
    // Pass the original error response through so we can check it in the component
    if (error.response) {
      throw error;
    }
    
    const message = error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      "Failed to fetch project requests.";
      
    console.error('Error fetching project requests:', message);
    throw new Error(message);
  }
};

// input projectId might be changed to projectRequestId
// in the future
const approveProjectRequest = async (requestId, token, approveValue) => {
  try {
    if (!token) {
      throw new Error('You must be logged in to view project requests');
    }
    
    const response = await axios.post(
      `${API_URL}/api/Project/ApproveProjectRequest/${requestId}`,
      approveValue, // Send the boolean value directly
      {
        headers: {
          'Content-Type': 'application/json', // Add this important header
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    console.log('Project approved successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error details:', error.response || error);
    
    if (error.response?.status === 401) {
      console.error('Authentication error: Your session may have expired. Please log in again.');
      throw new Error('Your session has expired. Please log in again.');
    }
    
    const message = error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      "Failed to approve project request.";
      
    console.error('Error approving project request:', message);
    throw new Error(message);
  }
};

// input projectId might be changed to projectRequestId
// in the future
//backend method does not exist yet
const declineProjectRequest = async (projectId, token, declineValue ) => {
  try {
    if (!token) {
      throw new Error('You must be logged in to view project requests');
    }
    
    const response = await axios.post(
      `${API_URL}/api/Project/ApproveProjectRequest/${projectId}`,
      declineValue, // Send the boolean value directly
      {
        headers: {
          'Content-Type': 'application/json', // Add this important header
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    console.log('Project declined successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error details:', error.response || error);
    
    if (error.response?.status === 401) {
      console.error('Authentication error: Your session may have expired. Please log in again.');
      throw new Error('Your session has expired. Please log in again.');
    }
    
    const message = error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      "Failed to approve project request.";
      
    console.error('Error approving project request:', message);
    throw new Error(message);
  }
};

const markProjectAsCompleted = async (projectId, token) => {
  try {
    if (!token) {
      throw new Error('You must be logged in to mark project as completed');
    }
    
    const response = await axios.post(
      `${API_URL}/api/Project/MarkProjectAsCompleted/${projectId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    console.log('Project marked as completed successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error details:', error.response || error);
    
    if (error.response?.status === 401) {
      console.error('Authentication error: Your session may have expired. Please log in again.');
      throw new Error('Your session has expired. Please log in again.');
    }
    
    const message = error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      "Failed to mark project as completed.";
      
    console.error('Error marking project as completed:', message);
    throw new Error(message);
  }
};

const editProjectRequest = async (projectData, requestId, token) => {
  try {
    if (!token) {
      throw new Error('You must be logged in to edit project requests');
    }
    
    const response = await axios.put(
      `${API_URL}/api/Project/EditProjectRequest/${requestId}`,
      projectData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    console.log('Project request edited successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error details:', error.response || error);
    
    if (error.response?.status === 401) {
      console.error('Authentication error: Your session may have expired. Please log in again.');
      throw new Error('Your session has expired. Please log in again.');
    }
    
    const message = error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      "Failed to edit project request.";
      
    console.error('Error editing project request:', message);
    throw new Error(message);
  }
}

const deleteSentProjectRequest = async (requestId, token) => {
  try {
    if (!token) {
      throw new Error('You must be logged in to delete project requests');
    }
    
    const response = await axios.delete(
      `${API_URL}/api/Project/DeleteProjectRequest/${requestId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    console.log('Project request deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error details:', error.response || error);
    
    if (error.response?.status === 401) {
      console.error('Authentication error: Your session may have expired. Please log in again.');
      throw new Error('Your session has expired. Please log in again.');
    }
    
    const message = error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      "Failed to delete project request.";
      
    console.error('Error deleting project request:', message);
    throw new Error(message);
  }
}

const isProjectCompletedByClient = async (projectId, token) => {
  try {
    if (!token) {
      throw new Error('You must be logged in to check project completion');
    }
    
    const response = await axios.get(
      `${API_URL}/api/Project/IsProjectCompletedByClient/${projectId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    console.log('Project completion status fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error details:', error.response || error);
    
    if (error.response?.status === 401) {
      console.error('Authentication error: Your session may have expired. Please log in again.');
      throw new Error('Your session has expired. Please log in again.');
    }
    
    const message = error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      "Failed to fetch project completion status.";
      
    console.error('Error fetching project completion status:', message);
    throw new Error(message);
  }
}

const isProjectCompletedByProvider = async (projectId, token) => { 
  try {
    if (!token) {
      throw new Error('You must be logged in to check project completion');
    }
    
    const response = await axios.get(
      `${API_URL}/api/Project/IsProjectCompletedByProvider/${projectId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    console.log('Project completion status fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error details:', error.response || error);
    
    if (error.response?.status === 401) {
      console.error('Authentication error: Your session may have expired. Please log in again.');
      throw new Error('Your session has expired. Please log in again.');
    }
    
    const message = error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data ||
      "Failed to fetch project completion status.";
      
    console.error('Error fetching project completion status:', message);
    throw new Error(message);
  }
}




const ProjectService = {
    createProject,
    // getCompanyProjects,
    getProjectById,
    updateProject,
    getProjectRequests, 
    approveProjectRequest,
    declineProjectRequest,
    markProjectAsCompleted,
    getSentProjectRequests,
    editProjectRequest,
    deleteSentProjectRequest,
    isProjectCompletedByClient,
    isProjectCompletedByProvider,
};

export default ProjectService;