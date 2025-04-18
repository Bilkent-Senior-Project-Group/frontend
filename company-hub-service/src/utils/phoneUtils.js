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
 * @returns {boolean} True if valid
 */
export const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return false;

    try {
        const parsedNumber = parsePhoneNumberFromString(phoneNumber);
        return parsedNumber?.isValid() || false;
    } catch (error) {
        return false;
    }
};

export default {
  getCountryCodes,
  formatPhoneNumber,
  validatePhoneNumber
};