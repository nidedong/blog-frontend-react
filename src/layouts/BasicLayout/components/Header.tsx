import Stack from '@mui/material/Stack';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '@/themes/ColorModeIconDropdown';
import { SwitchLanguage } from '@/components';
import { useGlobalState } from '@/stores/global';
import { sum } from 'lodash-es';
import Popover from '@mui/material/Popover';
import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import InBox from './InBox';
import { Player } from '@lordicon/react';
import { useTheme } from '@mui/material/styles';
import BellIcon from '@/assets/lordicon/bell.json';
import { useMount, useUpdateEffect } from 'ahooks';

// import CustomDatePicker from './CustomDatePicker';
// import Search from './Search';

export default function Header() {
  const user = useGlobalState((state) => state.user);
  const [inBoxEl, setInBoxEl] = useState<HTMLElement | null>(null);
  const inBoxElOpen = !!inBoxEl;
  const playBellRef = useRef<Player>(null);
  const theme = useTheme();
  const [bellState, setBellState] = useState<string | undefined>('in-bell');

  useMount(() => {
    playBellRef.current?.playFromBeginning();
  });

  const badgeCount = sum([
    user?.badges?.message,
    user?.badges?.notification,
    user?.badges?.friendreq,
  ]);

  const showBadge = badgeCount > 0;

  const handleInBoxClose = () => setInBoxEl(null);
  const handleInBoxOpen: MouseEventHandler<HTMLButtonElement> = (e) => {
    setInBoxEl(e.currentTarget);
    if (bellState === 'loop-bell') {
      playBellRef.current?.goToFirstFrame();
    }
  };

  useUpdateEffect(() => {
    if (playBellRef.current?.isPlaying || badgeCount <= 0) {
      return;
    }
    setBellState('loop-bell');
    playBellRef.current?.playFromBeginning();
  }, [badgeCount]);

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
        pb: 1,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs />
      <Stack direction='row' sx={{ gap: 1 }}>
        {/* <Search /> */}
        {/* <CustomDatePicker /> */}
        <MenuButton showBadge={showBadge} onClick={handleInBoxOpen}>
          <Player
            ref={playBellRef}
            state={bellState}
            size={18}
            colorize={theme.vars?.palette.text.primary}
            icon={BellIcon}
            onComplete={() => {
              if (bellState === 'loop-bell') {
                playBellRef.current?.playFromBeginning();
              }
            }}
          />
        </MenuButton>
        <ColorModeIconDropdown />
        <SwitchLanguage />
      </Stack>
      <Popover
        open={inBoxElOpen}
        anchorEl={inBoxEl}
        onClose={handleInBoxClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
            },
          },
        }}
      >
        <InBox setInBoxEl={setInBoxEl} />
      </Popover>
    </Stack>
  );
}
