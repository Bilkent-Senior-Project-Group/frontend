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
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Upload as UploadIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  Edit as EditIcon 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { colors } from '../../theme/theme';

// Import PDF.js
import * as pdfjsLib from 'pdfjs-dist/webpack';
// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
  
  // Add states for loading and notifications
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleCompanyDetailsChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Extract text from PDF using PDF.js
  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      
      let fullText = '';
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      
      return fullText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw error;
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setIsLoading(true);
    setNotification({
      open: true,
      message: 'Analyzing PDF document...',
      severity: 'info'
    });

    try {
      // Extract text from PDF
      const textContent = await extractTextFromPDF(file);
      
      // Parse company details
      const extractedDetails = extractCompanyDetails(textContent);
      
      // Update company details state
      setCompanyDetails(prev => ({
        ...prev,
        ...extractedDetails
      }));
      
      // Extract and set projects
      const extractedProjects = extractProjects(textContent);
      if (extractedProjects && extractedProjects.length > 0) {
        setProjects(extractedProjects);
        setNotification({
          open: true,
          message: `Successfully extracted company details and ${extractedProjects.length} projects`,
          severity: 'success'
        });
      } else {
        setNotification({
          open: true,
          message: 'Company details extracted, but no projects were found',
          severity: 'info'
        });
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      setNotification({
        open: true,
        message: 'Failed to process PDF: ' + error.message,
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const extractCompanyDetails = (text) => {
    const details = {};
    
    // Company name - common patterns
    const companyNamePatterns = [
      /company\s*name\s*[:-]?\s*([A-Za-z0-9\s&\.]+)(?:\r|\n|$)/i,
      /organization\s*[:-]?\s*([A-Za-z0-9\s&\.]+)(?:\r|\n|$)/i,
      /([A-Z][A-Za-z0-9\s&\.]+(?:Inc\.|LLC|Ltd\.|Corp\.|Corporation|Company))(?:\r|\n|$)/
    ];
    
    for (const pattern of companyNamePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        details.name = match[1].trim();
        break;
      }
    }
    
    // Location
    const locationPatterns = [
      /(?:location|address|headquarters)\s*[:-]?\s*([A-Za-z0-9\s,\.]+)(?:\r|\n|$)/i,
      /based\s*in\s*([A-Za-z0-9\s,\.]+)(?:\r|\n|$)/i
    ];
    
    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        details.location = match[1].trim();
        break;
      }
    }
    
    // Founding year
    const yearPattern = /(?:founded|established|started|since)\s*(?:in|:)?\s*(\d{4})(?:\r|\n|$)/i;
    const yearMatch = text.match(yearPattern);
    if (yearMatch && yearMatch[1]) {
      details.foundingYear = yearMatch[1];
    }
    
    // Employee size
    const sizePatterns = [
      /(?:employees|size|staff|team)\s*[:-]?\s*(\d+[\-\s]*\d*)\s*(?:employees|people|staff)?/i,
      /(?:company|team)\s*size\s*[:-]?\s*(\d+[\-\s]*\d*)/i
    ];
    
    for (const pattern of sizePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        details.employeeSize = match[1].replace(/[^\d-]/g, '');
        break;
      }
    }
    
    // Website
    const websitePattern = /(?:website|url|web|visit us at)\s*[:-]?\s*((?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/i;
    const websiteMatch = text.match(websitePattern);
    if (websiteMatch && websiteMatch[1]) {
      let website = websiteMatch[1];
      if (!website.startsWith('http')) {
        website = 'https://' + website;
      }
      details.websiteUrl = website;
    }
    
    // Description - simple regex approach instead of NLP
    const descriptionPatterns = [
      /about(?:\s*us)?(?:\s*:|\s*-|\s*–)?\s*([^\n]{30,500})/i,
      /company\s*(?:description|profile|overview)(?:\s*:|\s*-|\s*–)?\s*([^\n]{30,500})/i,
      /(?:description|overview|profile)(?:\s*:|\s*-|\s*–)?\s*([^\n]{30,500})/i,
      /mission(?:\s*statement)?(?:\s*:|\s*-|\s*–)?\s*([^\n]{30,500})/i
    ];
    
    for (const pattern of descriptionPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        details.description = match[1].trim();
        break;
      }
    }
    
    // If no description found, look for paragraphs that might be about the company
    if (!details.description) {
      // Split text into paragraphs
      const paragraphs = text.split(/\r?\n\r?\n/).filter(p => p.trim().length > 80);
      
      // Look for paragraphs that might contain company descriptions
      const companyKeywords = ['company', 'business', 'organization', 'firm', 'enterprise', 'industry', 'sector', 'service'];
      
      for (const paragraph of paragraphs) {
        // Check if paragraph contains company-related words
        if (companyKeywords.some(keyword => paragraph.toLowerCase().includes(keyword))) {
          details.description = paragraph.trim();
          if (details.description.length > 500) {
            details.description = details.description.substring(0, 497) + '...';
          }
          break;
        }
      }
    }
    
    return details;
  };

  const extractProjects = (text) => {
    const projects = [];
    
    // First, try to find sections containing project information
    const projectSectionPatterns = [
      /projects?(?:\s*information|\s*details|\s*portfolio)?(?:\s*:|(?:\r?\n)){0,2}([\s\S]+?)(?=(?:(?:section|company|about)\b|$))/i,
      /(?:portfolio|case studies|previous work|past projects)(?:\s*:|(?:\r?\n)){0,2}([\s\S]+?)(?=(?:(?:section|company|about)\b|$))/i
    ];
    
    let projectsSection = '';
    for (const pattern of projectSectionPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        projectsSection = match[1];
        break;
      }
    }
    
    if (projectsSection) {
      // Split the projects section into individual projects
      const projectChunks = projectsSection.split(/(?:\r?\n){2,}|(?:project\s*\d+|case\s*study\s*\d+):/i);
      
      projectChunks.forEach(chunk => {
        if (chunk.length < 20) return; // Skip very short chunks
        
        const project = {};
        
        // Project name
        const namePatterns = [
          /(?:name|title|project)[\s:]*([^\r\n]+)(?:\r|\n|$)/i,
          /^([A-Z][^\r\n:]{3,50})(?:\r|\n|$)/m
        ];
        
        for (const pattern of namePatterns) {
          const match = chunk.match(pattern);
          if (match && match[1]) {
            project.name = match[1].trim();
            break;
          }
        }
        
        // If no name found, try to extract one from the first line
        if (!project.name) {
          const firstLine = chunk.split(/\r?\n/)[0].trim();
          if (firstLine && firstLine.length > 3 && firstLine.length < 100) {
            project.name = firstLine;
          }
        }
        
        // Only continue if we found a project name
        if (project.name) {
          // Project description
          const descPatterns = [
            /description[\s:]*([^\r\n]{10,500})/i,
            /overview[\s:]*([^\r\n]{10,500})/i,
            /summary[\s:]*([^\r\n]{10,500})/i
          ];
          
          for (const pattern of descPatterns) {
            const match = chunk.match(pattern);
            if (match && match[1]) {
              project.description = match[1].trim();
              break;
            }
          }
          
          // If no description yet, try to use the main chunk text
          if (!project.description) {
            // Remove the first line (likely the title) and use remainder as description
            const lines = chunk.split(/\r?\n/).slice(1).join(' ').trim();
            if (lines.length > 20 && lines.length < 500) {
              project.description = lines;
            }
          }
          
          // Project type
          const typePatterns = [
            /type[\s:]*([^\r\n,;.]{3,50})/i,
            /category[\s:]*([^\r\n,;.]{3,50})/i,
            /field[\s:]*([^\r\n,;.]{3,50})/i
          ];
          
          for (const pattern of typePatterns) {
            const match = chunk.match(pattern);
            if (match && match[1]) {
              project.type = match[1].trim();
              break;
            }
          }
          
          // Completion date
          const datePatterns = [
            /(?:completed|finished|delivered|completion)(?:\s*date)?[\s:]*([^\r\n,;.]{3,30})/i,
            /date[\s:]*([^\r\n,;.]{3,30})/i
          ];
          
          for (const pattern of datePatterns) {
            const match = chunk.match(pattern);
            if (match && match[1]) {
              project.completionDate = match[1].trim();
              break;
            }
          }
          
          projects.push(project);
        }
      });
    }
    
    // Fallback: look for isolated project references throughout the document
    if (projects.length === 0) {
      const projectPatterns = [
        /project[\s:]*([^\r\n:]{3,100})(?:\r|\n|:)[\s\S]{10,500}?(?=(?:project|$))/gi,
        /case\s*study[\s:]*([^\r\n:]{3,100})(?:\r|\n|:)[\s\S]{10,500}?(?=(?:case\s*study|$))/gi
      ];
      
      for (const pattern of projectPatterns) {
        let match;
        while ((match = pattern.exec(text)) !== null) {
          if (match[1]) {
            const projectName = match[1].trim();
            const contextAfter = text.substring(match.index, match.index + 1000);
            
            // Extract a description from the following text
            let description = '';
            const descMatch = contextAfter.match(/(?:\r?\n|:)([^\r\n]{20,300})/);
            if (descMatch && descMatch[1]) {
              description = descMatch[1].trim();
            }
            
            projects.push({
              name: projectName,
              description: description,
              type: '',
              completionDate: ''
            });
          }
        }
      }
    }
    
    return projects;
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
    // Map to backend data format
    const companyData = {
      CompanyName: companyDetails.name,
      FoundedYear: parseInt(companyDetails.foundingYear) || new Date().getFullYear(),
      Address: companyDetails.location,
      Location: companyDetails.location,
      Website: companyDetails.websiteUrl,
      CompanySize: parseInt(companyDetails.employeeSize) || 0,
      Portfolio: projects.map(project => ({
        Name: project.name,
        Description: project.description,
        Type: project.type,
        CompletionDate: project.completionDate
      }))
    };
    
    console.log('Submitting Company Data:', companyData);
    // TODO: Implement actual submission logic
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
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
          startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <UploadIcon />}
          disabled={isLoading}
          sx={{ 
            mb: 2,
            bgcolor: colors.primary[500],
            '&:hover': { bgcolor: colors.primary[600] }
          }}
        >
          {isLoading ? 'Processing PDF...' : 'Upload PDF'}
          <VisuallyHiddenInput 
            type="file" 
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isLoading}
          />
        </Button>
        
        {isLoading && (
          <Typography variant="body2" sx={{ mt: 1, color: colors.neutral[600] }}>
            Analyzing document with PDF.js...
          </Typography>
        )}
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
                    label={project.type || 'Unspecified'} 
                    size="small" 
                    sx={{ 
                      bgcolor: colors.primary[100],
                      color: colors.primary[700],
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {project.completionDate || 'No date'}
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
          {projects.length === 0 && (
            <Grid item xs={12}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  bgcolor: colors.neutral[50],
                  color: colors.neutral[500],
                  border: `1px dashed ${colors.neutral[300]}`,
                  borderRadius: 2
                }}
              >
                <Typography>
                  No projects found in uploaded document. You can add projects manually or upload a PDF with project details.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}
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
      
      {/* Notifications */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddCompanyPage;