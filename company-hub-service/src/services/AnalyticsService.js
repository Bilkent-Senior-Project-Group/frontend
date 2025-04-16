// src/services/AnalyticsService.js
import axios from 'axios';
import { API_URL } from '../config/apiConfig';

const AnalyticsService = {
  getSearchQueries: async (companyId) => {
    try {
      const response = await axios.get(`${API_URL}/api/analytics/GetSearchQueries/${companyId}`);
      console.log('Search queries:', response.data);
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
  
  insertSearchQueryData: async (companyIds, queryText) => {
    try {
      const response = await axios.post(`${API_URL}/api/analytics/InsertSearchQueryData`, {
        companyIds,
        queryText
      });
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
