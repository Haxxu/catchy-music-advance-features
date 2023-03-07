import React from 'react';
import { Button, CircularProgress } from '@mui/material';

const CustomButton = ({ isFetching, fontSize = '1.5rem', fontWeight = '550', children, ...rest }) => {
    return (
        <Button
            color='primary'
            variant='contained'
            size='large'
            sx={{
                fontSize: fontSize,
                fontWeight: fontWeight,
            }}
            {...rest}
        >
            {isFetching ? <CircularProgress size={25} style={{ color: 'var(--secondary-color)' }} /> : children}
        </Button>
    );
};

export default CustomButton;
