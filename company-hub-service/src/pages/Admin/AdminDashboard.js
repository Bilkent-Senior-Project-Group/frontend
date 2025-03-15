// src/pages/Admin/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminService from '../../services/AdminService';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Button, Container, CircularProgress, Paper, Typography 
} from '@mui/material';

function AdminDashboard() {
  const { user, token } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch companies when currentUser is available
  useEffect(() => {
    if (user && token) {
      getCompaniesToBeVerified(token);
    } else {
      if (token) {
        getCompaniesToBeVerified(token);
      } else {
        setLoading(false);
      }
    }
  }, [user]);
  
  const getCompaniesToBeVerified = async (token) => {
    try {   
      const data = await AdminService.getCompaniesToBeVerified(token);
      if (data) {
        setCompanies(data);
        console.log("Companies to be verified:", data);
      } else {
        setCompanies([]);
        console.log("No companies data returned");
      }
    } catch (error) {
      console.error("Error fetching companies to be verified:", error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (companyId) => {
    try {
      // Use currentUser.token if available, otherwise try localStorage
      if (!token) {
        console.error("No authentication token available");
        return;
      }
      await AdminService.verifyCompany(token, companyId);
      // Refresh the list using the same token
      getCompaniesToBeVerified(token);
    } catch (error) {
      console.error("Error verifying company:", error);
    }
  };

return (
    <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
            Companies Pending Verification
        </Typography>
        {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <CircularProgress />
            </div>
        ) : (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="companies table">
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Website</TableCell>
                            <TableCell>Registration Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {companies.length > 0 ? (
                            companies.map((company, index) => (
                                <TableRow key={company.companyId || index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{company.companyName}</TableCell>
                                    <TableCell>{company.contactInfo}</TableCell>
                                    <TableCell>
                                        {company.registrationDate ? new Date(company.registrationDate).toLocaleDateString() : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            onClick={() => handleVerify(company.companyId)}
                                        >
                                            Verify
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No companies pending verification
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        )}
    </Container>
);
}

export default AdminDashboard;
