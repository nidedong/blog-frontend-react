import React, { useMemo } from 'react';
import styles from './index.module.less';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { routes } from '@/routes';
import { get } from 'lodash-es';
import { GithubFilled, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { PageContainer, ProConfigProvider, ProLayout } from '@ant-design/pro-components';
import { Dropdown } from 'antd';
import { routeObj2MenuDataItem } from './utils';
import { safeShowValue, setToken, toLogin } from '@/utils';
import { useMutation, useQueryClient } from 'react-query';
import { logoutApi } from '@/services/common';
import { useGlobalState } from '@/stores/global';
import { useProfile } from '@/hooks';
import { SwitchLanguage } from '@/components';
import { t } from 'i18next';

const BasicLayout: React.FC = () => {
  // 匹配当前路由及其子路由
  const location = useLocation();
  const navigate = useNavigate();
  const mainRoute = useMemo(() => {
    return routeObj2MenuDataItem(get(routes, '[0].children')?.find((route) => route.path === '/'));
  }, []);

  const queryClient = useQueryClient();
  const profile = useGlobalState((state) => state.user);

  const profileQuery = useProfile();

  const logoutMutate = useMutation(logoutApi, {
    onSuccess() {
      setToken(undefined);
      toLogin();
      setTimeout(() => {
        queryClient.clear();
      }, 100);
    },
  });

  const handleLogout = () => {
    logoutMutate.mutate();
  };

  return (
    <div className={styles.basicLayout}>
      <ProConfigProvider hashed={false}>
        <ProLayout
          route={mainRoute}
          loading={profileQuery.isLoading}
          bgLayoutImgList={[
            {
              src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
              left: 85,
              bottom: 100,
              height: '303px',
            },
            {
              src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
              bottom: -68,
              right: -45,
              height: '303px',
            },
            {
              src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
              bottom: 0,
              left: 0,
              width: '331px',
            },
          ]}
          location={{
            pathname: location.pathname,
          }}
          token={{
            header: {
              colorBgMenuItemSelected: 'rgba(0,0,0,0.04)',
            },
          }}
          siderMenuType='group'
          menu={{
            collapsedShowGroupTitle: true,
          }}
          avatarProps={{
            src: safeShowValue(
              profile?.avatar,
              'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg'
            ),
            size: 'small',
            title: safeShowValue(profile?.nickName),
            render: (_, dom) => {
              return (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'profile',
                        icon: <UserOutlined />,
                        label: t('user.profile'),
                        onClick() {
                          navigate('/profile');
                        },
                      },
                      {
                        key: 'logout',
                        icon: <LogoutOutlined />,
                        label: t('user.logout'),
                        onClick: handleLogout,
                      },
                    ],
                  }}
                >
                  {dom}
                </Dropdown>
              );
            },
          }}
          actionsRender={() => {
            return [
              <a
                target='_blank'
                style={{ display: 'flex' }}
                href='https://github.com/nidedong/blog-frontend-react'
              >
                <GithubFilled key='GithubFilled' />
              </a>,
              <SwitchLanguage />,
            ];
          }}
          headerTitleRender={(logo, title) => {
            return (
              <a>
                {logo}
                {title}
              </a>
            );
          }}
          onMenuHeaderClick={(e) => console.log(e)}
          menuItemRender={(item, dom) => {
            return (
              <div
                onClick={() => {
                  navigate(item.path || '/');
                }}
              >
                {dom}
              </div>
            );
          }}
          fixSiderbar
          splitMenus
          layout='mix'
        >
          <PageContainer
            token={{
              paddingInlinePageContainerContent: 20,
            }}
            // subTitle='简单的描述'
          >
            <Outlet />
          </PageContainer>
        </ProLayout>
      </ProConfigProvider>
    </div>
  );
};

export default BasicLayout;
