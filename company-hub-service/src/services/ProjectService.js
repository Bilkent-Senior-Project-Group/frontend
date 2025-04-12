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

const ProjectService = {
    createProject
};

export default ProjectService;