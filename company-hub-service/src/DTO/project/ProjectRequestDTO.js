/**
 * Frontend mirror of the backend ProjectDTO
 */
export class ProjectRequestDTO {
  constructor(data = {}) {
    
    this.clientCompanyName = data.clientCompanyName || '';
    this.providerCompanyName = data.providerCompanyName || '';
    this.projectName = data.projectName || '';
    this.description = data.description || '';
    this.technologiesUsed = data.technologiesUsed || [];
    this.clientType = data.clientType || '';  
    this.services = data.services || [];
    this.impact = data.impact || '';
    
  }

}

export default ProjectRequestDTO;