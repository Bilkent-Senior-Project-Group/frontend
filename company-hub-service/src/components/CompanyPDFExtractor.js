import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Upload as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { colors } from '../theme/theme';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const CompanyPDFExtractor = ({ onExtracted }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // We don't need to store the API key in the frontend anymore
  // The backend already has the key hardcoded

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  const handleExtract = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file first');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      // Create form data for API request
      const formData = new FormData();
      formData.append('file', selectedFile);
  
      // Use absolute URL to backend API
      // Change this to match your .NET backend URL and port
      const API_URL = 'http://localhost:5133'; // or http://localhost:5000
        const response = await axios.post(
        `${API_URL}/api/company/extract-from-pdf`,
        formData,
        {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        }
        );
  
      // Process the response
      if (response.status === 200 && response.data) {
        // The backend already returns JSON, no need to parse
        let extractedData = response.data;
        
        // If the response is a string (JSON), parse it
        if (typeof response.data === 'string') {
          extractedData = JSON.parse(response.data);
        }
        
        // Map the extracted data to the format expected by the parent component
        const mappedData = {
          companyDetails: {
            name: extractedData.companyName || '',
            location: extractedData.location || '',
            foundingYear: extractedData.foundingYear || '',
            employeeSize: extractedData.employeeSize || '',
            websiteUrl: extractedData.websiteUrl || '',
            description: extractedData.description || ''
          },
          projects: extractedData.projects?.map(project => ({
            name: project.name || '',
            description: project.description || '',
            type: project.type || '',
            completionDate: project.completionDate || ''
          })) || []
        };
  
        // Pass the mapped data to parent component
        onExtracted(mappedData);
      } else {
        throw new Error('Failed to extract data from PDF');
      }
    } catch (err) {
      console.error('Error extracting data:', err);
      setError('Failed to extract data from PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 4, 
        mb: 4, 
        borderRadius: 3,
        border: `1px solid ${colors.neutral[200]}`,
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ mb: 3, color: colors.neutral[700] }}>
        Upload Company PDF
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {!selectedFile ? (
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadIcon />}
            sx={{ mb: 2 }}
          >
            Upload PDF
            <VisuallyHiddenInput type="file" accept=".pdf" onChange={handleFileChange} />
          </Button>
        ) : (
          <Box sx={{ width: '100%', mb: 2 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: colors.neutral[50],
                border: `1px solid ${colors.neutral[200]}`,
                borderRadius: 2
              }}
            >
              <Typography noWrap sx={{ maxWidth: '70%' }}>
                {selectedFile.name}
              </Typography>
              <IconButton 
                size="small" 
                onClick={handleClearFile}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Paper>
          </Box>
        )}
        
        {selectedFile && (
          <Button
            variant="contained"
            onClick={handleExtract}
            disabled={isLoading}
            sx={{ 
              bgcolor: colors.primary[500],
              '&:hover': { bgcolor: colors.primary[600] },
              mb: 2
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Extract Data'}
          </Button>
        )}
        
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Upload a company profile PDF to automatically extract company details and project information.
          Supported formats: .pdf
        </Typography>
      </Box>
    </Paper>
  );
};

export default CompanyPDFExtractor;