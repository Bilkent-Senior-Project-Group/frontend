//to be deleted

/**
 * Frontend mirror of the backend CompanyDTO
 */
export class CompanyDTO {
    constructor(data = {}) {
      // Only include CompanyId if it exists
      if (data.CompanyId) {
        this.CompanyId = data.CompanyId;
      }
      
      this.CompanyName = data.CompanyName || '';
    }
    
    /**
     * Convert from form data
     */
    static fromFormData(company) {
      const dto = {
        CompanyName: company.name || ''
      };
      
      // Only include CompanyId if it exists
      if (company.id) {
        dto.CompanyId = company.id;
    }
      
      return new CompanyDTO(dto);
    }
  }
  
export default CompanyDTO;