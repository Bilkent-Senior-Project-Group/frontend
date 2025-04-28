// src/services/AnalyticsService.js
import axios from 'axios';
import { API_URL } from '../config/apiConfig';

const AnalyticsService = {
  getSearchQueries: async (companyId) => {
    try {
      const response = await axios.get(`${API_URL}/api/analytics/GetSearchQueries/${companyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching search queries:', error);
      throw error;
    }
  },
  
  getProfileViews: async (companyId) => {
    try {
      const response = await axios.get(`${API_URL}/api/analytics/GetProfileViews/${companyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile views:', error);
      throw error;
    }
  },
  
  insertSearchQueryData: async (companyIds, queryText, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/analytics/InsertSearchQueryData`,
        {
          companyIds,
          queryText
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${typeof token === 'string' ? token : token.token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error inserting search query data:', error);
      throw error;
    }
  },
  insertProfileViewData: async (profileViewData) => {
    try {
      const response = await axios.post(`${API_URL}/api/analytics/InsertProfileViewData`, profileViewData);
      return response.data;
    } catch (error) {
      console.error('Error inserting profile view data:', error);
      throw error;
    }
  }
};

export default AnalyticsService;
