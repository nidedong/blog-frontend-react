import { finishedUploadApi, getPresignedUploadUrlApi, uploadFileApi } from '@/services';
import { useMutation } from 'react-query';
import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RcFile } from 'antd/es/upload';

const useUploadFile = () => {
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const presignedUploadUrlMutation = useMutation(getPresignedUploadUrlApi);
  const uploadFileMutation = useMutation(uploadFileApi);
  const finishedUploadMutation = useMutation(finishedUploadApi);
  const { t } = useTranslation();

  const onUpload = useMemoizedFn(
    async (
      file: RcFile,
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
        message.error(`${t('file.upload_file_failed')}!`);
      }
    }
  );

  return {
    isLoading: presignedUploadUrlMutation.isLoading || uploadFileMutation.isLoading,
    isError: presignedUploadUrlMutation.isError || uploadFileMutation.isError,
    onUpload,
    fileUrl,
    setFileUrl,
  };
};

export default useUploadFile;
