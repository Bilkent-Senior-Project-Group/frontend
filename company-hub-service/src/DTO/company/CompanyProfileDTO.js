import {ProjectDTO} from '../project/ProjectDTO.js';

/**
 * Frontend mirror of the backend CompanyRequestDTO
 */
export class CompanyProfileDTO {
  constructor(data = {}) {
    // Handle property name differences between backend (lowercase) and frontend (uppercase)
    this.companyId = data.CompanyId || data.companyId || null;
    this.name = data.Name || data.name || '';
    this.description = data.Description || data.description || '';
    this.specialties = data.Specialties || data.specialties || '';
    
    // Handle arrays with proper fallbacks
    this.coreExpertise = Array.isArray(data.CoreExpertise || data.coreExpertise) && 
      (data.CoreExpertise || data.coreExpertise).length > 0
      ? (data.CoreExpertise || data.coreExpertise)
      : ['Not specified'];
    
    // Convert numeric or boolean values to appropriate types
    this.verified = data.Verified !== undefined ? Boolean(data.Verified) : 
                   data.verified !== undefined ? Boolean(data.verified) : false;
    
    // Fix inconsistency: projects vs Projects
    this.projects = Array.isArray(data.Projects || data.projects) && 
      (data.Projects || data.projects).length > 0
      ? (data.Projects || data.projects).map(project => {
          if (typeof project === 'object') {
            // Make sure all expected fields are available, with fallbacks
            return {
              projectName: project.ProjectName || project.projectName || '',
              description: project.Description || project.description || '',
              startDate: project.StartDate || project.startDate || null,
              endDate: project.EndDate || project.endDate || null,
              client: project.Client || project.client || '',
              technologies: project.Technologies || project.technologies || [],
              projectUrl: project.ProjectUrl || project.projectUrl || '',
              imageUrl: project.ImageUrl || project.imageUrl || ''
            };
          } else {
            return { projectName: project, description: '' };
          }
        })
      : [];
    
    this.industries = Array.isArray(data.Industries || data.industries) && 
      (data.Industries || data.industries).length > 0
      ? (data.Industries || data.industries)
      : ['Not specified'];
    
    this.location = data.Location || data.location || '';
    this.website = data.Website || data.website || '';
    
    this.technologiesUsed = Array.isArray(data.TechnologiesUsed || data.technologiesUsed) && 
      (data.TechnologiesUsed || data.technologiesUsed).length > 0
      ? (data.TechnologiesUsed || data.technologiesUsed)
      : ['Not specified'];
    
    this.partnerships = Array.isArray(data.Partnerships || data.partnerships) && 
      (data.Partnerships || data.partnerships).length > 0
      ? (data.Partnerships || data.partnerships)
      : ['Not specified'];
    
    this.companySize = data.CompanySize !== undefined ? data.CompanySize : 
                      data.companySize !== undefined ? data.companySize : '';
    
    this.foundedYear = data.FoundedYear !== undefined ? Number(data.FoundedYear) :
                      data.foundedYear !== undefined ? Number(data.foundedYear) : 
                      new Date().getFullYear();
    
    this.address = data.Address || data.address || '';
    this.phone = data.Phone || data.phone || '';
    this.email = data.Email || data.email || '';
  }

  /**
   * Convert form data to DTO
   */
  static fromFormData(formData) {
    const { companyDetails, projects } = formData;
    return new CompanyProfileDTO({
      name: companyDetails.name,
      description: companyDetails.description || '',
      foundedYear: parseInt(companyDetails.foundingYear) || new Date().getFullYear(),
      address: companyDetails.location || '',
      location: companyDetails.location || '',
      website: companyDetails.websiteUrl || '',
      companySize: companyDetails.employeeSize || '',
      specialties: companyDetails.specialties || '',
      industries: companyDetails.industries || '',
      contactInfo: companyDetails.contactInfo || '',
      coreExpertise: companyDetails.coreExpertise || '',
      projects: projects ? projects.map(project => ProjectDTO.fromFormData(project)) : []
    });
  }
}

export default CompanyProfileDTO;