import { QueryClientProvider } from 'react-query';
import { RouterProvider } from 'react-router';
import { queryClient } from './utils/reactQuery';
import { ConfigProvider } from 'antd';
import router from '@/routes';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/utils/i18n';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import './global.css';
import 'normalize.css';
import theme from './themes';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ConfigProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme} disableTransitionOnChange defaultMode='dark'>
            <StyledEngineProvider enableCssLayer>
              <GlobalStyles styles='@layer theme, base, mui, components, utilities;' />
              <CssBaseline enableColorScheme />
              <RouterProvider router={router} />
            </StyledEngineProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ConfigProvider>
    </I18nextProvider>
  );
}

export default App;
