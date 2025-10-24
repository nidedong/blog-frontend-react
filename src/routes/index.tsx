import BlankLayout from '@/layouts/BlankLayout';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router';
import userRoutes from './user';
import mainRoutes from './main';
import exceptionRoutes from './exception';
import { isNil } from 'lodash-es';

function fillPathForRoutes(routes: RouteObject[] | undefined, parentPath?: string) {
  if (!routes) return undefined;
  return routes.map((route) => {
    const fullPath = [parentPath, route.path]
      .filter((val) => !isNil(val))
      .join('/')
      .replace(/\/+/g, '/');

    return {
      ...route,
      handle: {
        ...route.handle,
        to: fullPath,
      },
      children: fillPathForRoutes(route.children, fullPath),
    };
  });
}

const originalRoutes: RouteObject[] = [
  {
    path: '/',
    Component: BlankLayout,
    children: [
      {
        index: true,
        element: <Navigate replace to='/home' />,
      },
      ...userRoutes,
      ...mainRoutes,
      ...exceptionRoutes,
    ],
  },
];

const routes = fillPathForRoutes(originalRoutes);

const router = createBrowserRouter(routes);

export { routes };
export default router;
