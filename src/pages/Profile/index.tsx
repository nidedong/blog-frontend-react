import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import { useGlobalState } from '@/stores/global';
import { message, Tabs, theme, Upload } from 'antd';
import {
  ProForm,
  ProFormCaptcha,
  ProFormInstance,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import { LockOutlined } from '@ant-design/icons';
import { useMutation } from 'react-query';
import { nth, omit } from 'lodash-es';
import { genderOptions } from '@/constants';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd/es/upload/interface';
import { encryptPassword, logout, validateImg } from '@/utils';
import { changePasswordApi, getCaptchaApi, updateProfileApi } from './service';
import { useProfile, useUploadFile } from '@/hooks';

const Profile: React.FC = () => {
  const user = useGlobalState((state) => state.user);
  const formRef = useRef<ProFormInstance>();
  const [tab, setTab] = useState('baseInfo');
  const { token } = theme.useToken();

  const { t } = useTranslation();

  const profileQuery = useProfile();

  const changePasswordMutation = useMutation(changePasswordApi, {
    onSuccess() {
      message.success(`${t('tip.change_password_success')}!`);
      logout();
    },
  });

  const updateProfileMutation = useMutation(updateProfileApi, {
    onSuccess() {
      profileQuery.refetch();
    },
  });

  const {
    fileUrl: avatarUrl,
    isLoading: isUploading,
    onUpload,
    setFileUrl: setAvatarUrl,
  } = useUploadFile();

  const uploadButton = (
    <div>
      {isUploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const getCaptchaQuery = useMutation(getCaptchaApi);

  useEffect(() => {
    if (user) {
      formRef.current?.setFieldsValue(user);
      setAvatarUrl(user.avatar);
    }
  }, [user]);

  const handleBeforeUpload: UploadProps['beforeUpload'] = async (file) => {
    if (!validateImg(file)) return false;
    onUpload(file, {
      isPublic: true,
    });
    return false;
  };

  const handleFinish = (formData) => {
    if (tab === 'baseInfo') {
      const params = omit(formData, 'email');
      updateProfileMutation.mutate({
        ...params,
        avatar: avatarUrl,
      });
    } else {
      const newPassword = encryptPassword(formData.password);
      changePasswordMutation.mutateAsync({
        password: newPassword!,
        captcha: formData.captcha,
      });
    }
  };

  const isLoading = changePasswordMutation.isLoading || updateProfileMutation.isLoading;

  return (
    <div className={styles.profile}>
      <ProForm
        formRef={formRef}
        submitter={{
          render: (_, dom) => {
            return <div className={styles.submitter}>{nth(dom, 1)}</div>;
          },
        }}
        onFinish={handleFinish}
        loading={isLoading}
      >
        <Tabs
          centered
          activeKey={tab}
          onChange={(key) => setTab(key)}
          items={[
            {
              label: t('user.base_info'),
              key: 'baseInfo',
              children: (
                <>
                  <ProForm.Item name='avatar' label={t('user.avatar')}>
                    <Upload
                      beforeUpload={handleBeforeUpload}
                      listType='picture-card'
                      showUploadList={false}
                      maxCount={1}
                      accept='.jpg,.jpeg,.png,.gif,.webp'
                    >
                      {avatarUrl ? (
                        <img className={styles.avatar} src={avatarUrl} alt='avatar' />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                  </ProForm.Item>
                  <ProFormText name='email' label={t('user.email')} disabled />
                  <ProFormText name='nickName' label={t('user.nick_name')} />
                  <ProFormText
                    rules={[
                      {
                        pattern: /^1[3-9]\d{9}$/,
                        message: t('validate.phone_format_error'),
                      },
                    ]}
                    name='mobilePhone'
                    label={t('user.mobile_phone')}
                  />
                  <ProFormRadio.Group
                    options={genderOptions}
                    name='gender'
                    label={t('user.gender')}
                  />
                  <ProFormTextArea
                    fieldProps={{ rows: 3 }}
                    name='remark'
                    label={t('user.remark')}
                  />
                </>
              ),
            },
            {
              label: t('user.change_password'),
              key: 'changePassword',
              children: (
                <>
                  <ProFormText name='email' label={t('user.email')} disabled />
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
                          <div style={{ color: token.colorError }}>
                            {t('auth.password_strength_low')}
                          </div>
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
                </>
              ),
            },
          ]}
        ></Tabs>
      </ProForm>
    </div>
  );
};

export default Profile;
