import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
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
    ],
  },
];

export default authRoutes;
