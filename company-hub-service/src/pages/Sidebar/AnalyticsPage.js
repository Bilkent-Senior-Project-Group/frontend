import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import AnalyticsService from '../../services/AnalyticsService';
import { useParams } from 'react-router-dom';
import CompanyService from '../../services/CompanyService';
import CompanyProfileDTO from '../../DTO/company/CompanyProfileDTO';

const AnalyticsPage = () => {
    const { user } = useAuth(); // Not using auth currently
    const [company, setCompany] = useState(null);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const { companyName } = useParams();
    const [companyId, setCompanyId] = useState();
    const [profileViews, setProfileViews] = useState([]);
    const [searchQueries, setSearchQueries] = useState([]);
    const [uniqueVisitorCount, setUniqueVisitorCount] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0); // For tracking selected tab
    
    const handleTabChange = (_, newValue) => {
        setSelectedTab(newValue);
    };

    const getUniqueVisitorsCount = (views) => {
        if (!views || views.length === 0) return 0;
        const uniqueIds = new Set(views.map(view => view.visitorUserId));

        console.log("Unique visitor IDs:", uniqueIds);
        return uniqueIds.size;
    };

    const fetchCompany = async () => {
        try {
            const companyData = await CompanyService.getCompany(companyName, token);
            console.log("Backend Company Data:", companyData);
            const companyProfile = new CompanyProfileDTO(companyData);
            setCompany(companyProfile);
            setCompanyId(companyProfile.companyId);
        } catch (error) {
            console.error("Error fetching company:", error.message);
        }
    };
      
    useEffect(() => {
        fetchCompany();
    }, [companyName]);

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const response = await AnalyticsService.getSearchQueries(companyId);
                if (!response) {
                    setError("No data found");
                    return;
                }
                setSearchQueries(response.searchQueries || []);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setSearchQueries([]);
                    console.log("No search queries found for this company");
                } else {
                    setError(err.message || "Failed to fetch search queries");
                    console.error("Error fetching search queries:", err);
                }
            }
        };
        
        const fetchProfileViews = async () => {
            try {
                const response = await AnalyticsService.getProfileViews(companyId, token);
                const formattedViews = response.map(view => ({
                    ...view,
                    date: new Date(view.viewDate).toLocaleDateString()
                }));
                const filteredViews = formattedViews.filter(view => view.visitorUserId !== user.id);
                setUniqueVisitorCount(getUniqueVisitorsCount(filteredViews));
                setProfileViews(filteredViews);
                console.log("Profile Views:", filteredViews);
            } catch (err) {
                setError(err.message);
            }
        };
    
        if (companyId) {
            fetchCompanyData();
            fetchProfileViews();
        }
    }, [companyId, token]);

    
    // Daily views data
    const getDailyViewCounts = () => {
        if (!profileViews || profileViews.length === 0) return [];
        
        const viewsByDay = {};
        
        // Initialize past days (for the last 7 days)
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const day = new Date(today);
            day.setDate(today.getDate() - i); // Go back i days
            
            // Format date as DD/MM/YYYY
            const dayKey = `${day.getDate().toString().padStart(2, '0')}/${
                (day.getMonth() + 1).toString().padStart(2, '0')}/${
                day.getFullYear()}`;
            
            viewsByDay[dayKey] = new Set();
        }
        
        // Add actual profile views
        profileViews.forEach(view => {
            const date = new Date(view.viewDate);
            // Skip future dates
            if (date > today) return;
            
            // Format date as DD/MM/YYYY
            const dayKey = `${date.getDate().toString().padStart(2, '0')}/${
                (date.getMonth() + 1).toString().padStart(2, '0')}/${
                date.getFullYear()}`;
            
            if (!viewsByDay[dayKey]) {
                viewsByDay[dayKey] = new Set();
            }
            viewsByDay[dayKey].add(view.visitorUserId);

            
            
        });
        
        // Convert and sort by date
        return Object.entries(viewsByDay)
            .map(([day, visitors]) => ({
                day,
                uniqueVisitors: visitors.size
            }))
            .sort((a, b) => {
                const [dayA, monthA, yearA] = a.day.split('/').map(Number);
                const [dayB, monthB, yearB] = b.day.split('/').map(Number);
                return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
            });
    };

    const renderChartWithNormalization = (data, timeUnit) => {
        const key = timeUnit === 'day' ? 'day' : timeUnit === 'week' ? 'week' : 'month';
        
        // Find the maximum value to normalize heights, default to 1 if all are zero
        const maxVisitors = Math.max(...data.map(item => item.uniqueVisitors), 1);
        
        return (
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-end',
                height: '220px',
                mt: 2,
                justifyContent: 'space-around',
                position: 'relative'
            }}>
                {data.map((item, index) => {
                    // Calculate height percentage (0-100%)
                    const heightPercentage = Math.max((item.uniqueVisitors / maxVisitors) * 80, 5); // Max 80% of container height, min 5%
                    
                    return (
                        <Box 
                            key={index}
                            sx={{
                                width: `${90 / data.length}%`,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                height: '100%'
                            }}
                        >
                            <Typography variant="caption" sx={{ mb: 0.5 }}>
                                {item.uniqueVisitors}
                            </Typography>
                            <Box 
                                sx={{ 
                                    height: `${heightPercentage}%`,
                                    width: '80%',
                                    borderRadius: '4px',
                                    backgroundColor: item.uniqueVisitors === 0 ? 'grey.300' : 'primary.main',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                        cursor: 'pointer'
                                    }
                                }} 
                            />
                            <Typography variant="caption" sx={{ mt: 0.5, textAlign: 'center', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item[key]}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        );
    };
    
    // Weekly views data
    const getWeeklyViewCounts = () => {
        if (!profileViews || profileViews.length === 0) return [];
        
        const viewsByWeek = {};
        
        // Initialize past weeks (for the last 4 weeks)
        const today = new Date();
        for (let i = 0; i < 4; i++) {
            const monday = new Date(today);
            monday.setDate(today.getDate() - today.getDay() + 1 - (7 * i)); // Go back i weeks
            
            // Format date as DD/MM/YYYY
            const weekKey = `${monday.getDate().toString().padStart(2, '0')}/${
                (monday.getMonth() + 1).toString().padStart(2, '0')}/${
                monday.getFullYear()}`;
            
            viewsByWeek[weekKey] = new Set(); // Create a Set to track unique visitor IDs
        }
        
        // Add actual profile views
        profileViews.forEach(view => {
            if (!view.visitorUserId) return; // Skip if no visitor ID
            
            const date = new Date(view.viewDate);
            // Skip future dates
            if (date > today) return;
            
            // Get the Monday of the current week
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
            const monday = new Date(date);
            monday.setDate(diff);
            
            // Format date as DD/MM/YYYY
            const weekKey = `${monday.getDate().toString().padStart(2, '0')}/${
                (monday.getMonth() + 1).toString().padStart(2, '0')}/${
                monday.getFullYear()}`;
            
            if (!viewsByWeek[weekKey]) {
                viewsByWeek[weekKey] = new Set();
            }
            
            // Add the visitor ID to the set for this week
            viewsByWeek[weekKey].add(view.visitorUserId);

        });
        
        // Convert and sort by date
        return Object.entries(viewsByWeek)
            .map(([week, visitors]) => ({
                week,
                uniqueVisitors: visitors.size
            }))
            .sort((a, b) => {
                const [dayA, monthA, yearA] = a.week.split('/').map(Number);
                const [dayB, monthB, yearB] = b.week.split('/').map(Number);
                return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
            });
    };
    // Monthly views data
    const getMonthlyViewCounts = () => {
        if (!profileViews || profileViews.length === 0) return [];
        
        const viewsByMonth = {};
        
        // Initialize past months with empty sets (for the last 6 months)
        const today = new Date();
        for (let i = 0; i < 6; i++) {
            const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
            
            // Format date as MM/YYYY
            const monthKey = `${(month.getMonth() + 1).toString().padStart(2, '0')}/${month.getFullYear()}`;
            
            viewsByMonth[monthKey] = new Set();
        }
        
        // Add actual profile views
        profileViews.forEach(view => {
            const date = new Date(view.viewDate);
            // Skip future dates
            if (date > today) return;
            
            // Format date as MM/YYYY
            const monthKey = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            
            if (!viewsByMonth[monthKey]) {
                viewsByMonth[monthKey] = new Set();
            }
            viewsByMonth[monthKey].add(view.visitorUserId);
        });
        
        // Sort by date
        return Object.entries(viewsByMonth)
            .map(([month, visitors]) => ({
                month,
                uniqueVisitors: visitors.size
            }))
            .sort((a, b) => {
                const [monthA, yearA] = a.month.split('/').map(Number);
                const [monthB, yearB] = b.month.split('/').map(Number);
                return new Date(yearA, monthA - 1, 1) - new Date(yearB, monthB - 1, 1);
            });
    };
    
    // Find most effective search query
    const getMostEffectiveQuery = () => {
        if (!searchQueries || searchQueries.length === 0) return "No queries found";
        
        // Sort by click count or other relevance metric if available
        const sortedQueries = [...searchQueries].sort((a, b) => 
            (b.clickCount || 0) - (a.clickCount || 0));
            
        return sortedQueries[0]?.queryText || "No queries found";
    };
    
    const dailyData = getDailyViewCounts();
    const weeklyData = getWeeklyViewCounts();
    const monthlyData = getMonthlyViewCounts();
    const mostEffectiveQuery = getMostEffectiveQuery();

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Analytics
            </Typography>
            {error && (
                <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                    <Typography color="error">{error}</Typography>
                </Paper>
            )}
            {company && (
                <Box>
                    <Typography variant="h6">Company Name: {companyName}</Typography>

                    <Paper elevation={3} sx={{ padding: 3, marginY: 2 }}>
                        <Typography variant="h6" gutterBottom>Profile Views</Typography>
                        <Typography variant="body1">
                            {uniqueVisitorCount} unique visitor{uniqueVisitorCount > 1 ? "s" : ""} viewed your profile.
                        </Typography>
                        
                        {/* Profile Views Tabs */}
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                            <Tabs value={selectedTab} onChange={handleTabChange} aria-label="profile views tabs">
                                <Tab label="Daily" />
                                <Tab label="Weekly" />
                                <Tab label="Monthly" />
                            </Tabs>
                        </Box>
                        
                        {/* Tab Content */}
                        <Box sx={{ mt: 2, height: 300 }}>
                            {/* Daily Chart */}
                            {selectedTab === 0 && (
                                <Box>
                                    <Typography variant="subtitle1">Daily Unique Visitors</Typography>
                                    {dailyData.length > 0 ? renderChartWithNormalization(dailyData, 'day') : 
                                        <Typography variant="body2">No daily data available</Typography>}
                                </Box>
                            )}
                            
                            {/* Weekly Chart */}
                            {selectedTab === 1 && (
                                <Box>
                                    <Typography variant="subtitle1">Weekly Unique Visitors</Typography>
                                    {weeklyData.length > 0 ? renderChartWithNormalization(weeklyData, 'week') : 
                                        <Typography variant="body2">No weekly data available</Typography>}
                                </Box>
                            )}
                            
                            {/* Monthly Chart */}
                            {selectedTab === 2 && (
                                <Box>
                                    <Typography variant="subtitle1">Monthly Unique Visitors</Typography>
                                    {monthlyData.length > 0 ? renderChartWithNormalization(monthlyData, 'month') : 
                                        <Typography variant="body2">No monthly data available</Typography>}
                                </Box>
                            )}
                        </Box>
                    </Paper>
                    
                    {/* Most Effective Search Query */}
                    <Paper elevation={3} sx={{ padding: 3, marginY: 2 }}>
                        <Typography variant="h6" gutterBottom>Most Effective Search Query</Typography>
                        <Typography variant="body1">
                            "{mostEffectiveQuery}"
                        </Typography>
                    </Paper>
                </Box>
            )}
        
                {searchQueries.length > 0 && (
                    <Paper elevation={3} sx={{ padding: 3, marginY: 2 }}>
                        <Typography variant="h6" gutterBottom>Search Queries Analysis</Typography>
                        <Typography variant="body1">
                            {searchQueries.length} search query{searchQueries.length > 1 ? "ies" : "y"} found.
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            {searchQueries.map((query, index) => (
                                <Paper key={index} elevation={1} sx={{ padding: 2, marginY: 1 }}>
                                    <Typography variant="body1">Query: "{query.queryText}"</Typography>
                                    <Typography variant="body2">Date: {new Date(query.searchDate).toLocaleDateString()}</Typography>
                                </Paper>
                            ))}
                        </Box>
                    </Paper>
                )}
            </Container>
    );
}
export default AnalyticsPage;
