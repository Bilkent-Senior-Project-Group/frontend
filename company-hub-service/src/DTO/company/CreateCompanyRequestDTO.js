import { Phone } from 'lucide-react';
import {ProjectDTO} from '../project/ProjectDTO.js';

/**
 * Frontend mirror of the backend CreateCompanyRequestDTO
 */
export class CreateCompanyRequestDTO {
  constructor(data = {}) {
    this.CompanyName = data.CompanyName || '';
    this.Description = data.Description || '';
    this.FoundedYear = data.FoundedYear || new Date().getFullYear();
    this.Address = data.Address || '';
    this.Specialties = data.Specialties || '';
    this.Industries = data.Industries || '';
    this.Location = data.Location || '';
    this.Website = data.Website || '';
    this.CompanySize = data.CompanySize || 0;
    this.Phone = data.Phone || '';
    this.Email = data.Email || '';
    this.CoreExpertise = data.CoreExpertise || '';
    this.Portfolio = data.Portfolio || [];
  }

  /**
   * Validate based on backend validation attributes
   */
  validate() {
    const errors = {};
    
    // [Required] validations
    if (!this.CompanyName) {
      errors.CompanyName = "Company name is required";
    }
    
    if (!this.Address) {
      errors.Address = "Address is required";
    }
    
    // [Range] validation
    if (this.FoundedYear < 1800 || this.FoundedYear > 2100) {
      errors.FoundedYear = "Foundation year must be between 1800 and 2100";
    }
    
    // [EnsureAtLeastOneProject] validation
    if (!this.Portfolio || this.Portfolio.length === 0) {
      errors.Portfolio = "At least one project is required";
    }
    
    return errors;
  }

  /**
   * Convert form data to DTO
   */
  static fromFormData(formData) {
    const { companyDetails, projects } = formData;
    
    return new CreateCompanyRequestDTO({
      CompanyName: companyDetails.name,
      Description: companyDetails.description || '',
      FoundedYear: parseInt(companyDetails.foundingYear) || new Date().getFullYear(),
      Address: companyDetails.location || '',
      Location: companyDetails.location || '',
      Website: companyDetails.websiteUrl || '',
      CompanySize: parseInt(companyDetails.employeeSize) || 0,
      Specialties: companyDetails.specialties || '',
      Industries: companyDetails.industries || '',
      Phone: companyDetails.phone || '',
      Email: companyDetails.email || '',
      CoreExpertise: companyDetails.coreExpertise || '',
      Portfolio: projects.map(project => ProjectDTO.fromFormData(project))
    });
  }
}

export default CreateCompanyRequestDTO;