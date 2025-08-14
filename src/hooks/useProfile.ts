import { getUserProfileApi } from '@/services';
import { useGlobalState } from '@/stores/global';
import { setUserInfo } from '@/utils/storage';
import { useQuery } from 'react-query';

const useProfile = () => {
  const setState = useGlobalState((state) => state.setState);

  return useQuery({
    queryFn: () => getUserProfileApi(),
    queryKey: ['getUserProfileApi'],
    onSuccess(data) {
      setUserInfo(data);
      setState({
        user: data,
      });
    },
  });
};

export default useProfile;
