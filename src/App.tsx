import { QueryClientProvider } from 'react-query';
import { RouterProvider } from 'react-router';
import { queryClient } from './utils/reactQuery';
import { ConfigProvider } from 'antd';
import router from '@/routes';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/utils/i18n';
import 'normalize.css';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ConfigProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ConfigProvider>
    </I18nextProvider>
  );
}

export default App;
