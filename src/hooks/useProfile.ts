import { getUserProfileApi } from '@/services';
import { useGlobalState } from '@/stores/global';
import { setUserInfo } from '@/utils/storage';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const useProfile = () => {
  const initState = useGlobalState((state) => state.initState);

  const query = useQuery({
    queryFn: () => getUserProfileApi(),
    queryKey: ['getUserProfileApi'],
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setUserInfo(query.data);
      initState(query.data);
    }
  }, [query.data, query.isSuccess]);

  return query;
};

export default useProfile;
