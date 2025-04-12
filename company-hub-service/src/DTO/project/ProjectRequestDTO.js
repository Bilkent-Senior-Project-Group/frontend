/**
 * Frontend mirror of the backend ProjectDTO
 */
export class ProjectRequestDTO {
  constructor(data = {}) {
    
    this.ClientCompanyName = data.ClientCompanyName || data.clientCompanyName || '';
    this.ProviderCompanyName = data.ProviderCompanyName || data.providerCompanyName || '';
    this.ProjectName = data.ProjectName || data.projectName || '';
    this.Description = data.Description || data.description || '';
    this.TechnologiesUsed = Array.isArray(data.TechnologiesUsed || data.technologiesUsed) && 
      (data.TechnologiesUsed.length || data.technologiesUsed.length) > 0 
      ? (data.TechnologiesUsed || data.technologiesUsed)
      : ['Not specified'];  // Ensure it's never an empty array
    this.Industry = data.Industry || data.industry || '';
    this.ClientType = data.ClientType || data.clientType || '';  
    this.Impact = data.Impact || data.impact || '';
    
  }

  /**
   * Convert UI form project data to ProjectDTO
   */
  static fromFormData(project) {
    // Set default fallback values for required fields
    const dto = {
      ClientCompanyName: project.clientCompanyName || '',  // Match DTO structure
      ProviderCompanyName: project.providerCompanyName || '',  // Match DTO structure
      ProjectName: project.name || 'Untitled Project',  // Default name if empty
      Description: project.description || '',
      TechnologiesUsed: Array.isArray(project.technologiesUsed) && project.technologiesUsed.length > 0 && project.technologiesUsed[0] !== '' 
        ? project.technologiesUsed 
        : ['Not specified'],  // Ensure it's never an empty array
      Industry: project.industry || '',
      ClientType: project.clientType || 'Unknown',  // Default client type if empty
      Impact: project.impact || '',
    };

    return new ProjectRequestDTO(dto);
  }

}

export default ProjectRequestDTO;