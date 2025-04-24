import axios from 'axios';
import { API_URL } from '../config/apiConfig';

const inviteUser = async (email, companyId, token) => {
    try {
        if (!token) {
          throw new Error('You must be logged in to invite a user.');
        }
    
        const response = await axios.post(
          `${API_URL}/api/Company/InviteUser`, 
          { email, companyId },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        
        console.log('User invited successfully:', response.data);
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
          "Failed to invite user.";
          
        console.error('Error inviting user:', message);
        throw new Error(message);
      }
}

const getMyInvitations = async (token) => {
    try {
        if (!token) {
          throw new Error('You must be logged in to view your invitations.');
        }
    
        const response = await axios.get(
          `${API_URL}/api/User/MyInvitations`, 
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        
        console.log('My invitations fetched successfully:', response.data);
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
          "Failed to fetch invitations.";
          
        console.error('Error fetching invitations:', message);
        throw new Error(message);
      }
}

const acceptInvitation = async (invitationData, token) => {
    try {
        if (!token) {
          throw new Error('You must be logged in to accept an invitation.');
        }
    
        const response = await axios.post(
          `${API_URL}/api/User/AcceptInvitation`, 
          // Use the invitationData object directly
          invitationData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        
        console.log('Invitation accepted successfully:', response.data);
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
          "Failed to accept invitation.";
          
        console.error('Error accepting invitation:', message);
        throw new Error(message);
      }
}

const rejectInvitation = async (invitationData, token) => {
    try {
        if (!token) {
          throw new Error('You must be logged in to reject an invitation.');
        }
    
        const response = await axios.post(
          `${API_URL}/api/User/RejectInvitation`, 
          // Use the invitationData object directly
          invitationData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        
        console.log('Invitation rejected successfully:', response.data);
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
          "Failed to reject invitation.";
          
        console.error('Error rejecting invitation:', message);
        throw new Error(message);
      }
}

const UserInvitationService = {
    inviteUser,
    getMyInvitations,
    acceptInvitation,
    rejectInvitation,
    
};

export default UserInvitationService;