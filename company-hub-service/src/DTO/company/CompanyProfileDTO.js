import {ProjectDTO} from '../project/ProjectDTO.js';

/**
 * Frontend mirror of the backend CreateCompanyRequestDTO
 */
export class CompanyProfileDTO {
  constructor(data = {}) {
    // Handle property name differences between backend (lowercase) and frontend (uppercase)
    this.CompanyId = data.CompanyId || data.companyId || null;
    this.Name = data.Name || data.name || '';
    this.Description = data.Description || data.description || '';
    this.Specialties = data.Specialties || data.specialties || '';
    
    // Handle arrays with proper fallbacks
    this.CoreExpertise = Array.isArray(data.CoreExpertise || data.coreExpertise) && 
      (data.CoreExpertise || data.coreExpertise).length > 0
      ? (data.CoreExpertise || data.coreExpertise)
      : ['Not specified'];
    
    // Convert numeric or boolean values to appropriate types
    this.Verified = data.Verified !== undefined ? Boolean(data.Verified) : 
                   data.verified !== undefined ? Boolean(data.verified) : false;
    
    this.Projects = Array.isArray(data.Projects || data.projects) && 
      (data.Projects || data.projects).length > 0
      ? (data.Projects || data.projects)
      : ['Not specified'];
    
    this.Industries = Array.isArray(data.Industries || data.industries) && 
      (data.Industries || data.industries).length > 0
      ? (data.Industries || data.industries)
      : ['Not specified'];
    
    this.Location = data.Location || data.location || '';
    this.Website = data.Website || data.website || '';
    
    this.TechnologiesUsed = Array.isArray(data.TechnologiesUsed || data.technologiesUsed) && 
      (data.TechnologiesUsed || data.technologiesUsed).length > 0
      ? (data.TechnologiesUsed || data.technologiesUsed)
      : ['Not specified'];
    
    this.Partnerships = Array.isArray(data.Partnerships || data.partnerships) && 
      (data.Partnerships || data.partnerships).length > 0
      ? (data.Partnerships || data.partnerships)
      : ['Not specified'];
    
    this.CompanySize = data.CompanySize !== undefined ? Number(data.CompanySize) : 
                      data.companySize !== undefined ? Number(data.companySize) : 0;
    
    this.FoundedYear = data.FoundedYear !== undefined ? Number(data.FoundedYear) :
                      data.foundedYear !== undefined ? Number(data.foundedYear) : 
                      new Date().getFullYear();
    
    this.Address = data.Address || data.address || '';
    this.Phone = data.Phone || data.phone || '';
    this.Email = data.Email || data.email || '';
  }

  /**
   * Convert form data to DTO
   */
  static fromFormData(formData) {
    const { companyDetails, projects } = formData;
    return new CompanyProfileDTO({
      CompanyName: companyDetails.name,
      Description: companyDetails.description || '',
      FoundedYear: parseInt(companyDetails.foundingYear) || new Date().getFullYear(),
      Address: companyDetails.location || '',
      Location: companyDetails.location || '',
      Website: companyDetails.websiteUrl || '',
      CompanySize: parseInt(companyDetails.employeeSize) || 0,
      Specialties: companyDetails.specialties || '',
      Industries: companyDetails.industries || '',
      ContactInfo: companyDetails.contactInfo || '',
      CoreExpertise: companyDetails.coreExpertise || '',
      Portfolio: projects ? projects.map(project => ProjectDTO.fromFormData(project)) : []
    });
  }
}

export default CompanyProfileDTO;