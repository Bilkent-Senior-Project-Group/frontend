export class IndustryDTO {
    constructor(data) {
      if (!data) {
        throw new Error('Data is required for IndustryDTO');
      }
      
      this.id = data.id || '';
      this.name = data.name || '';
    }
  }
  export default IndustryDTO;