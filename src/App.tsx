import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { queryClient } from './utils/reactQuery';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import router from '@/routes';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/utils/i18n';
import './global.css';
import 'normalize.css';
import AppTheme from './themes';

const isDev = import.meta.env.DEV;

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <AppTheme>
          <RouterProvider router={router} />
          {isDev && <ReactQueryDevtools initialIsOpen={false} />}
        </AppTheme>
      </QueryClientProvider>
    </I18nextProvider>
  );
}

export default App;
