import AuthLayout from '@/layouts/AuthLayout';
import BasicLayout from '@/layouts/BasicLayout';
import Home from '@/pages/Home';
import React from '@/pages/React';
import ThreeJs from '@/pages/ThreeJs';
import Profile from '@/pages/Profile';
import i18n from '@/utils/i18n';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { Navigate, RouteObject } from 'react-router';

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
          icon: <HomeRoundedIcon />,
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
        children: [
          {
            index: true,
            element: <Navigate replace to='/react/react1' />,
          },
          {
            path: 'react1',
            handle: {
              name: 'react1',
            },
            Component: React,
          },
          {
            path: 'react2',
            handle: {
              name: 'react2',
            },
            Component: React,
          },
          {
            path: 'react3',
            handle: {
              name: 'react3',
            },
            children: [
              {
                index: true,
                element: <Navigate replace to='/react/react3/react2' />,
              },
              {
                path: 'react2',
                handle: {
                  name: 'react2',
                },
                Component: React,
              },
              {
                path: 'react3',
                handle: {
                  name: 'react3',
                },
                Component: React,
              },
            ],
          },
        ],
      },
      {
        path: 'threejs',
        handle: {
          name: i18n.t('route.three_js'),
        },
        Component: ThreeJs,
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
