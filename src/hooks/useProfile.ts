import { getUserProfileApi } from '@/services';
import { useGlobalState } from '@/stores/global';
import { setUserInfo } from '@/utils/storage';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const useProfile = () => {
  const setState = useGlobalState((state) => state.setState);

  const query = useQuery({
    queryFn: () => getUserProfileApi(),
    queryKey: ['getUserProfileApi'],
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setUserInfo(query.data);
      setState({
        user: query.data,
      });
    }
  }, [query.data, query.isSuccess]);

  return query;
};

export default useProfile;
