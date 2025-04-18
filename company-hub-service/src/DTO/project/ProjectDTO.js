/**
 * Frontend mirror of the backend ProjectDTO
 */
export class ProjectDTO {
  constructor(data = {}) {
    if (data.projectId) {
      this.projectId = data.projectId;
    }
    this.projectName = data.projectName || '';
    this.description = data.description || '';
    this.technologiesUsed =  data.technologiesUsed || [];

    this.startDate = data.startDate || new Date().toISOString();
    this.completionDate = data.completionDate || new Date().toISOString();
    this.isOnCompedia = data.isOnCompedia || false;
    this.isCompleted = data.isCompleted || false;
    this.projectUrl = data.projectUrl || '';
    this.clientType = data.clientType || '';
    this.clientCompanyName = data.clientCompanyName || '';
    this.providerCompanyName = data.providerCompanyName || '';
    this.services = (data.services || []).map(service => ({
      id: service.id,
      name: service.name
    }));
  }

}

export default ProjectDTO;