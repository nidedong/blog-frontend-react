import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '@/themes/ColorModeIconDropdown';
import { SwitchLanguage } from '@/components';
import toast from 'react-hot-toast';
// import CustomDatePicker from './CustomDatePicker';
// import Search from './Search';

export default function Header() {
  return (
    <Stack
      direction='row'
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs />
      <Stack direction='row' sx={{ gap: 1 }}>
        {/* <Search /> */}
        {/* <CustomDatePicker /> */}
        <MenuButton
          showBadge
          onClick={() => {
            toast.success('测试测试测试测试测试');
          }}
        >
          <NotificationsRoundedIcon />
        </MenuButton>
        <ColorModeIconDropdown />
        <SwitchLanguage />
      </Stack>
    </Stack>
  );
}
