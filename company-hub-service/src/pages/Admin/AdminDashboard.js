// src/pages/Admin/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminService from '../../services/AdminService';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Button, 
    Container, 
    CircularProgress, 
    Paper,
    Typography 
} from '@mui/material';

function AdminDashboard() {
        const { currentUser } = useAuth();
        const [companies, setCompanies] = useState([]);
        const [loading, setLoading] = useState(true);

        // Note: Users functionality removed as it was not being used

        useEffect(() => {
                getCompaniesToBeVerified();
        }, []);

        const getCompaniesToBeVerified = async () => {
                try {   
                        const response = await AdminService.getCompaniesToBeVerified();
                        setCompanies(response.data);
                }
                catch (error) {
                        console.error("Error fetching companies to be verified:", error);
                }
                finally {
                        setLoading(false);
                }
        };


          
        const handleVerify = async (companyId) => {
                try {
                        await AdminService.verifyCompany(companyId);
                        // Refresh the list after verification
                        getCompaniesToBeVerified();
                } catch (error) {
                        console.error("Error verifying company:", error);
                }
        };

        return (
                <Container sx={{ mt: 4 }}>
                        <Typography variant="h4" gutterBottom>Companies Pending Verification</Typography>
                        {loading ? (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                        <CircularProgress />
                                </div>
                        ) : (
                                <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="companies table">
                                                <TableHead>
                                                        <TableRow>
                                                                <TableCell>Company ID</TableCell>
                                                                <TableCell>Name</TableCell>
                                                                <TableCell>Industry</TableCell>
                                                                <TableCell>Registration Date</TableCell>
                                                                <TableCell>Actions</TableCell>
                                                        </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                        {companies.length > 0 ? (
                                                                companies.map((company) => (
                                                                        <TableRow key={company.id}>
                                                                                <TableCell>{company.id}</TableCell>
                                                                                <TableCell>{company.name}</TableCell>
                                                                                <TableCell>{company.industry}</TableCell>
                                                                                <TableCell>{new Date(company.createdAt).toLocaleDateString()}</TableCell>
                                                                                <TableCell>
                                                                                        <Button
                                                                                                variant="contained"
                                                                                                color="success"
                                                                                                size="small"
                                                                                                onClick={() => handleVerify(company.id)}
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
