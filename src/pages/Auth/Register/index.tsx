import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { encryptPassword } from '@/utils';
import { NavLink, useNavigate } from 'react-router';
import { useMutation } from 'react-query';
import { registerAccountApi, getCaptchaApi, IRegisterAccountParams } from './service';
import { useState } from 'react';
import { omit } from 'lodash-es';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import FormLabel from '@mui/material/FormLabel';
import { Controller, useForm } from 'react-hook-form';
import { useCountDown } from 'ahooks';
import Card from '../components/Card';
import { LogoIcon } from '@/components';
import Container from '../components/Container';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

export interface FormValues {
  email: string;
  captcha?: string;
  password?: string;
  confirmPassword?: string;
}

const Register = () => {
  const { t } = useTranslation();

  const [targetDate, setTargetDate] = useState<number>(0);

  const [countdown] = useCountDown({
    targetDate,
  });

  const { getValues, control, handleSubmit, trigger } = useForm<FormValues>({
    defaultValues: {
      email: '',
      captcha: '',
      password: '',
      confirmPassword: '',
    },
  });

  const navigate = useNavigate();

  const registerAccountQuery = useMutation(registerAccountApi);
  const getCaptchaQuery = useMutation(getCaptchaApi);

  const loading = registerAccountQuery.isLoading || getCaptchaQuery.isLoading;

  const onSubmit = (formData) => {
    if (formData.password) {
      formData.password = encryptPassword(formData.password);
    }
    registerAccountQuery
      .mutateAsync(omit(formData, 'confirmPassword') as IRegisterAccountParams)
      .then(() => {
        navigate('/user/login');
      });
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
          {t('auth.register_account')}
        </Typography>

        <Box
          component='form'
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
        >
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

          <Button size='large' loading={loading} type='submit' variant='contained' fullWidth>
            {t('auth.register')}
          </Button>
        </Box>

        <Box className='flex items-center justify-between' sx={{ mt: 2 }}>
          <Typography variant='body2'>
            {t('auth.already_have_account')}？{' '}
            <Link component={NavLink} to='/user/login' color='primary' underline='hover'>
              {t('auth.go_to_login')}
            </Link>
          </Typography>
          <Link
            component={NavLink}
            to='/user/forget'
            underline='hover'
            variant='body2'
            color='primary'
          >
            {t('auth.froget_password')}？
          </Link>
        </Box>
      </Card>
    </Container>
  );
};

export default Register;
