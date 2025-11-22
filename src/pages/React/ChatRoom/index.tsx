import Card from '@mui/material/Card';
import SiderMenu from './components/SiderMenu';
import Box from '@mui/material/Box';
import { Outlet } from 'react-router';

const ChatRoom = () => {
  return (
    <Card
      sx={{ width: '100%', height: '100%', overflow: 'hidden', p: 0, display: 'flex', gap: 0 }}
      variant='outlined'
    >
      <SiderMenu />
      <Box sx={{ flex: 1, minWidth: 0, height: '100%' }}>
        <Outlet />
      </Box>
    </Card>
  );
};

export default ChatRoom;
