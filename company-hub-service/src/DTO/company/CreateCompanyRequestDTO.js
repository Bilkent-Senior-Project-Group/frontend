import { Phone } from 'lucide-react';
import {ProjectDTO} from '../project/ProjectDTO.js';

/**
 * Frontend mirror of the backend CreateCompanyRequestDTO
 */
export class CreateCompanyRequestDTO {
  constructor(data = {}) {
    this.companyName = data.companyName || '';
    this.description = data.description || '';
    this.foundedYear = data.foundedYear || new Date().getFullYear();
    this.address = data.address || '';
    this.location = data.location || -1;
    this.website = data.website || '';
    this.companySize = data.companySize || '';
    this.phone = data.phone || '';
    this.email = data.email || '';
    this.portfolio = data.portfolio || [];
    this.services = data.services || [];
    this.partnerships = data.partnerships || [];
  }

  /**
   * Validate based on backend validation attributes
   */
  validate() {
    const errors = {};
    
    // [Required] validations
    if (!this.companyName) {
      errors.companyName = "Company name is required";
    }
    
    if (!this.address) {
      errors.address = "Address is required";
    }
    
    // [Range] validation
    if (this.foundedYear < 1800 || this.foundedYear > 2100) {
      errors.foundedYear = "Foundation year must be between 1800 and 2100";
    }
    
    // [EnsureAtLeastOneProject] validation
    if (!this.portfolio || this.portfolio.length === 0) {
      errors.portfolio = "At least one project is required";
    }
    
    return errors;
  }
}

export default CreateCompanyRequestDTO;