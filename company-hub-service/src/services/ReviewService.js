import axios from 'axios';
import { API_URL } from '../config/apiConfig';

const postReview = async (reviewData, token) => {
    try {
        if (!token) {
          throw new Error('You must be logged in to post a review.');
        }
    
        const response = await axios.post(
          `${API_URL}/api/Reviews/PostReview`, 
          reviewData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        
        console.log('Review is sent successfully:', response.data);
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
          "Failed to post review.";
          
        console.error('Error posting review:', message);
        throw new Error(message);
      }
}

const getReviewsByCompany = async (companyId, token) => {
    try {
        if (!token) {
          throw new Error('You must be logged in to get reviews.');
        }
    
        const response = await axios.get(
          `${API_URL}/api/Reviews/GetReviewsByCompany/${companyId}`, 
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        
        console.log('Reviews fetched successfully:', response.data);
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
          "Failed to fetch reviews.";
          
        console.error('Error fetching reviews:', message);
        throw new Error(message);
      }
}

const projectHasReview = async (projectId, token) => {
    try {
        if (!token) {
          throw new Error('You must be logged in to check for reviews.');
        }
    
        const response = await axios.get(
          `${API_URL}/api/Reviews/HasReview/${projectId}`, 
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        
        console.log('Project review status fetched successfully:', response.data);
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
          "Failed to check project review status.";
          
        console.error('Error checking project review status:', message);
        throw new Error(message);
      }
}

const ReviewService = {
    postReview,
    getReviewsByCompany,
    projectHasReview,
};

export default ReviewService;