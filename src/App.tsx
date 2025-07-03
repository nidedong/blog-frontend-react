import { QueryClientProvider } from 'react-query';
import { Outlet, RouterProvider } from 'react-router';
import { queryClient } from './utils/reactQuery';
import { ConfigProvider } from 'antd';
import router from '@/routes';

function App() {
  return (
    <ConfigProvider>
      <RouterProvider router={router}>
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </RouterProvider>
    </ConfigProvider>
  );
}

export default App;
