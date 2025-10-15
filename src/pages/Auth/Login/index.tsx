import { message } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { encryptPassword, setToken, toHome } from '@/utils';
import { NavLink } from 'react-router';
import { useMutation } from 'react-query';
import { getCaptchaApi, loginByCaptchaApi, loginByEmailApi } from './service';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import { useCountDown } from 'ahooks';
import { pick } from 'lodash-es';
import Container from '../components/Container';
import Card from '../components/Card';
import { GoogleIcon, LogoIcon, GithubIcon } from '@/components';

type LoginType = 'email' | 'captcha';

export interface FormValues {
  email: string;
  captcha?: string;
  password?: string;
}

const Login = () => {
  const { t } = useTranslation();
  const [loginType, setLoginType] = useState<LoginType>('email');
  const [targetDate, setTargetDate] = useState<number>(0);

  const [countdown] = useCountDown({
    targetDate,
  });

  const { handleSubmit, control, trigger, getValues, reset } = useForm<FormValues>({
    defaultValues: {
      email: '',
      captcha: '',
      password: '',
    },
  });

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

  const onSubmit = (formData: FormValues) => {
    if (loginType === 'email') {
      if (formData.password) {
        formData.password = encryptPassword(formData.password);
      }
      loginByEmailQuery.mutate(pick(formData, 'email', 'password') as any);
    } else if (loginType === 'captcha') {
      loginByCaptchaQuery.mutate(pick(formData, 'email', 'captcha') as any);
    }
  };

  const handleSendCaptcha = async () => {
    const isValid = await trigger('email');
    if (!isValid) return;
    const email = getValues('email');
    setTargetDate(Date.now() + 60000);
    getCaptchaQuery
      .mutateAsync({
        email,
      })
      .then(() => message.success(t('auth.get_captcha_success')));
  };

  return (
    <Container>
      <Card variant='outlined'>
        <LogoIcon />
        <Typography variant='h4' sx={{ fontWeight: 500 }}>
          {t('auth.login')}
        </Typography>

        <Box
          component='form'
          sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
          onSubmit={handleSubmit(onSubmit)}
        >
          {loginType === 'email' ? (
            <>
              <Controller
                name='email'
                control={control}
                rules={{ required: t('auth.input_email') }}
                render={({ field, fieldState }) => (
                  <FormControl>
                    <FormLabel htmlFor='email'>{t('auth.email')}</FormLabel>
                    <TextField
                      {...field}
                      type='email'
                      placeholder='your@email.com'
                      id='email'
                      fullWidth
                      variant='outlined'
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  </FormControl>
                )}
              />

              <Controller
                name='password'
                control={control}
                rules={{ required: t('auth.input_password') }}
                render={({ field, fieldState }) => (
                  <FormControl>
                    <FormLabel htmlFor='password'>{t('auth.password')}</FormLabel>
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
            </>
          ) : (
            <>
              <Controller
                name='email'
                control={control}
                rules={{ required: t('auth.input_email') }}
                render={({ field, fieldState }) => (
                  <FormControl>
                    <FormLabel htmlFor='email'>{t('auth.email')}</FormLabel>
                    <TextField
                      {...field}
                      id='email'
                      type='email'
                      placeholder='your@email.com'
                      fullWidth
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
                  <div>
                    <FormLabel htmlFor='captcha'>{t('auth.captcha')}</FormLabel>
                    <FormControl error={!!fieldState.error}>
                      <Box sx={{ display: 'flex', alignItems: 'stretch', columnGap: 2, mt: 1 }}>
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
                  </div>
                )}
              />
            </>
          )}

          <Button size='large' loading={loading} type='submit' variant='contained' fullWidth>
            {t('auth.login')}
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {loginType === 'email' ? (
              <Link
                underline='hover'
                color='primary'
                variant='body2'
                onClick={() => {
                  reset();
                  setLoginType('captcha');
                }}
              >
                {t('auth.login_by_catpcha')}
              </Link>
            ) : (
              <Link
                underline='hover'
                color='primary'
                variant='body2'
                onClick={() => {
                  reset();
                  setLoginType('email');
                }}
              >
                {t('auth.login_by_email')}
              </Link>
            )}
            <Link
              component={NavLink}
              to='/user/forget'
              underline='hover'
              variant='body2'
              color='primary'
              sx={{ alignSelf: 'center' }}
            >
              {t('auth.froget_password')}？
            </Link>
          </Box>

          <Divider>or</Divider>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant='outlined'
              href='/api/user/login/google'
              startIcon={<GoogleIcon />}
            >
              {t('auth.login_by_google')}
            </Button>
            <Button
              fullWidth
              variant='outlined'
              href='/api/user/login/github'
              startIcon={<GithubIcon />}
            >
              {t('auth.login_by_github')}
            </Button>
          </Box>

          <Typography variant='body2' sx={{ alignSelf: 'center' }}>
            {t('auth.dont_have_account')}？{' '}
            <Link component={NavLink} to='/user/register' color='primary' underline='hover'>
              {t('auth.register_account')}
            </Link>
          </Typography>
        </Box>
      </Card>
    </Container>
  );
};

export default Login;
