import React from 'react';
import { useSelector } from 'react-redux';
import { Experimental_CssVarsProvider as CssVarsProvider, experimental_extendTheme } from '@mui/material/styles';

import { selectCurrentTheme } from '~/redux/userInterfaceSlice';

const customTheme = experimental_extendTheme({
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    main: '#ff5e6c',
                },
                secondary: {
                    main: '#feb300',
                },
            },
        },
        dark: {
            palette: {
                primary: {
                    main: '#5252d4',
                },
                secondary: {
                    main: '#ea37a3',
                },
            },
        },
    },
});

const DarkModeContainer = ({ children }) => {
    const theme = useSelector(selectCurrentTheme);

    return (
        <div data-theme={theme} id='css-vars-custom-theme'>
            <CssVarsProvider theme={customTheme}>{children}</CssVarsProvider>
        </div>
    );
};

export default DarkModeContainer;
