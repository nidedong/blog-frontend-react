import { finishedUploadApi, getPresignedUploadUrlApi, uploadFileApi } from '@/services';
import { useMutation } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';

const useUploadFile = () => {
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const presignedUploadUrlMutation = useMutation({
    mutationFn: getPresignedUploadUrlApi,
  });
  const uploadFileMutation = useMutation({
    mutationFn: uploadFileApi,
  });
  const finishedUploadMutation = useMutation({
    mutationFn: finishedUploadApi,
  });
  const { t } = useTranslation();

  const onUpload = useMemoizedFn(
    async (
      file: File,
      opts?: {
        isPublic?: boolean;
      }
    ) => {
      try {
        const { uploadUrl, id } = await presignedUploadUrlMutation.mutateAsync({
          name: file.name,
          mimeType: file.type,
          isPublic: opts?.isPublic,
          size: file.size,
        });

        await uploadFileMutation.mutateAsync({
          url: uploadUrl,
          file,
        });

        const fileInfo = await finishedUploadMutation.mutateAsync({
          id,
        });

        setFileUrl(fileInfo.signUrl);
      } catch (error) {
        console.log('🚀 ~ useUploadFile ~ error:', error);
        toast.error(`${t('file.upload_file_failed')}!`);
      }
    }
  );

  return {
    isLoading: presignedUploadUrlMutation.isPending || uploadFileMutation.isPending,
    isError: presignedUploadUrlMutation.isError || uploadFileMutation.isError,
    onUpload,
    fileUrl,
    setFileUrl,
  };
};

export default useUploadFile;
