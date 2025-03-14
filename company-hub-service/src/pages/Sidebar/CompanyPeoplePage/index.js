// src/pages/Sidebar/CompanyPeoplePage/index.jsx
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const CompanyPeoplePage = () => {
  const { companyName } = useParams();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Company People
      </Typography>
      <Typography variant="body1">
        {/* People page for company ID: {companyId} */}
        People page for company Name: {companyName}
      </Typography>
    </Box>
  );
};

export default CompanyPeoplePage;