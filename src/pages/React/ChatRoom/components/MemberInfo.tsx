import { useQuery } from '@tanstack/react-query';
import { getConvMembersApi, IGetConvMemberParams } from '../service';
import useActiveConv from '../hooks/useActiveConv';
import { head } from 'lodash-es';

const MemberInfo = () => {
  const activeConv = useActiveConv();

  const params: Partial<IGetConvMemberParams> = {
    cid: activeConv?.id,
    userId: head(activeConv?.members)?.id,
  };

  const detaiQuery = useQuery({
    queryFn: () => getConvMembersApi(params),
    queryKey: ['getConvMembersApi', params],
    enabled: !!params.cid && !!params.userId,
  });

  return <>123</>;
};

export default MemberInfo;
