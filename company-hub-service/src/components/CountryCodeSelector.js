import React, { useState, useEffect } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  InputAdornment,
  Box,
  Grid
} from '@mui/material';
import { getCountryCodes } from '../utils/phoneUtils';

/**
 * Country code selector component with phone input
 * @param {Object} props - Component props
 * @param {string} props.value - Current phone number value
 * @param {function} props.onChange - Change handler function
 * @param {boolean} props.error - Whether there's an error
 * @param {string} props.helperText - Helper text to display
 * @param {boolean} props.required - Whether the field is required
 */
const CountryCodeSelector = ({ 
  value = '', 
  onChange, 
  error = false, 
  helperText = '', 
  required = false,
  label = 'Phone Number',
  ...props 
}) => {
  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState('+1'); // Default to US
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    // Get all country codes on component mount
    setCountryCodes(getCountryCodes());
    
    // Parse initial value if it exists
    if (value) {
      if (value.startsWith('+')) {
        // Extract the country code and phone number
        const codeEndIndex = value.indexOf(' ');
        if (codeEndIndex > 0) {
          setSelectedCode(value.substring(0, codeEndIndex));
          setPhoneNumber(value.substring(codeEndIndex + 1));
          console.log("selectedCode", selectedCode);
          console.log("phoneNumber", phoneNumber);
        } else {
          // No space found, assume the entire value is a phone number
          setPhoneNumber(value);
        }
      } else {
        setPhoneNumber(value);
      }
    }
  }, [value]);

  const handleCodeChange = (event) => {
    const newCode = event.target.value;
    setSelectedCode(newCode);
    
    // Notify parent of the complete number change
    if (onChange) {
      onChange(`${newCode} ${phoneNumber}`);
    }
  };

  const handlePhoneChange = (event) => {
    const newPhone = event.target.value;
    setPhoneNumber(newPhone);
    
    // Notify parent of the complete number change
    if (onChange) {
      onChange(`${selectedCode} ${newPhone}`);
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="country-code-label">Code</InputLabel>
          <Select
            labelId="country-code-label"
            value={selectedCode}
            onChange={handleCodeChange}
            label="Code"
            size="medium"
          >
            {countryCodes.map((item) => (
              <MenuItem key={item.code} value={item.code}>
                {item.code} ({item.country})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={9}>
        <TextField
          fullWidth
          label={label}
          variant="outlined"
          value={phoneNumber}
          onChange={handlePhoneChange}
          error={error}
          helperText={helperText}
          required={required}
          {...props}
        />
      </Grid>
    </Grid>
  );
};

export default CountryCodeSelector;