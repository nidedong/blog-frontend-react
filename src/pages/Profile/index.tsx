import React, { useEffect, useRef, useState } from 'react';
import { useGlobalState } from '@/stores/global';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { omit } from 'lodash-es';
import { genderOptions } from '@/constants';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { encryptPassword, logout, validateImg } from '@/utils';
import { changePasswordApi, getCaptchaApi, updateProfileApi } from './service';
import { useProfile, useUploadFile } from '@/hooks';
import { Controller, useForm } from 'react-hook-form';
import { IUserInfo } from '@/types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import { useCountDown } from 'ahooks';
import { Spin } from '@/components';
import { toast } from 'react-hot-toast';

interface IFormValues extends Partial<IUserInfo> {
  password?: string;
  confirmPassword?: string;
  captcha?: string;
}

const Profile: React.FC = () => {
  const user = useGlobalState((state) => state.user);
  const [tab, setTab] = useState('baseInfo');

  const fileInputRef = useRef<HTMLInputElement | null>();

  const { t } = useTranslation();
  const [targetDate, setTargetDate] = useState<number>(0);

  const { handleSubmit, control, getValues, trigger, reset } = useForm<IFormValues>();

  const profileQuery = useProfile();

  const [countdown] = useCountDown({
    targetDate,
  });

  const changePasswordMutation = useMutation(changePasswordApi, {
    onSuccess() {
      toast.success(`${t('tip.change_password_success')}!`);
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

  const getCaptchaQuery = useMutation(getCaptchaApi);

  useEffect(() => {
    if (user) {
      reset(omit(user, 'avatar'));
      setAvatarUrl(user.avatar);
    }
  }, [user]);

  const handleFinish = (formData: IFormValues) => {
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
        captcha: formData.captcha!,
      });
    }
  };

  const handleSendCaptcha = async () => {
    const isValid = await trigger('email');
    if (!isValid) return;
    const email = getValues('email')!;
    setTargetDate(Date.now() + 60000);
    getCaptchaQuery
      .mutateAsync({
        email,
      })
      .then(() => toast.success(t('auth.get_captcha_success')));
  };

  return (
    <Box sx={{ m: 'auto', width: 450 }}>
      <Stack component='form' onSubmit={handleSubmit(handleFinish)} spacing={2}>
        <TabContext value={tab}>
          <Tabs centered value={tab} onChange={(_, key) => setTab(key)}>
            <Tab value='baseInfo' label={t('user.base_info')} />
            <Tab value='changePassword' label={t('user.change_password')} />
          </Tabs>
          <TabPanel value='baseInfo' sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              name='avatar'
              control={control}
              render={({ field, fieldState }) => (
                <FormControl>
                  <FormLabel htmlFor='avatar'>{t('user.avatar')}</FormLabel>
                  <FormControl error={!!fieldState.error} fullWidth>
                    <Spin spinning={isUploading}>
                      <Avatar
                        sx={{
                          width: 120,
                          height: 120,
                          boxShadow: 3,
                          cursor: 'pointer',
                          m: 'auto',
                        }}
                        src={avatarUrl}
                        onClick={() => {
                          fileInputRef.current?.click();
                        }}
                      />
                    </Spin>

                    <input
                      ref={(el) => {
                        field.ref(el);
                        fileInputRef.current = el;
                      }}
                      type='file'
                      name='avatar'
                      hidden
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file || !validateImg(file)) return;
                        onUpload(file, {
                          isPublic: true,
                        }).then(() => {
                          field.onChange(file);
                        });
                      }}
                      accept='.jpg,.jpeg,.png,.gif,.webp'
                    />
                  </FormControl>
                </FormControl>
              )}
            ></Controller>
            <Controller
              name='email'
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <FormControl>
                    <FormLabel>{t('user.email')}</FormLabel>
                    <TextField
                      {...field}
                      variant='outlined'
                      type='email'
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                      disabled
                    />
                  </FormControl>
                );
              }}
            />
            <Controller
              name='nickName'
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <FormControl>
                    <FormLabel htmlFor='nickName'>{t('user.nick_name')}</FormLabel>
                    <TextField
                      {...field}
                      id='nickName'
                      variant='outlined'
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                    />
                  </FormControl>
                );
              }}
            />
            <Controller
              name='mobilePhone'
              control={control}
              rules={{
                pattern: {
                  value: /^1[3-9]\d{9}$/,
                  message: t('validate.phone_format_error'),
                },
              }}
              render={({ field, fieldState }) => {
                return (
                  <FormControl>
                    <FormLabel>{t('user.mobile_phone')}</FormLabel>
                    <TextField
                      {...field}
                      id='mobilePhone'
                      variant='outlined'
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                    />
                  </FormControl>
                );
              }}
            />

            <Controller
              name='gender'
              control={control}
              render={({ field }) => {
                return (
                  <FormControl>
                    <FormLabel htmlFor='gender'>{t('user.gender')}</FormLabel>
                    <RadioGroup {...field} value={String(field.value)} id='gender' row>
                      {genderOptions?.map((opt) => (
                        <FormControlLabel label={opt.label} value={opt.value} control={<Radio />} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                );
              }}
            />

            <Controller
              name='remark'
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <FormControl>
                    <FormLabel htmlFor='remark'>{t('user.remark')}</FormLabel>
                    <TextField
                      {...field}
                      id='remark'
                      multiline
                      rows={4}
                      maxRows={6}
                      variant='outlined'
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                    />
                  </FormControl>
                );
              }}
            />

            <Button
              variant='outlined'
              type='submit'
              fullWidth
              loading={updateProfileMutation.isLoading}
            >
              {t('user.change_profile_info')}
            </Button>
          </TabPanel>
          <TabPanel
            value='changePassword'
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Controller
              name='email'
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <FormControl>
                    <FormLabel>{t('user.email')}</FormLabel>
                    <TextField
                      {...field}
                      variant='outlined'
                      type='email'
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                      disabled
                    />
                  </FormControl>
                );
              }}
            />
            <Controller
              name='password'
              control={control}
              rules={{ required: t('auth.input_new_password') }}
              render={({ field, fieldState }) => (
                <FormControl>
                  <FormLabel htmlFor='password'>{t('auth.new_password')}</FormLabel>
                  <TextField
                    {...field}
                    id='password'
                    type='password'
                    fullWidth
                    placeholder='••••••'
                    variant='outlined'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                </FormControl>
              )}
            />
            <Controller
              name='confirmPassword'
              control={control}
              rules={{
                required: t('auth.input_confirm_password'),
                validate: (value) => getValues('password') === value || t('auth.password_not_same'),
              }}
              render={({ field, fieldState }) => (
                <FormControl>
                  <FormLabel htmlFor='confirmPassword'>{t('auth.confirm_password')}</FormLabel>
                  <TextField
                    {...field}
                    id='confirmPassword'
                    type='password'
                    fullWidth
                    placeholder='••••••'
                    variant='outlined'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                </FormControl>
              )}
            />
            <Controller
              name='captcha'
              control={control}
              rules={{ required: t('auth.input_captcha') }}
              render={({ field, fieldState }) => (
                <Stack spacing={0}>
                  <FormLabel htmlFor='captcha'>{t('auth.captcha')}</FormLabel>
                  <FormControl error={!!fieldState.error}>
                    <Box sx={{ display: 'flex', alignItems: 'stretch', columnGap: 2 }}>
                      <TextField
                        {...field}
                        fullWidth
                        id='captcha'
                        placeholder={t('auth.input_captcha')}
                        variant='outlined'
                      />
                      <Button
                        sx={{ whiteSpace: 'nowrap', width: 200 }}
                        variant='outlined'
                        onClick={handleSendCaptcha}
                        disabled={countdown !== 0}
                        size='large'
                      >
                        {t('auth.get_captcha')}
                        {countdown !== 0 ? `(${Math.round(countdown / 1000)})` : ''}
                      </Button>
                    </Box>
                    {fieldState.error?.message && (
                      <FormHelperText>{fieldState.error?.message}</FormHelperText>
                    )}
                  </FormControl>
                </Stack>
              )}
            />
            <Button
              variant='outlined'
              type='submit'
              fullWidth
              loading={changePasswordMutation.isLoading}
            >
              {t('user.change_password')}
            </Button>
            <Button
              variant='outlined'
              fullWidth
              onClick={() => toast.success(`${t('tip.change_password_success')}!`)}
            >
              {t('user.change_password')}
            </Button>
          </TabPanel>
        </TabContext>
      </Stack>
    </Box>
  );
};

export default Profile;
