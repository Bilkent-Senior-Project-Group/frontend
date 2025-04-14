export class ServiceDTO {
  constructor(data) {
    if (!data) {
      throw new Error('Data is required for ServiceDTO');
    }
    
    this.id = data.id || '';
    this.name = data.name || '';
  }
}
export default ServiceDTO;