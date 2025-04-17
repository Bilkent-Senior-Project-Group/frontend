import {ProjectDTO} from '../project/ProjectDTO.js';

/**
 * Frontend mirror of the backend CompanyRequestDTO
 */
export class CompanyProfileDTO {
  constructor(data = {}) {
    // Handle property name differences between backend (lowercase) and frontend (uppercase)
    this.companyId = data.companyId  || null;
    this.name = data.name  || '';
    this.description = data.description || '';
    this.services = Array.isArray(data.services) 
      ? data.services.map(service => ({
        id: service.id || null,
        serviceName: service.serviceName || '',
        industryId: service.industryId || null,
        industryName: service.industryName || '',
        percentage: service.percentage !== undefined ? Number(service.percentage) : 0
      }))
      : [];
    
    // Convert numeric or boolean values to appropriate types
    this.verified = data.verified !== undefined ? Boolean(data.verified) : false;
    
    // Fix inconsistency: projects vs Projects
    this.projects = Array.isArray(data.projects) && 
      (data.projects).length > 0
      ? (data.projects).map(project => {
          if (typeof project === 'object') {
            // Make sure all expected fields are available, with fallbacks
            return {
              projectId: project.projectId || null,
              projectName: project.projectName || '',
              description: project.description || '',
              startDate: project.startDate || null,
              completionDate: project.completionDate || null,
              clientCompanyName: project.clientCompanyName || '',
              providerCompanyName: project.providerCompanyName || '',
              technologiesUsed: project.technologiesUsed || [],
              clientType: project.clientType || '',
              isOnCompedia: project.isOnCompedia !== undefined ? Boolean( project.isOnCompedia) : false,
              isCompleted: (project.isCompleted)!== undefined ? Boolean(project.isCompleted) : false,
              projectUrl: project.projectUrl || '',
              services: project.services || []
            };
          } else {
            return { projectName: project, description: '' };
          }
        })
      : [];
    
    this.location = data.location || -1;
    this.website = data.website || '';
    
    this.partnerships = data.partnerships || []; 
    
    this.companySize = data.companySize !== undefined ? data.companySize : '';
    
    this.foundedYear = data.foundedYear !== undefined ? Number(data.foundedYear) :
                      new Date().getFullYear();
    
    this.address = data.address || '';
    this.phone = data.phone || '';
    this.email = data.email || '';
    this.overallRating = data.overallRating || 0;
    this.city = data.city || '';
    this.country = data.country || '';
    this.totalReviews = data.totalReviews || 0;
  }

}

export default CompanyProfileDTO;