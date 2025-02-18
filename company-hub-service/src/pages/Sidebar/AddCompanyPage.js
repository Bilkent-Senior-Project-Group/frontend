import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Upload as UploadIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  Edit as EditIcon 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { colors } from '../../theme/theme';
import Papa from 'papaparse';
import { PDFDocument } from 'pdf-lib';

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

const AddCompanyPage = () => {
  const [companyDetails, setCompanyDetails] = useState({
    name: '',
    location: '',
    foundingYear: '',
    employeeSize: '',
    websiteUrl: '',
    description: ''
  });

  const [projects, setProjects] = useState([]);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    name: '',
    description: '',
    type: '',
    completionDate: ''
  });
  const [editingProjectIndex, setEditingProjectIndex] = useState(null);

  const handleCompanyDetailsChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // PDF extraction logic
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const textContent = await extractTextFromPDF(pdfDoc);

      // Basic text extraction and parsing
      const extractedDetails = parseCompanyDetails(textContent);
      
      // Update company details with extracted information
      setCompanyDetails(prev => ({
        ...prev,
        ...extractedDetails
      }));
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Failed to extract information from PDF');
    }
  };

  const extractTextFromPDF = async (pdfDoc) => {
    // Simplified text extraction (would need more robust implementation)
    const pages = pdfDoc.getPages();
    let fullText = '';
    for (const page of pages) {
      const textContent = await page.getTextContent();
      fullText += textContent.map(t => t.text).join(' ');
    }
    return fullText;
  };

  const parseCompanyDetails = (text) => {
    // Basic parsing logic - this would need to be much more sophisticated in a real application
    const details = {};
    
    // Simple regex-based extractions (very basic - would need advanced NLP in production)
    const nameMatch = text.match(/Company Name[:\s]*([^\n]+)/i);
    if (nameMatch) details.name = nameMatch[1].trim();

    const locationMatch = text.match(/Location[:\s]*([^\n]+)/i);
    if (locationMatch) details.location = locationMatch[1].trim();

    const yearMatch = text.match(/Founded[:\s]*(\d{4})/i);
    if (yearMatch) details.foundingYear = yearMatch[1];

    const sizeMatch = text.match(/Employees[:\s]*(\d+[-\d]*)/i);
    if (sizeMatch) details.employeeSize = sizeMatch[1];

    const websiteMatch = text.match(/Website[:\s]*(https?:\/\/[^\s]+)/i);
    if (websiteMatch) details.websiteUrl = websiteMatch[1];

    const descriptionMatch = text.match(/About[:\s]*(.{50,300})/is);
    if (descriptionMatch) details.description = descriptionMatch[1].trim();

    return details;
  };

  const handleAddProject = () => {
    if (editingProjectIndex !== null) {
      // Editing existing project
      const updatedProjects = [...projects];
      updatedProjects[editingProjectIndex] = currentProject;
      setProjects(updatedProjects);
      setEditingProjectIndex(null);
    } else {
      // Adding new project
      setProjects(prev => [...prev, currentProject]);
    }
    
    // Reset project dialog
    setCurrentProject({
      name: '',
      description: '',
      type: '',
      completionDate: ''
    });
    setOpenProjectDialog(false);
  };

  const handleEditProject = (index) => {
    setCurrentProject(projects[index]);
    setEditingProjectIndex(index);
    setOpenProjectDialog(true);
  };

  const handleDeleteProject = (index) => {
    setProjects(prev => prev.filter((_, i) => i !== index));
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setCurrentProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Validate and submit company data
    const companyData = {
      ...companyDetails,
      projects
    };
    console.log('Submitting Company Data:', companyData);
    // TODO: Implement actual submission logic
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: colors.neutral[800] }}>
        Add New Company
      </Typography>

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
          Upload Company Document
        </Typography>
        
        <Button
          component="label"
          variant="contained"
          startIcon={<UploadIcon />}
          sx={{ 
            mb: 2,
            bgcolor: colors.primary[500],
            '&:hover': { bgcolor: colors.primary[600] }
          }}
        >
          Upload PDF
          <VisuallyHiddenInput 
            type="file" 
            accept=".pdf"
            onChange={handleFileUpload}
          />
        </Button>
      </Paper>

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
          Company Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company Name"
              name="name"
              value={companyDetails.name}
              onChange={handleCompanyDetailsChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={companyDetails.location}
              onChange={handleCompanyDetailsChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Founding Year"
              name="foundingYear"
              value={companyDetails.foundingYear}
              onChange={handleCompanyDetailsChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Employee Size"
              name="employeeSize"
              value={companyDetails.employeeSize}
              onChange={handleCompanyDetailsChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Website URL"
              name="websiteUrl"
              value={companyDetails.websiteUrl}
              onChange={handleCompanyDetailsChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Description"
              name="description"
              value={companyDetails.description}
              onChange={handleCompanyDetailsChange}
              multiline
              rows={4}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3,
          border: `1px solid ${colors.neutral[200]}`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ color: colors.neutral[700] }}>
            Previous Projects
          </Typography>
          <Button 
            startIcon={<AddIcon />}
            variant="contained"
            sx={{ 
              bgcolor: colors.primary[500],
              '&:hover': { bgcolor: colors.primary[600] }
            }}
            onClick={() => {
              setCurrentProject({
                name: '',
                description: '',
                type: '',
                completionDate: ''
              });
              setEditingProjectIndex(null);
              setOpenProjectDialog(true);
            }}
          >
            Add Project
          </Button>
        </Box>

        <Grid container spacing={3}>
          {projects.map((project, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  position: 'relative',
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {project.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {project.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Chip 
                    label={project.type} 
                    size="small" 
                    sx={{ 
                      bgcolor: colors.primary[100],
                      color: colors.primary[700],
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {project.completionDate}
                  </Typography>
                </Box>
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleEditProject(index)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteProject(index)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ 
            bgcolor: colors.primary[500],
            '&:hover': { bgcolor: colors.primary[600] }
          }}
        >
          Submit Company
        </Button>
      </Box>

      {/* Project Dialog */}
      <Dialog 
        open={openProjectDialog} 
        onClose={() => setOpenProjectDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingProjectIndex !== null ? 'Edit Project' : 'Add New Project'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ pt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Name"
                name="name"
                value={currentProject.name}
                onChange={handleProjectChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Type"
                name="type"
                value={currentProject.type}
                onChange={handleProjectChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Completion Date"
                name="completionDate"
                value={currentProject.completionDate}
                onChange={handleProjectChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Description"
                name="description"
                value={currentProject.description}
                onChange={handleProjectChange}
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProjectDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddProject} color="primary" variant="contained">
            {editingProjectIndex !== null ? 'Update Project' : 'Add Project'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddCompanyPage;