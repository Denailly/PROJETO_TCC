import React from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { useTheme } from './hooks/theme';

import Routes from './routes';
import { Theme, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
    const {theme} = useTheme();
    
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <Routes/>
            <ToastContainer 
            position='bottom-right'
            theme={theme.title as Theme}/>
        </ThemeProvider>
    );
}

export default App;