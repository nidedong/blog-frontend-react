import { getUserOnlineStatusBatchApi } from '@/services';
import { usePresenceState } from '@/stores/presence';
import { useMutation } from '@tanstack/react-query';

const usePresenceMutation = () => {
  const merge = usePresenceState((s) => s.merge);
  return useMutation({
    mutationFn: getUserOnlineStatusBatchApi,
    onSuccess(data) {
      merge(data);
    },
  });
};

export default usePresenceMutation;
