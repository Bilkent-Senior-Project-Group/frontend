import {ProjectDTO} from '../project/ProjectDTO.js';

/**
 * Frontend mirror of the backend CreateCompanyRequestDTO
 */
export class CompanyProfileDTO {
  constructor(data = {}) {
    this.CompanyId = data.CompanyId || null;
    this.Name = data.Name || '';
    this.Description = data.Description || '';
    this.Specialties = data.Specialties || '';
    this.CoreExpertise = Array.isArray(data.CoreExpertise) && data.CoreExpertise.length > 0 
    ? data.CoreExpertise 
    : ['Not specified'];
    this.Verified = data.Verified || false;
    this.Projects = Array.isArray(data.Projects) && data.Projects.length > 0 
    ? data.Projects 
    : ['Not specified'];
    this.Industries = Array.isArray(data.Industries) && data.Industries.length > 0 
    ? data.Industries 
    : ['Not specified'];
    this.Location = data.Location || '';
    this.Website = data.Website || '';
    this.TechnologiesUsed = Array.isArray(data.TechnologiesUsed) && data.TechnologiesUsed.length > 0 
      ? data.TechnologiesUsed 
      : ['Not specified'];  // Ensure it's never an empty array
    this.Partnerships = Array.isArray(data.Partnerships) && data.Partnerships.length > 0 
    ? data.Partnerships 
    : ['Not specified'];
    this.CompanySize = data.CompanySize || 0;
    this.FoundedYear = data.FoundedYear || new Date().getFullYear();
    this.Address = data.Address || '';
    this.ContactInfo = data.ContactInfo || '';
    
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
      Portfolio: projects.map(project => ProjectDTO.fromFormData(project))
    });
  }
}

export default CompanyProfileDTO;