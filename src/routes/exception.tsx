import NotFound from '@/pages/Exception/NotFound';
import { Navigate, RouteObject } from 'react-router';

const exceptionRoutes: RouteObject[] = [
  {
    path: 'exception',
    children: [
      {
        index: true,
        element: <Navigate replace to='404' />,
      },
      {
        path: '404',
        Component: NotFound,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate replace to='/exception/404' />,
  },
];

export default exceptionRoutes;
