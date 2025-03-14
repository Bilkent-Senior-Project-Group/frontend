/**
 * Frontend mirror of the backend ProjectDTO
 */
export class ProjectRequestDTO {
  constructor(data = {}) {
    // this.ProjectId = data.ProjectId || null;
    this.ClientCompanyId = data.ClientCompanyId || null;
    this.ProviderCompanyId = data.ProviderCompanyId || null;
    this.ProjectName = data.ProjectName || '';
    this.Description = data.Description || '';
    this.TechnologiesUsed = Array.isArray(data.TechnologiesUsed) && data.TechnologiesUsed.length > 0 
      ? data.TechnologiesUsed 
      : ['Not specified'];  // Ensure it's never an empty array
    this.Industry = data.Industry || '';
    this.Impact = data.Impact || '';
    this.ClientType = data.ClientType || '';

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
      ClientType: project.clientType || 'Unknown',  // Default client type if empty
      ClientCompanyId: project.clientCompanyId || null,
        ProviderCompanyId: project.providerCompanyId || null,
    };

    return new ProjectRequestDTO(dto);
  }
}

export default ProjectRequestDTO;