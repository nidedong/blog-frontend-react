import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './MenuContent';
import OptionsMenu from './OptionsMenu';
import { useTranslation } from 'react-i18next';
import { LogoIcon } from '@/components';
import { safeShowValue } from '@/utils';
import { useGlobalState } from '@/stores/global';
import { useProfile } from '@/hooks';
import Skeleton from '@mui/material/Skeleton';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

const ProfileSkeleton = () => {
  return (
    <>
      <Skeleton variant='circular' width={36} height={36} />
      <Box sx={{ flex: 1 }}>
        <Skeleton height={16} />
        <Skeleton height={14} />
      </Box>
    </>
  );
};

export default function SideMenu() {
  const { t } = useTranslation();
  const profile = useGlobalState((state) => state.user);

  const { isLoading } = useProfile();

  return (
    <Drawer
      variant='permanent'
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      {/* todo Logo */}
      <Stack direction='row' sx={{ alignItems: 'center', p: 1 }}>
        <LogoIcon />
        <Typography variant='h1' sx={{ m: '8px 0 !important' }}>
          {t('app.title')}
        </Typography>
      </Stack>
      <Divider />
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent />
      </Box>
      <Stack
        direction='row'
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <>
            <Avatar sizes='small' src={profile?.avatar} sx={{ width: 36, height: 36 }} />
            <Box sx={{ mr: 'auto' }}>
              <Typography
                variant='body2'
                noWrap
                sx={{ fontWeight: 500, lineHeight: '16px', width: 120 }}
              >
                {safeShowValue(profile?.nickName)}
              </Typography>
              <Typography
                variant='caption'
                noWrap
                sx={{ color: 'text.secondary', width: 120, height: 14 }}
              >
                {safeShowValue(profile?.email)}
              </Typography>
            </Box>
          </>
        )}

        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
