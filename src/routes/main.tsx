import AuthLayout from '@/layouts/AuthLayout';
import BasicLayout from '@/layouts/BasicLayout';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import { RouteObject } from 'react-router';
import i18n from '@/utils/i18n';

const mainRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <AuthLayout>
        <BasicLayout />
      </AuthLayout>
    ),
    children: [
      {
        path: 'home',
        handle: {
          name: i18n.t('route.home'),
        },
        Component: Home,
      },
      {
        path: 'profile',
        handle: {
          name: i18n.t('route.user_center'),
          hideInMenu: true,
        },
        Component: Profile,
      },
      {
        path: 'react',
        handle: {
          name: i18n.t('route.react'),
        },
        Component: Home,
      },
      {
        path: 'threejs',
        handle: {
          name: i18n.t('route.three_js'),
        },
        Component: Home,
      },
      {
        path: 'vuejs',
        handle: {
          name: i18n.t('route.vue_js'),
        },
        Component: Home,
      },
    ],
  },
];

export default mainRoutes;
