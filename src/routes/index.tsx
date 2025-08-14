import BlankLayout from '@/layouts/BlankLayout';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router';
import userRoutes from './user';
import mainRoutes from './main';
import exceptionRoutes from './exception';

const routes: RouteObject[] = [
  {
    path: '/',
    Component: BlankLayout,
    children: [
      {
        index: true,
        element: <Navigate replace to='home' />,
      },
      ...userRoutes,
      ...mainRoutes,
      ...exceptionRoutes,
    ],
  },
];

const router = createBrowserRouter(routes);

export { routes };
export default router;
