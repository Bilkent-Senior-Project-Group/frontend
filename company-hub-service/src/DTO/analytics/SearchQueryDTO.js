/**
 * Frontend mirror of the backend SearchQueryDTO
 */
export class SearchQueryDTO {
    constructor(data = {}) {
        // Only include id if it exists
        if (data.id) {
            this.id = data.id;
        }
        
        this.visitorId = data.visitorId || null;
        this.companyIds = data.companyIds || []; // Array of GUID strings
        this.queryText = data.queryText || '';
        this.searchDate = data.searchDate || new Date().toISOString(); // ISO date string
    }

    /**
     * Convert from form data
     */
    static fromFormData(searchQuery) {
        const dto = {
            visitorId: searchQuery.visitorId,
            companyIds: searchQuery.companyIds,
            queryText: searchQuery.text || '',
            searchDate: searchQuery.date || new Date().toISOString()
        };

        // Only include id if it exists
        if (searchQuery.id) {
            dto.id = searchQuery.id;
        }
        
        return new SearchQueryDTO(dto);
    }
}

export default SearchQueryDTO;