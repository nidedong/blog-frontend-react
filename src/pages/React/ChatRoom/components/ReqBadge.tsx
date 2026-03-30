import { BadgeCount } from '@/components';
import { useGlobalState } from '@/stores/global';

const ReqBadge = () => {
  const user = useGlobalState((state) => state.user);
  return <BadgeCount count={user?.badges.friendreq} />;
};

export default ReqBadge;
