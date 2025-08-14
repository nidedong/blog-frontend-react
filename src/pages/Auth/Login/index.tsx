import {
  GithubOutlined,
  GoogleOutlined,
  LockOutlined,
  MailOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormText,
  setAlpha,
} from '@ant-design/pro-components';
import { Space, Tabs, message, theme } from 'antd';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { encryptPassword, regex, setToken, toHome } from '@/utils';
import { NavLink } from 'react-router';
import { useMutation } from 'react-query';
import { getCaptchaApi, loginByCaptchaApi, loginByEmailApi } from './service';

type LoginType = 'email' | 'captcha';

const Login = () => {
  const { token } = theme.useToken();
  const [loginType, setLoginType] = useState<LoginType>('email');

  const { t } = useTranslation();

  const loginByEmailQuery = useMutation(loginByEmailApi, {
    onSuccess(res) {
      setToken(res.accessToken);
      toHome();
    },
  });

  const loginByCaptchaQuery = useMutation(loginByCaptchaApi, {
    onSuccess(res) {
      setToken(res.accessToken);
      toHome();
    },
  });

  const getCaptchaQuery = useMutation(getCaptchaApi);

  const loading = loginByEmailQuery.isLoading || loginByCaptchaQuery.isLoading;

  const iconStyles: CSSProperties = {
    marginInlineStart: '16px',
    color: setAlpha(token.colorTextBase, 0.2),
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
  };

  const handleFinish = (formData) => {
    if (loginType === 'email') {
      if (formData.password) {
        formData.password = encryptPassword(formData.password);
      }
      loginByEmailQuery.mutate(formData);
    } else if (loginType === 'captcha') {
      loginByCaptchaQuery.mutate(formData);
    }
  };

  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: token.colorBgContainer }}>
        <LoginForm
          logo={<ReadOutlined style={{ fontSize: 50 }} />}
          // title={t('auth.title')}
          actions={
            <Space>
              {t('auth.other_login_type')}
              <a target='_self' href='/api/user/login/github'>
                <GithubOutlined style={iconStyles} />
              </a>
              <a target='_self' href='/api/user/login/google'>
                <GoogleOutlined style={iconStyles} />
              </a>
            </Space>
          }
          submitter={{ searchConfig: { submitText: t('auth.login'), resetText: t('auth.reset') } }}
          onFinish={handleFinish}
          loading={loading}
        >
          <Tabs
            centered
            activeKey={loginType}
            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
          >
            <Tabs.TabPane key={'email'} tab={t('auth.login_by_email')} />
            <Tabs.TabPane key={'captcha'} tab={t('auth.login_by_catpcha')} />
          </Tabs>
          {loginType === 'email' && (
            <>
              <ProFormText
                name='email'
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined className='prefixIcon' />,
                }}
                placeholder={t('auth.input_email')}
                rules={[
                  {
                    required: true,
                    message: `${t('auth.input_email')}!`,
                  },
                  {
                    pattern: regex.email,
                    message: `${t('auth.email_format_error')}`,
                  },
                ]}
              />
              <ProFormText.Password
                name='password'
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className='prefixIcon' />,
                }}
                placeholder={t('auth.input_password')}
                rules={[
                  {
                    required: true,
                    message: `${t('auth.input_password')}!`,
                  },
                ]}
              />
            </>
          )}
          {loginType === 'captcha' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined className={'prefixIcon'} />,
                }}
                name='email'
                placeholder={t('auth.input_email')}
                rules={[
                  {
                    required: true,
                    message: `${t('auth.input_email')}!`,
                  },
                  {
                    pattern: regex.email,
                    message: `${t('auth.email_format_error')}`,
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className='prefixIcon' />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={t('auth.get_captcha')}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${t('auth.get_captcha')}`;
                  }
                  return t('auth.get_captcha');
                }}
                name='captcha'
                rules={[
                  {
                    required: true,
                    message: `${t('auth.input_captcha')}!`,
                  },
                ]}
                phoneName='email'
                onGetCaptcha={async (email) => {
                  getCaptchaQuery
                    .mutateAsync({
                      email,
                    })
                    .then(() => message.success(t('auth.get_captcha_success')));
                }}
              />
            </>
          )}
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <NavLink to='/user/register'>{t('auth.register_account')}</NavLink>
            <a
              style={{
                float: 'right',
              }}
            >
              {t('auth.froget_password')}
            </a>
          </div>
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};

export default Login;
