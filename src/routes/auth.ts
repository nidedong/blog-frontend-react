import Login from '@/pages/Login';
import { RouteObject } from 'react-router';

const authRoutes: RouteObject[] = [
  {
    path: '/login',
    Component: Login,
  },
];

export default authRoutes;
