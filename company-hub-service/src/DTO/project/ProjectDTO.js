import CompanyDTO from '../company/CompanyDTO.js';
/**
 * Frontend mirror of the backend ProjectDTO
 */
export class ProjectDTO {
  constructor(data = {}) {
    // this.ProjectId = data.ProjectId || null;
    if (data.ProjectId) {
      this.ProjectId = data.ProjectId;
    }
    this.ProjectName = data.ProjectName || '';
    this.Description = data.Description || '';
    this.TechnologiesUsed = Array.isArray(data.TechnologiesUsed) && data.TechnologiesUsed.length > 0 
      ? data.TechnologiesUsed 
      : ['Not specified'];  // Ensure it's never an empty array
    this.Industry = data.Industry || '';
    this.Impact = data.Impact || '';
    this.StartDate = data.StartDate || new Date().toISOString();
    this.CompletionDate = data.CompletionDate || new Date().toISOString();
    this.IsOnCompedia = data.IsOnCompedia || false;
    this.IsCompleted = data.IsCompleted || false;
    this.ProjectUrl = data.ProjectUrl || '';
    this.ClientType = data.ClientType || '';
    this.ClientCompany = data.ClientCompany || null;
    this.ProviderCompany = data.ProviderCompany || null;
    this.Company = data.Company || null;
  }

  /**
   * Convert UI form project data to ProjectDTO
   */
  static fromFormData(project) {
    // Set default fallback values for required fields
    const dto = {
      ProjectName: project.name || 'Untitled Project',  // Default name if empty
      Description: project.description || '',
      TechnologiesUsed: Array.isArray(project.technologiesUsed) && project.technologiesUsed.length > 0 && project.technologiesUsed[0] !== '' 
        ? project.technologiesUsed 
        : ['Not specified'],  // Ensure it's never an empty array
      Industry: project.industry || project.type || '',
      Impact: project.impact || '',
      StartDate: project.startDate ? new Date(project.startDate).toISOString() : new Date().toISOString(),
      CompletionDate: project.completionDate ? new Date(project.completionDate).toISOString() : new Date().toISOString(),
      IsOnCompedia: false,
      IsCompleted: project.isCompleted !== undefined ? project.isCompleted : true,
      ProjectUrl: project.projectUrl || 'https://example.com',  // Default URL if empty
      ClientType: project.clientType || 'Unknown',  // Default client type if empty
      ClientCompany: project.clientCompany || null,
      ProviderCompany: project.providerCompany || null,
      Company: project.company
    };

    // Only include ProjectId if it already exists (for editing existing projects)
    if (project.id) {
      dto.ProjectId = project.id;
    }
    
    if (project.clientCompany) {
      console.log('ClientCompany', project.clientCompany);
      dto.ClientCompany = CompanyDTO.fromFormData(project.clientCompany);
    }
    
    if (project.providerCompany) {
      dto.ProviderCompany = CompanyDTO.fromFormData(project.providerCompany);
    }
    
    if (project.company) {
      dto.Company = CompanyDTO.fromFormData(project.company);
    }
    
    return new ProjectDTO(dto);
  }
}

export default ProjectDTO;