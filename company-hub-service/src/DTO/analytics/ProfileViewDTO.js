// ProfileViewDTO.js
/**
 * Frontend mirror of the backend ProfileView model
 */
export class ProfileViewDTO {
    constructor(data = {}) {
        // Only include id if it exists
        if (data.id) {
            this.id = data.id;
        }
        
        this.visitorUserId = data.visitorUserId || null;
        this.companyId = data.companyId || null; // Changed from companyIds array to single companyId
        this.viewDate = data.viewDate || new Date().toISOString(); // Changed from searchDate to viewDate
        this.fromWhere = data.fromWhere !== undefined ? data.fromWhere : 0; // Added fromWhere field
    }

    /**
     * Convert from form data
     */
    static fromFormData(formData) {
        const dto = {
            visitorUserId: formData.visitorUserId,
            companyId: formData.companyId,
            viewDate: formData.viewDate || new Date().toISOString(),
            fromWhere: formData.fromWhere || 0
        };

        // Only include id if it exists
        if (formData.id) {
            dto.id = formData.id;
        }
        
        return new ProfileViewDTO(dto);
    }
}

export default ProfileViewDTO;
