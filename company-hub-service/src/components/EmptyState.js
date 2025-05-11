import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

const EmptyState = ({ 
  title, 
  description, 
  actionText, 
  onAction,
  icon,
  illustrationSrc 
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 2,
        border: '1px dashed',
        borderColor: 'divider',
        textAlign: 'center',
        bgcolor: 'background.default'
      }}
    >
      {illustrationSrc ? (
        <Box sx={{ mb: 3, maxWidth: 200, mx: 'auto' }}>
          <img 
            src={illustrationSrc} 
            alt={title} 
            style={{ width: '100%', height: 'auto' }} 
          />
        </Box>
      ) : (
        <Box 
          sx={{ 
            mb: 3, 
            display: 'flex', 
            justifyContent: 'center',
            color: 'primary.main',
            opacity: 0.8
          }}
        >
          {icon}
        </Box>
      )}
      
      <Typography variant="h6" gutterBottom fontWeight="medium">
        {title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mx: 'auto', mb: 3 }}>
        {description}
      </Typography>
      
      {onAction && actionText && (
        <Button
          variant="contained"
          onClick={onAction}
        >
          {actionText}
        </Button>
      )}
    </Paper>
  );
};

export default EmptyState;