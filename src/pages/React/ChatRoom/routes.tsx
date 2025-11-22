import { Navigate, RouteObject } from 'react-router';
import i18n from '@/utils/i18n';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import FriendList from './pages/Friend/FriendList';
import FriendPendingList from './pages/Friend/FriendPendingList';
import Conversation from './pages/Conversation';
import Group from './pages/Group';
import Friend from './pages/Friend';

const fixedRoutes: RouteObject[] = [
  {
    path: 'friend',
    handle: {
      name: i18n.t('route.chat_room_friend'),
      icon: <EmojiPeopleIcon />,
    },
    Component: Friend,
    children: [
      {
        index: true,
        Component: FriendList,
      },
      {
        path: 'pending',
        Component: FriendPendingList,
      },
    ],
  },
];

const conversationRoutes: RouteObject[] = [
  {
    path: 'conversation/:id',
    Component: Conversation,
  },
  {
    path: 'group/:id',
    Component: Group,
  },
];

const routes: RouteObject[] = [
  {
    index: true,
    element: <Navigate replace to='friend' />,
  },
  ...fixedRoutes,
  ...conversationRoutes,
];

export { fixedRoutes, conversationRoutes };

export default routes;
