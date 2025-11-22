import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import CssBaseline from '@mui/material/CssBaseline';
import { GlobalToaster } from '../components';
import { colorSchemes, shadows, shape, typography } from './themePrimitives';
import { inputsCustomizations } from './customizations/inputs';
import { dataDisplayCustomizations } from './customizations/dataDisplay';
import { feedbackCustomizations } from './customizations/feedback';
import { navigationCustomizations } from './customizations/navigation';
import { surfacesCustomizations } from './customizations/surfaces';
import { chartsCustomizations } from './customizations/charts';
import { treeViewCustomizations } from './customizations/treeView';
import { ThemeMode } from './utils';

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data',
  },
  colorSchemes,
  typography,
  shadows,
  shape,
  components: {
    ...inputsCustomizations,
    ...dataDisplayCustomizations,
    ...feedbackCustomizations,
    ...navigationCustomizations,
    ...surfacesCustomizations,
    ...chartsCustomizations,
    ...treeViewCustomizations,
  },
});

const AppTheme: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={theme} defaultMode={ThemeMode.Dark}>
      <StyledEngineProvider enableCssLayer>
        <GlobalStyles styles='@layer theme, base, mui, components, utilities;' />
        <CssBaseline enableColorScheme />
        <GlobalToaster />
        {children}
      </StyledEngineProvider>
    </ThemeProvider>
  );
};

export default AppTheme;
