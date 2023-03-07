import React from 'react';
import { CircularProgress } from '@mui/material';

const LoadingMarkup = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <CircularProgress color='primary' sx={{ width: '25px', height: '25px' }} />
        </div>
    );
};

export default LoadingMarkup;
