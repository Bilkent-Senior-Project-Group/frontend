import React from 'react';
import { Box, Paper, Typography, Button, Chip } from '@mui/material';
import { ArrowRight } from 'lucide-react';

const FeatureCard = ({ title, description, icon, action, isNew }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
    >
      {isNew && (
        <Chip 
          label="New" 
          color="primary" 
          size="small" 
          sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16,
            fontWeight: 'bold'
          }} 
        />
      )}
      
      <Box sx={{ color: 'primary.main', mb: 2 }}>
        {icon}
      </Box>
      
      <Typography variant="h6" gutterBottom fontWeight="bold">
        {title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        {description}
      </Typography>
      
      <Button 
        endIcon={<ArrowRight size={16} />}
        onClick={action.onClick}
        sx={{ mt: 1 }}
      >
        {action.label}
      </Button>
    </Paper>
  );
};

export default FeatureCard;