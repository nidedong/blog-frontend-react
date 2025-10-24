import { IFileEntity } from '@/types';
import { request } from '@/utils';
import axios from 'axios';

export interface IPresignedUrlParams {
  name: string;
  isPublic?: boolean;
  mimeType: string;
  size: number;
}

export const getPresignedUploadUrlApi = (
  params: IPresignedUrlParams
): Promise<{
  uploadUrl: string;
  objectName: string;
  id: string;
}> =>
  request({
    method: 'get',
    url: '/file/presigned-upload-url',
    params,
  });

export const getPresignedDownloadUrlApi = (params: IPresignedUrlParams): Promise<string> =>
  request({
    method: 'get',
    url: '/file/presigned-download-url',
    params,
  });

export const uploadFileApi = (params: { url: string; file: File }): Promise<any> => {
  const { url, file } = params;
  return axios({
    method: 'put',
    url,
    headers: { 'Content-Type': file.type, 'Content-Length': file.size },
    data: file,
  });
};

export const finishedUploadApi = (data: { id: string }): Promise<IFileEntity> =>
  request({
    method: 'put',
    url: '/file/uploading/finished',
    data,
  });
