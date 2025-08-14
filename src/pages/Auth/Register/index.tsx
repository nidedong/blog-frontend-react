import { LockOutlined, MailOutlined, ReadOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { message, theme, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { encryptPassword, regex } from '@/utils';
import { NavLink, useNavigate } from 'react-router';
import { useMutation } from 'react-query';
import { registerAccountApi, getCaptchaApi } from './service';
import styles from './index.module.less';
import { useRef } from 'react';

const Login = () => {
  const { token } = theme.useToken();
  const formRef = useRef<ProFormInstance>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const registerAccountQuery = useMutation(registerAccountApi);
  const getCaptchaQuery = useMutation(getCaptchaApi);

  const loading = registerAccountQuery.isLoading || getCaptchaQuery.isLoading;

  const handleFinish = (formData) => {
    if (formData.password) {
      formData.password = encryptPassword(formData.password);
    }
    registerAccountQuery.mutateAsync(formData).then((res) => {
      console.log('🚀 ~ handleFinish ~ res:', res);
      navigate('/user/login');
    });
  };

  return (
    <ProConfigProvider hashed={false}>
      <div className={styles.register} style={{ backgroundColor: token.colorBgContainer }}>
        <LoginForm
          formRef={formRef}
          logo={<ReadOutlined style={{ fontSize: 50 }} />}
          // title={t('auth.title')}
          submitter={{
            searchConfig: { submitText: t('auth.register'), resetText: t('auth.reset') },
          }}
          onFinish={handleFinish}
          loading={loading}
        >
          <Typography.Title level={3} className={styles.title}>
            {t('auth.register_account')}
          </Typography.Title>
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
          <ProFormText.Password
            name='password'
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className='prefixIcon' />,
              statusRender: (value) => {
                const getStatus = () => {
                  if (value && value.length > 10) {
                    return 'ok';
                  }
                  if (value && value.length > 6) {
                    return 'pass';
                  }
                  return 'poor';
                };
                const status = getStatus();
                if (status === 'pass') {
                  return (
                    <div style={{ color: token.colorWarning }}>
                      {t('auth.password_strength_middle')}
                    </div>
                  );
                }
                if (status === 'ok') {
                  return (
                    <div style={{ color: token.colorSuccess }}>
                      {t('auth.password_strength_hight')}
                    </div>
                  );
                }

                return (
                  <div style={{ color: token.colorError }}>{t('auth.password_strength_low')}</div>
                );
              },
            }}
            placeholder={t('auth.input_password')}
            rules={[
              {
                required: true,
                message: `${t('auth.input_password')}!`,
              },
            ]}
          />
          <ProFormText.Password
            name='confirmPassword'
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className='prefixIcon' />,
            }}
            placeholder={t('auth.input_confirm_password')}
            validateTrigger='onFinish'
            rules={[
              {
                required: true,
                message: `${t('auth.input_confirm_password')}!`,
              },
              {
                validator: (_, value) => {
                  const password = formRef.current?.getFieldValue('password');
                  if (password !== value) {
                    return Promise.reject();
                  }
                  return Promise.resolve();
                },
                message: t('auth.password_not_same'),
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
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <NavLink to='/user/login'>{t('auth.login')}</NavLink>
          </div>
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};

export default Login;
