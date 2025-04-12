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
    const projectDTO = ProjectRequestDTO.fromFormData(projectData);

    const response = await axios.post(
      `${API_URL}/api/Project/CreateProjectRequestByName`, 
      projectDTO,
      {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the auth token
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

const getCompanyProjects = async (token) => {
  try {
    if (!token) {
      throw new Error('You must be logged in to view projects');
    }
    
    const response = await axios.get(
      `${API_URL}/api/Project/GetCompanyProjects`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    console.log('Projects fetched successfully:', response.data);
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
      "Failed to fetch projects.";
      
    console.error('Error fetching projects:', message);
    throw new Error(message);
  }
};

const getProjectById = async (projectId, token) => {
  try {
    if (!token) {
      throw new Error('You must be logged in to view project details');
    }
    
    const response = await axios.get(
      `${API_URL}/api/Project/${projectId}`,
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

const updateProject = async (projectId, projectData, token) => {
  try {
    if (!token) {
      throw new Error('You must be logged in to update a project');
    }
    
    // Convert form data to DTO
    const projectDTO = ProjectRequestDTO.fromFormData(projectData);

    const response = await axios.put(
      `${API_URL}/api/Project/${projectId}`, 
      projectDTO,
      {
        headers: {
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

const getProjectRequests = async (token) => {
  try {
    if (!token) {
      throw new Error('You must be logged in to view project requests');
    }
    
    const response = await axios.get(
      `${API_URL}/api/Project/GetProjectRequests`,
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
const approveProjectRequest = async (projectId, token) => {
  try {
    if (!token) {
      throw new Error('You must be logged in to view project requests');
    }
    
    const response = await axios.post(
      `${API_URL}/api/Project/ApproveProjectRequest/${projectId}`,
      {
        headers: {
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
const declineProjectRequest = async (projectId, token) => {
  try {
    if (!token) {
      throw new Error('You must be logged in to view project requests');
    }
    
    const response = await axios.post(
      `${API_URL}/api/Project/ApproveProjectRequest/${projectId}`,
      {
        headers: {
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


//update project ekle




const ProjectService = {
    createProject,
    getCompanyProjects,
    getProjectById,
    updateProject,
    getProjectRequests, 
    approveProjectRequest,
    declineProjectRequest,
    markProjectAsCompleted,
};

export default ProjectService;