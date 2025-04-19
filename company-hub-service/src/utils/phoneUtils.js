import { getCountries, getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js'

/**
 * Get an array of all countries with their dial codes
 * @returns {Array} Array of objects with country code and name
 */
export const getCountryCodes = () => {
  return getCountries().map(country => ({
    code: `+${getCountryCallingCode(country)}`,
    country: new Intl.DisplayNames(['en'], { type: 'region' }).of(country)
  })).sort((a, b) => a.country.localeCompare(b.country));
};

/**
 * Format a phone number with its country code
 * @param {string} phoneNumber - The phone number to format
 * @param {string} countryCode - The country code (e.g., "US")
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber, countryCode) => {
  if (!phoneNumber) return '';
  
  // If the phone number already has a "+" prefix, return it as is
  if (phoneNumber.startsWith('+')) return phoneNumber;
  
  // Otherwise, add the country code
  const dialCode = `+${getCountryCallingCode(countryCode)}`;
  return `${dialCode} ${phoneNumber}`;
};

/**
 * Validate a phone number
 * @param {string} phoneNumber - The phone number to validate
 * @returns {Object} Object with isValid flag and error message if invalid
 */
export const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) {
        return { isValid: false, error: "Phone number is required" };
    }

    try {
        const parsedNumber = parsePhoneNumberFromString(phoneNumber);
        if (parsedNumber && parsedNumber.isValid()) {
            return { isValid: true };
        } else {
            return { 
                isValid: false, 
                error: "Please enter a valid phone number with country code (e.g., +1 555-123-4567)" 
            };
        }
    } catch (error) {
        return { 
            isValid: false, 
            error: "Invalid phone number format" 
        };
    }
};

export default {
  getCountryCodes,
  formatPhoneNumber,
  validatePhoneNumber
};