import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import Forget from '@/pages/Auth/Forget';
import { Navigate, RouteObject } from 'react-router';

const authRoutes: RouteObject[] = [
  {
    path: 'user',
    children: [
      {
        index: true,
        element: <Navigate to='login' replace />,
      },
      {
        path: 'login',
        Component: Login,
      },
      {
        path: 'register',
        Component: Register,
      },
      {
        path: 'forget',
        Component: Forget,
      },
    ],
  },
];

export default authRoutes;
